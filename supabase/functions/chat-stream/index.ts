
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for API key
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the request payload
    const { messages, systemMessage, functionDefs } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request. Messages array is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Prepare complete message array with system message
    const completeMessages = [
      { role: "system", content: systemMessage || "You are a helpful assistant." },
      ...messages.map((msg: any) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }))
    ];

    console.log(`Processing chat request with ${completeMessages.length} messages`);

    // Prepare OpenAI API request
    const payload: any = {
      model: "gpt-4o",
      messages: completeMessages,
      temperature: 0.7,
      stream: true
    };

    // Add function definitions if provided
    if (functionDefs && Array.isArray(functionDefs) && functionDefs.length > 0) {
      payload.functions = functionDefs;
      payload.function_call = "auto";
    }

    // Make a streaming request to OpenAI API
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` }),
        { status: openAIResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a ReadableStream to handle the streaming response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Transform the response stream
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Process the response chunks
    (async () => {
      const reader = openAIResponse.body?.getReader();
      if (!reader) {
        writer.write(encoder.encode(`data: ${JSON.stringify({ error: "Failed to get response reader" })}\n\n`));
        writer.close();
        return;
      }

      let functionCall = null;
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = (buffer + chunk).split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                if (functionCall) {
                  // Send complete function call data
                  writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'function_call', data: functionCall })}\n\n`));
                }
                writer.write(encoder.encode(`data: [DONE]\n\n`));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices[0]?.delta;

                if (delta?.content) {
                  writer.write(encoder.encode(`data: ${JSON.stringify({ type: 'content', data: delta.content })}\n\n`));
                }

                if (delta?.function_call) {
                  if (!functionCall) {
                    functionCall = { name: delta.function_call.name, arguments: '' };
                  }
                  if (delta.function_call.arguments) {
                    functionCall.arguments += delta.function_call.arguments;
                  }
                }
              } catch (parseError) {
                console.error("Error parsing SSE data:", parseError);
              }
            }
          }
        }
      } catch (streamError) {
        console.error("Stream processing error:", streamError);
        writer.write(encoder.encode(`data: ${JSON.stringify({ error: "Stream processing error" })}\n\n`));
      } finally {
        writer.close();
      }
    })();

    return new Response(stream.readable, { headers: corsHeaders });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

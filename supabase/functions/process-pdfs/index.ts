import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get all PDF files that haven't been processed yet
    const { data: pdfFiles, error: pdfError } = await supabase
      .from('pdf_files')
      .select('id, file_path')
      .not('id', 'in', (
        supabase
          .from('pdf_processed_content')
          .select('pdf_id')
      ));

    if (pdfError) throw pdfError;
    
    console.log(`Found ${pdfFiles?.length ?? 0} PDFs to process`);

    if (!pdfFiles || pdfFiles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No new PDFs to process' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    for (const pdf of pdfFiles) {
      // Download the PDF file
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('pdfs')
        .download(pdf.file_path);

      if (downloadError) {
        console.error(`Error downloading PDF ${pdf.id}:`, downloadError);
        continue;
      }

      // Convert the file to base64
      const reader = new FileReader();
      const base64String = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(fileData);
      });

      // Process with OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an assistant that processes PDF documents and extracts key information."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Please process this PDF and extract key information:",
                },
                {
                  type: "file_url",
                  file_url: base64String,
                },
              ],
            },
          ],
        }),
      });

      const aiResponse = await response.json();
      
      // Store the processed content
      const { error: insertError } = await supabase
        .from('pdf_processed_content')
        .insert({
          pdf_id: pdf.id,
          content: aiResponse.choices[0].message.content,
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error(`Error storing processed content for PDF ${pdf.id}:`, insertError);
      } else {
        console.log(`Successfully processed PDF ${pdf.id}`);
      }
    }

    return new Response(
      JSON.stringify({ message: 'PDFs processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
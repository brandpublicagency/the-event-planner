
/**
 * Helper for making OpenAI API requests
 */
export const getChatCompletion = async (systemPrompt: string) => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!apiKey) {
    console.error("OpenAI API key is not configured");
    throw new Error("OpenAI API key is not configured");
  }
  
  try {
    console.log("Making OpenAI request with system prompt:", systemPrompt.substring(0, 100) + "...");
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          }
        ],
        temperature: 0.5, // Lower temperature for more consistent responses
        max_tokens: 150,
        top_p: 0.9, // Slightly more focused sampling
        presence_penalty: 0.1 // Small penalty to encourage specific formats
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    console.log("Received content from OpenAI:", content);
    return content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
};

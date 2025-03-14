
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body as form data
    const formData = await req.formData();
    console.log("Received form data:", Object.fromEntries(formData.entries()));

    // Extract data from form
    const eventName = formData.get("event_name") as string;
    const eventType = formData.get("event_type") as string;
    const eventDate = formData.get("event_date") as string;
    const pax = formData.get("pax") ? parseInt(formData.get("pax") as string) : null;
    
    // Contact details
    const primaryName = formData.get("primary_name") as string;
    const primaryEmail = formData.get("primary_email") as string;
    const primaryPhone = formData.get("primary_phone") as string;
    const company = formData.get("company") as string;
    const vatNumber = formData.get("vat_number") as string;
    const address = formData.get("address") as string;

    // Venue selection
    const venueData = formData.get("venue") as string;
    const venues = venueData ? [venueData] : [];

    // Generate a unique event code
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    const eventCode = `EVENT-${day}${month}${year}-${random}`;

    // Format address for db
    const formattedAddress = address ? address : null;

    // Create initial event notes if description provided
    const description = formData.get("message") as string;
    const formattedDescription = description ? description : null;

    // Insert data into events table
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .insert({
        event_code: eventCode,
        name: eventName,
        event_type: eventType,
        event_date: eventDate || null,
        pax: pax,
        description: formattedDescription,
        primary_name: primaryName || null,
        primary_email: primaryEmail || null,
        primary_phone: primaryPhone || null,
        company: company || null,
        vat_number: vatNumber || null,
        address: formattedAddress,
        venues: venues,
        completed: false,
      })
      .select();

    if (eventError) {
      console.error("Error creating event:", eventError);
      throw eventError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Event created successfully",
        eventCode,
        data: eventData
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An error occurred processing the webhook",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});

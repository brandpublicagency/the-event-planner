import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_RECIPIENTS = 10;
const MAX_SUBJECT_LENGTH = 200;
const MAX_HTML_LENGTH = 50000;

const ALLOWED_TEMPLATES: Record<string, { subject: string; buildHtml: (params: Record<string, string>) => string }> = {
  team_invitation: {
    subject: "You've been invited to join a team",
    buildHtml: (params) => `
      <h2>Team Invitation</h2>
      <p>You have been invited to join ${sanitize(params.teamName || 'the team')}.</p>
      <p>Log in to your account to get started.</p>
    `,
  },
  event_notification: {
    subject: "Event Update",
    buildHtml: (params) => `
      <h2>Event Update</h2>
      <p>${sanitize(params.message || 'You have a new event notification.')}</p>
    `,
  },
};

function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, (c) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
    return map[c] || c;
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

interface TemplateEmailRequest {
  to: string[];
  template: string;
  params?: Record<string, string>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { to, template, params = {} } = body as TemplateEmailRequest;

    // Validate recipients
    if (!Array.isArray(to) || to.length === 0 || to.length > MAX_RECIPIENTS) {
      return new Response(
        JSON.stringify({ error: `Provide between 1 and ${MAX_RECIPIENTS} recipients.` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const email of to) {
      if (typeof email !== "string" || !isValidEmail(email)) {
        return new Response(
          JSON.stringify({ error: "One or more recipient email addresses are invalid." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate template
    if (!template || !ALLOWED_TEMPLATES[template]) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing email template." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tmpl = ALLOWED_TEMPLATES[template];
    const html = tmpl.buildHtml(params);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Event Assistant <onboarding@resend.dev>",
        to,
        subject: tmpl.subject,
        html,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Resend API error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);

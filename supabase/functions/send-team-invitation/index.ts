import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getAuthenticatedUserId } from "../_shared/auth.ts";

const MAX_RECIPIENTS = 10;

const escapeHtml = (value: string): string =>
  value.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c] as string));

const isValidEmail = (email: unknown): email is string =>
  typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const cleanText = (value: unknown, max: number): string =>
  typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  teamName: string;
  inviterName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const userId = await getAuthenticatedUserId(req);
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Partial<EmailRequest>;
    const to = Array.isArray(body.to) ? body.to : [];
    if (to.length === 0 || to.length > MAX_RECIPIENTS || !to.every(isValidEmail)) {
      return new Response(JSON.stringify({ error: "Provide between 1 and 10 valid email addresses." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const teamName = cleanText(body.teamName, 100) || "the team";
    const inviterName = cleanText(body.inviterName, 100) || "A colleague";
    const appUrl = Deno.env.get("APP_URL") ?? "";
    const acceptUrl = `${appUrl}/login?email=${encodeURIComponent(to[0])}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Team Assistant <onboarding@resend.dev>",
        to,
        subject: `You've been invited to join ${teamName}`,
        html: `
          <h2>Team Invitation</h2>
          <p>${escapeHtml(inviterName)} has invited you to join ${escapeHtml(teamName)}.</p>
          <p>Click the link below to accept the invitation and create your account:</p>
          <a href="${escapeHtml(acceptUrl)}">Accept Invitation</a>
        `,
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
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error: "Failed to send invitation." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-team-invitation function:", error);
    return new Response(JSON.stringify({ error: "An internal error occurred." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
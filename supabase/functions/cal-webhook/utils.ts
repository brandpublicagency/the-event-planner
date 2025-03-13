
/**
 * Verifies the Cal.com webhook signature
 * Cal.com uses HMAC SHA-256 for webhook signature verification
 */
export function verifyWebhookSignature(signature: string, body: string, secret: string): boolean {
  if (!signature || !secret) {
    return false;
  }
  
  // Import crypto functions from Deno standard library
  const encoder = new TextEncoder();
  const key = encoder.encode(secret);
  const message = encoder.encode(body);
  
  // Create HMAC
  const hmacKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  
  // Generate signature
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    hmacKey,
    message
  );
  
  // Convert to hex
  const signatureHex = Array.from(new Uint8Array(signatureBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Compare signatures
  return signature === signatureHex;
}

/**
 * Formats dates from Cal.com format to our application format
 */
export function formatCalDate(dateString: string): { date: string, time: string } {
  const date = new Date(dateString);
  
  return {
    date: date.toISOString().split('T')[0],
    time: date.toISOString().split('T')[1].substring(0, 5)
  };
}

/**
 * Generates a unique event code for our system
 */
export function generateEventCode(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const timestamp = date.getTime().toString().slice(-4);
  
  return `EVENT-${dateStr}-${timestamp}`;
}


/**
 * Verifies the Cal.com webhook signature
 * Note: This implementation may need to be adjusted based on Cal.com's actual signature method
 */
export function verifyWebhookSignature(signature: string, body: string, secret: string): boolean {
  // This is a placeholder for Cal.com's webhook verification
  // The actual implementation depends on Cal.com's signature method
  // Typically involves checking a HMAC signature against the request body
  
  if (!signature || !secret) {
    return false;
  }
  
  // For now, return true to accept all webhooks during testing
  // TODO: Replace with actual verification logic once Cal.com documentation is referenced
  return true;
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

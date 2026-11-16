/**
 * Reference Serverless Background Sync Receiver
 * Compatible with Cloudflare Workers / Vercel Edge / Netlify Functions
 * Note: The PWA runs 100% standalone on GitHub Pages without requiring a backend server.
 */
export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ status: 'ok', service: 'DMS Background Sync Receiver' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const body = await req.json();
  return new Response(
    JSON.stringify({
      synced: true,
      receivedCount: Array.isArray(body.mutations) ? body.mutations.length : 1,
      syncedAt: new Date().toISOString()
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

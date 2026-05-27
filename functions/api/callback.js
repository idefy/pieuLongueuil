/**
 * /api/callback — Handles GitHub OAuth callback
 * Exchanges the authorization code for an access token,
 * then passes it back to Decap CMS via postMessage.
 * Cloudflare Pages Function
 */
export async function onRequest(context) {
  const { request, env } = context;

  const url    = new URL(request.url);
  const code   = url.searchParams.get('code');
  const state  = url.searchParams.get('state');
  const error  = url.searchParams.get('error');

  // Handle errors from GitHub
  if (error) {
    return htmlResponse('error', error, null);
  }

  if (!code) {
    return htmlResponse('error', 'No authorization code received', null);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      },
      body: JSON.stringify({
        client_id:     env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code:          code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return htmlResponse('error', tokenData.error_description || tokenData.error, null);
    }

    const token    = tokenData.access_token;
    const provider = 'github';

    // Return token to Decap CMS via postMessage
    return htmlResponse('success', provider, token);

  } catch (err) {
    return htmlResponse('error', 'Token exchange failed: ' + err.message, null);
  }
}

/**
 * Builds the HTML response that posts the result back to Decap CMS.
 * Decap opens the auth flow in a popup and listens for this postMessage.
 */
function htmlResponse(status, provider, token) {
  const content = status === 'success'
    ? JSON.stringify({ token, provider })
    : JSON.stringify({ error: provider });

  const message = status === 'success'
    ? `authorization:github:success:${content}`
    : `authorization:github:error:${content}`;

  const html = `<!DOCTYPE html>
<html>
<head><title>Authentification</title></head>
<body>
<script>
  (function() {
    function receiveMessage(e) {
      console.log('Received message from:', e.origin);
      window.opener.postMessage(
        '${message}',
        e.origin
      );
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
<p>Authentification en cours… Cette fenêtre va se fermer automatiquement.</p>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}

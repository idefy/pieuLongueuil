/**
 * /api/auth — Redirects the user to GitHub's OAuth login page
 * Cloudflare Pages Function
 */
export async function onRequest(context) {
  const { env } = context;

  const clientId    = env.GITHUB_CLIENT_ID;
  const redirectUri = 'https://pieulongueuil.ca/api/callback';
  const scope       = 'repo,user';
  const state       = crypto.randomUUID();

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${scope}` +
    `&state=${state}`;

  return Response.redirect(githubAuthUrl, 302);
}

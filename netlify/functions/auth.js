exports.handler = async (event, context) => {
  // Variables d'environnement GitHub OAuth
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.URL}/.netlify/functions/auth-callback`;
  
  if (!clientId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GITHUB_CLIENT_ID not configured' })
    };
  }

  // Générer un state aléatoire pour la sécurité
  const state = Math.random().toString(36).substring(2, 15);
  
  // URL d'autorisation GitHub avec les scopes appropriés
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo%20user&state=${state}`;
  
  return {
    statusCode: 302,
    headers: {
      Location: authUrl,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': process.env.URL || '*'
    }
  };
}; 
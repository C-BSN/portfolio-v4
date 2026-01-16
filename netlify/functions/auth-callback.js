exports.handler = async (event, context) => {
  const { code, state } = event.queryStringParameters || {};
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No authorization code provided' })
    };
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GitHub OAuth not configured' })
    };
  }

  try {
    // Échanger le code contre un token d'accès
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: tokenData.error_description || tokenData.error })
      };
    }

    // Script pour envoyer le token au CMS - Version simplifiée qui fonctionne avec Decap CMS
    const script = `
      <script>
        (function() {
          const token = "${tokenData.access_token}";
          const provider = "github";
          
          // Envoyer le message immédiatement au parent
          if (window.opener) {
            // Format attendu par Decap CMS
            const authData = JSON.stringify({
              token: token,
              provider: provider
            });
            
            // Envoyer le message d'authentification réussie
            const message = "authorization:" + provider + ":success:" + authData;
            window.opener.postMessage(message, "*");
            
            // Fermer la fenêtre après un court délai
            setTimeout(() => {
              window.close();
            }, 1000);
          }
        })();
      </script>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentification GitHub - Decap CMS</title>
            <style>
              body { font-family: sans-serif; text-align: center; padding: 50px; }
              .loading { animation: spin 1s linear infinite; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <h1>✅ Authentification réussie !</h1>
            <p>Transmission des informations à Decap CMS...</p>
            <div class="loading">🔄</div>
            <p><small>Cette fenêtre va se fermer automatiquement.</small></p>
            ${script}
          </body>
        </html>
      `
    };

  } catch (error) {
    console.error('OAuth callback error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 
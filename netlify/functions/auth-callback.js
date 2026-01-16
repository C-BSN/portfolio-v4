exports.handler = async (event, context) => {
  const { code } = event.queryStringParameters || {};
  
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

    // Script pour envoyer le token au CMS - Format compatible Decap CMS
    const script = `
      <script>
        (function() {
          function receiveMessage(e) {
            console.log("receiveMessage", e);
            window.opener.postMessage(
              'authorization:github:success:' + JSON.stringify({
                token: "${tokenData.access_token}",
                provider: "github"
              }),
              e.origin
            );
          }
          window.addEventListener("message", receiveMessage, false);
          
          // Envoyer immédiatement aussi
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify({
              token: "${tokenData.access_token}",
              provider: "github"
            }),
            "*"
          );
          
          // Fermer après un délai
          setTimeout(() => {
            window.close();
          }, 1000);
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
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                text-align: center; 
                padding: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
              }
              .container {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
              }
              .spinner {
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 20px auto;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✅ Authentification réussie !</h1>
              <p>Connexion à Decap CMS en cours...</p>
              <div class="spinner"></div>
              <p><small>Cette fenêtre va se fermer automatiquement</small></p>
            </div>
            ${script}
          </body>
        </html>
      `
    };

  } catch (error) {
    console.error('OAuth callback error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
}; 
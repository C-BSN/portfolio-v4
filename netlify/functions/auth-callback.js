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

    // Script pour envoyer le token au CMS - Compatible avec les exemples Decap CMS qui fonctionnent
    const script = `
      <script>
        (function() {
          // Fonction pour recevoir et répondre aux messages du CMS
          function receiveMessage(e) {
            console.log("receiveMessage event:", e);
            
            // Vérifier l'origine pour la sécurité
            if (e.origin !== "${process.env.URL}") {
              console.log("Invalid origin:", e.origin);
              return;
            }
            
            // Préparer les données d'authentification
            const authData = {
              token: "${tokenData.access_token}",
              provider: "github"
            };
            
            // Envoyer le message d'authentification réussie
            const message = "authorization:github:success:" + JSON.stringify(authData);
            console.log("Sending auth success message:", message);
            
            e.source.postMessage(message, e.origin);
          }
          
          // Écouter les messages du parent (Decap CMS)
          window.addEventListener("message", receiveMessage, false);
          
          // Informer le parent que cette fenêtre est prête
          if (window.opener) {
            console.log("Notifying opener that auth window is ready");
            window.opener.postMessage("authorizing:github", "${process.env.URL}");
          }
          
          // Auto-fermeture après 5 secondes si pas de communication
          setTimeout(() => {
            console.log("Auto-closing auth window");
            window.close();
          }, 5000);
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
'use client';

import { useEffect } from 'react';

export default function AdminRedirect() {
  useEffect(() => {
    // Rediriger vers le fichier HTML statique
    window.location.replace('/admin/index.html');
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <p>Redirection vers le CMS Admin...</p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Si vous n'êtes pas redirigé automatiquement,{' '}
          <a href="/admin/index.html" style={{ color: '#0070f3' }}>
            cliquez ici
          </a>
        </p>
      </div>
    </div>
  );
}

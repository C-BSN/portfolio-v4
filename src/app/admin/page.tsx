"use client"

import { useEffect } from 'react'

export default function AdminRedirect() {
  useEffect(() => {
    // Redirection côté client vers /admin/index.html
    window.location.href = '/admin/index.html'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers l'interface d'administration...</p>
        <p className="text-sm text-gray-500 mt-2">
          Si la redirection ne fonctionne pas, <a href="/admin/index.html" className="text-blue-600 hover:underline">cliquez ici</a>
        </p>
      </div>
    </div>
  )
}

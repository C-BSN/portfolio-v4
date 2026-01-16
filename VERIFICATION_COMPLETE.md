# ✅ VÉRIFICATION COMPLÈTE - CMS OAuth Configuration

## 📋 Checklist de Configuration

### 1. ✅ Fichiers Locaux (Déjà corrigés)

- [x] `public/admin/config.yml`
  - repo: `CorentinBasson/portfolio-v4` ✅
  - branch: `main` ✅
  - base_url: `https://portfolio-cbsn.netlify.app` ✅
  - auth_endpoint: `/.netlify/functions/auth` ✅
  - local_backend commenté ✅

- [x] `netlify/functions/auth.js`
  - URL hardcodée: `https://portfolio-cbsn.netlify.app` ✅
  - redirectUri: `/.netlify/functions/auth-callback` ✅

- [x] `netlify/functions/auth-callback.js`
  - Format postMessage compatible avec Decap CMS ✅
  - Gestion des erreurs ✅

- [x] `netlify.toml`
  - functions = "netlify/functions" ✅
  - redirect /admin configuré ✅

---

### 2. ⚠️ À VÉRIFIER SUR GITHUB

**Allez sur** : https://github.com/settings/developers

Vérifiez votre OAuth App et assurez-vous que :

#### Application Settings

| Paramètre | Valeur EXACTE requise |
|-----------|----------------------|
| **Homepage URL** | `https://portfolio-cbsn.netlify.app` |
| **Authorization callback URL** | `https://portfolio-cbsn.netlify.app/.netlify/functions/auth-callback` |

⚠️ **IMPORTANT** : L'URL doit être EXACTEMENT celle-ci, sans slash final, avec `https://`

---

### 3. ⚠️ À VÉRIFIER SUR NETLIFY

**Allez sur** : https://app.netlify.com/sites/portfolio-cbsn/configuration/env

Vérifiez que vous avez ces 2 variables d'environnement :

| Key | Value |
|-----|-------|
| `GITHUB_CLIENT_ID` | Votre Client ID depuis GitHub |
| `GITHUB_CLIENT_SECRET` | Votre Client Secret depuis GitHub |

#### Comment obtenir ces valeurs :

1. Allez sur https://github.com/settings/developers
2. Cliquez sur votre OAuth App
3. Copiez le **Client ID**
4. Cliquez sur "Generate a new client secret" si vous n'en avez pas
5. Copiez le **Client Secret** (vous ne pourrez le voir qu'une seule fois)

---

### 4. 🧪 TEST FINAL

Une fois que tout est vérifié :

1. **Attendez le redéploiement Netlify** (1-2 min)
   - Vérifiez sur : https://app.netlify.com/sites/portfolio-cbsn/deploys
   - Status doit être "Published"

2. **Testez l'authentification**
   - Allez sur : https://portfolio-cbsn.netlify.app/admin
   - Cliquez sur "Login with GitHub"
   - Autorisez l'accès
   - Vous devriez être redirigé vers le CMS

3. **En cas d'échec**
   - Ouvrez la console du navigateur (F12)
   - Copiez tous les messages d'erreur
   - Vérifiez les logs Netlify Functions

---

## 🐛 Debugging

### Vérifier les logs Netlify Functions

1. Allez sur https://app.netlify.com/sites/portfolio-cbsn/functions
2. Cliquez sur `auth` et `auth-callback`
3. Regardez les logs en temps réel pendant le test

### Erreurs courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| "redirect_uri_mismatch" | URL callback GitHub incorrecte | Vérifier point 2 ci-dessus |
| "unauthorized" | Client ID/Secret incorrect | Vérifier point 3 ci-dessus |
| "CORS error" | Problème de domaine | Vérifier que vous testez sur le bon domaine |
| Popup se ferme sans rien | Format postMessage incorrect | Déjà corrigé dans le dernier commit |

---

## 📝 Résumé des Corrections Effectuées

1. ✅ Supprimé dépendance à `process.env.URL` (variable inexistante)
2. ✅ Hardcodé l'URL de base dans `auth.js`
3. ✅ Corrigé format `postMessage` dans `auth-callback.js`
4. ✅ Commenté `local_backend` dans `config.yml`
5. ✅ Ajouté support pour tous les formats de message Decap CMS

---

## 🎯 Actions Requises

**VOUS DEVEZ VÉRIFIER** :
- [ ] Point 2 : Configuration GitHub OAuth App
- [ ] Point 3 : Variables d'environnement Netlify
- [ ] Point 4 : Test final après déploiement

Une fois ces 3 points vérifiés, le CMS devrait fonctionner ! 🚀

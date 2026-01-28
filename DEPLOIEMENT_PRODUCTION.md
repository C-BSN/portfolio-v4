# 🚀 Guide de Déploiement en Production

## 🔧 Correction Appliquée

Le script `start` dans `package.json` a été modifié pour être compatible avec `output: 'export'` :

```json
"start": "npx serve@latest out -l 3000"
```

Maintenant votre application peut être déployée sur **n'importe quelle plateforme** !

---

## 🌐 Déploiement par Plateforme

### 1️⃣ Heroku

#### Avec Dockerfile (Recommandé)
```bash
# 1. Créer l'application
heroku create mon-portfolio

# 2. Définir le stack Docker
heroku stack:set container

# 3. Déployer
git push heroku main
```

Le fichier `heroku.yml` est déjà configuré pour utiliser le Dockerfile.

#### Sans Dockerfile
Heroku détectera automatiquement Node.js et utilisera `npm start`.

---

### 2️⃣ Railway

```bash
# 1. Installer Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialiser le projet
railway init

# 4. Déployer
railway up
```

Le fichier `railway.json` force l'utilisation du Dockerfile.

**Ou via l'interface web** :
1. Connectez votre repo GitHub
2. Railway détectera automatiquement le Dockerfile
3. Deploy !

---

### 3️⃣ Render

```bash
# Via l'interface web
```

1. Créer un nouveau **Web Service**
2. Connecter votre repo GitHub
3. Render détectera le `render.yaml`
4. Click **Deploy** !

**Configuration automatique via `render.yaml`** ✅

---

### 4️⃣ Fly.io

```bash
# 1. Installer Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Déployer
fly launch
```

Le fichier `fly.toml` est déjà configuré.

Pour redéployer :
```bash
fly deploy
```

---

### 5️⃣ Vercel (Sans Docker)

Vercel ne supporte pas Docker mais peut déployer Next.js directement :

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Déployer
vercel --prod
```

**Note** : Avec `output: 'export'`, Vercel servira les fichiers statiques automatiquement.

---

### 6️⃣ Netlify (Sans Docker)

```bash
# 1. Installer Netlify CLI
npm i -g netlify-cli

# 2. Build
npm run build

# 3. Déployer
netlify deploy --prod --dir=out
```

Ou via l'interface web :
1. Connecter le repo
2. Build command : `npm run build`
3. Publish directory : `out`

---

### 7️⃣ DigitalOcean App Platform

1. Créer une nouvelle **App**
2. Connecter votre repo GitHub
3. Choisir **Dockerfile**
4. Deploy !

---

### 8️⃣ Google Cloud Run

```bash
# 1. Build et push l'image
gcloud builds submit --tag gcr.io/PROJECT-ID/portfolio

# 2. Déployer
gcloud run deploy portfolio \
  --image gcr.io/PROJECT-ID/portfolio \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated
```

---

### 9️⃣ AWS (ECS avec Fargate)

```bash
# 1. Push vers ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com

docker build -t portfolio .
docker tag portfolio:latest ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com/portfolio:latest
docker push ACCOUNT.dkr.ecr.eu-west-1.amazonaws.com/portfolio:latest

# 2. Créer un service ECS avec cette image
```

---

### 🔟 VPS (Ubuntu/Debian)

```bash
# Sur le serveur

# 1. Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Cloner le repo
git clone https://github.com/username/portfolio.git
cd portfolio

# 3. Build et run
docker build -t portfolio .
docker run -d -p 80:80 --name portfolio --restart always portfolio

# 4. Setup Nginx reverse proxy (optionnel)
# 5. Setup SSL avec Let's Encrypt
```

---

## 🔍 Dépannage

### Problème : "next start does not work with output: export"

✅ **RÉSOLU** - Le script `start` a été modifié pour utiliser `serve` au lieu de `next start`.

### Problème : La plateforme n'utilise pas le Dockerfile

**Solution** : Forcer l'utilisation de Docker avec les fichiers de config :
- Heroku : `heroku.yml`
- Railway : `railway.json`
- Render : `render.yaml`
- Fly.io : `fly.toml`

### Problème : Port incorrect

Certaines plateformes utilisent la variable `PORT` :

**Modification du Dockerfile si nécessaire** :
```dockerfile
# Ajouter avant EXPOSE
ENV PORT=80
EXPOSE 80
```

Nginx écoute déjà sur le port 80, donc aucun changement nécessaire normalement.

### Problème : Healthcheck échoue

Si votre plateforme a un healthcheck différent, vous pouvez le désactiver dans le Dockerfile en commentant la ligne `HEALTHCHECK`.

---

## 📊 Comparaison des Plateformes

| Plateforme | Docker | Gratuit | SSL | Facilité |
|------------|--------|---------|-----|----------|
| **Vercel** | ❌ | ✅ Oui | ✅ Auto | ⭐⭐⭐⭐⭐ |
| **Netlify** | ❌ | ✅ Oui | ✅ Auto | ⭐⭐⭐⭐⭐ |
| **Railway** | ✅ | ✅ 500h | ✅ Auto | ⭐⭐⭐⭐ |
| **Render** | ✅ | ✅ Limité | ✅ Auto | ⭐⭐⭐⭐ |
| **Fly.io** | ✅ | ✅ Limité | ✅ Auto | ⭐⭐⭐⭐ |
| **Heroku** | ✅ | ❌ Payant | ✅ Auto | ⭐⭐⭐ |
| **DigitalOcean** | ✅ | ❌ 5$/mois | ✅ Auto | ⭐⭐⭐ |
| **GCP/AWS** | ✅ | 💰 Complexe | ⚙️ Manuel | ⭐⭐ |
| **VPS** | ✅ | ❌ ~5$/mois | ⚙️ Manuel | ⭐⭐ |

---

## 🎯 Recommandations

### Pour un site statique (votre cas avec `output: 'export'`)
1. **Vercel** ou **Netlify** - Le plus simple, gratuit, SSL auto
2. **Railway** - Si vous voulez utiliser Docker
3. **Render** - Alternative gratuite avec Docker

### Pour une app complexe avec API
1. **Railway** - Excellent rapport simplicité/puissance
2. **Render** - Bonne alternative
3. **Fly.io** - Si vous voulez du multi-région

---

## 🚀 Étapes Recommandées

### Option A : Sans Docker (Le plus simple pour un site statique)

**Vercel** :
```bash
npm i -g vercel
vercel --prod
```

**Netlify** :
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=out
```

### Option B : Avec Docker (Déjà optimisé)

**Railway** :
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

**Render** :
1. Connecter GitHub sur render.com
2. Le fichier `render.yaml` s'occupera du reste
3. Click Deploy !

---

## 📝 Variables d'Environnement

Si vous avez des variables `NEXT_PUBLIC_*`, définissez-les sur votre plateforme :

**Railway** :
```bash
railway variables set NEXT_PUBLIC_SITE_URL=https://monsite.com
```

**Render** :
Via l'interface web → Environment → Add Variable

**Vercel/Netlify** :
Via l'interface web → Settings → Environment Variables

---

## ✅ Checklist Avant Déploiement

- [x] Script `start` modifié (✅ Fait)
- [ ] Variables d'environnement définies (si nécessaire)
- [ ] Fichiers de config créés (✅ Fait)
  - [x] `heroku.yml`
  - [x] `render.yaml`
  - [x] `railway.json`
  - [x] `fly.toml`
- [ ] Repo Git à jour
- [ ] Test du build local : `npm run build`
- [ ] Test du Dockerfile local : `docker build -t test .`

---

## 🎉 Déploiement Rapide

### Méthode la plus rapide (Vercel)
```bash
npx vercel --prod
```

### Avec Docker (Railway)
```bash
npx @railway/cli up
```

### Avec Render
1. Push vers GitHub
2. render.com → New Web Service → Connect Repo
3. Deploy ! (détecte `render.yaml` automatiquement)

---

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** de votre plateforme
2. **Testez localement** :
   ```bash
   npm run build
   npm start
   # Ou avec Docker
   docker build -t test . && docker run -p 80:80 test
   ```
3. **Vérifiez les ports** : Certaines plateformes utilisent `$PORT`

---

## 🏆 Résultat Attendu

Une fois déployé, vous aurez :
- ✅ Site accessible via HTTPS
- ✅ SSL automatique
- ✅ CDN global (selon plateforme)
- ✅ Déploiement automatique sur push
- ✅ Image Docker optimisée (50-60MB)

**Bonne chance avec votre déploiement !** 🚀

# 🏭 TechHeritage

**Explorez le patrimoine technologique et industriel**

Un portail web qui agrège automatiquement du contenu sur le patrimoine technologique depuis **Wikimedia**, **Wikidata** et des **flux RSS**, démontrant l'utilisation des API ouvertes et des standards du web.

## 📋 Description

Ce projet est une démonstration pédagogique qui montre comment :
- Réutiliser des **données ouvertes** (Wikipedia, Wikidata, Wikimedia Commons)
- Utiliser des **standards du web** (API REST, SPARQL, RSS)
- Créer une interface moderne pour valoriser le patrimoine technologique
- Agréger automatiquement du contenu depuis plusieurs sources

## 🚀 Fonctionnalités

### 1. **Explorer** (`/explorer.html`)
- Recherche dans Wikipedia et Wikidata
- Affichage de résultats avec images, extraits et liens
- Suggestions de recherche prédéfinies

### 2. **Images** (`/images.html`)
- Galerie d'images depuis Wikimedia Commons
- Filtrage par catégories (patrimoine industriel, ponts, observatoires, etc.)
- Affichage en grille responsive

### 3. **Actualités** (`/actualites.html`)
- Agrégation de flux RSS (Europeana, TICCIH, etc.)
- Affichage chronologique des articles
- Liens vers les sources originales

### 4. **Accueil** (`/index.html`)
- Présentation du portail
- Exemples mis en avant
- Navigation vers les différentes sections

## 🛠️ Technologies utilisées

### Backend
- **Node.js** + **Express** - Serveur API
- **Axios** - Requêtes HTTP vers les API externes
- **rss-parser** - Parsing des flux RSS
- **CORS** - Gestion des requêtes cross-origin

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Design moderne et responsive
- **JavaScript (Vanilla)** - Interactions et appels API

### APIs externes
- **Wikimedia API** - Contenu Wikipedia et images
- **Wikidata SPARQL** - Données structurées
- **Wikimedia Commons API** - Images du patrimoine
- **Flux RSS** - Actualités (Europeana, TICCIH)

## 📦 Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm (généralement inclus avec Node.js)
- Connexion Internet (pour accéder aux API externes)

### Étapes

1. **Cloner ou télécharger le projet**

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur**
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

4. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

### ⚠️ Important

- **Le serveur doit être démarré** pour que les pages fonctionnent
- Les pages "Explorer" et "Images" chargent automatiquement du contenu au chargement
- Si rien ne s'affiche, vérifiez que le serveur est bien démarré et que vous êtes connecté à Internet

## 📁 Structure du projet

```
Portail/
├── server.js              # Serveur Express avec endpoints API
├── package.json           # Dépendances Node.js
├── .gitignore            # Fichiers à ignorer par Git
├── README.md             # Ce fichier
└── public/               # Fichiers frontend
    ├── index.html        # Page d'accueil
    ├── explorer.html     # Page de recherche
    ├── images.html       # Galerie d'images
    ├── actualites.html   # Page d'actualités
    ├── styles.css        # Styles CSS
    └── app.js            # JavaScript commun
```

## 🔌 Endpoints API

### 1. Recherche Wikimedia
```
GET /api/wikimedia/search?query=<terme>&lang=fr
```
Recherche dans Wikipedia et retourne des résultats avec extraits et images.

### 2. Détails d'une page
```
GET /api/wikimedia/page/:title?lang=fr
```
Récupère les détails complets d'une page Wikipedia.

### 3. Requête Wikidata SPARQL
```
GET /api/wikidata/query?query=<requête SPARQL>
```
Exécute une requête SPARQL personnalisée sur Wikidata.

### 4. Sites de patrimoine industriel
```
GET /api/wikidata/heritage-sites
```
Retourne une liste de sites de patrimoine industriel avec coordonnées.

### 5. Images Wikimedia Commons
```
GET /api/commons/images?category=<catégorie>&limit=20
```
Récupère des images depuis Wikimedia Commons par catégorie.

### 6. Actualités RSS
```
GET /api/news
```
Agrège et retourne les actualités depuis plusieurs flux RSS.

## 🎨 Personnalisation

### Modifier les catégories d'images
Éditez le fichier `public/images.html` et modifiez les options du `<select>`.

### Ajouter des flux RSS
Modifiez le tableau `feeds` dans `server.js` (section `/api/news`).

### Changer le style
Modifiez les variables CSS dans `public/styles.css` (section `:root`).

## 📚 Documentation des APIs

- **Wikimedia API** : https://www.mediawiki.org/wiki/API:Main_page
- **Wikidata SPARQL** : https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial
- **Wikimedia Commons API** : https://www.mediawiki.org/wiki/API:Main_page
- **RSS Parser** : https://www.npmjs.com/package/rss-parser

## 🎓 Aspect pédagogique

Ce projet démontre :
- **Données ouvertes** : Réutilisation de contenus sous licence libre
- **Interopérabilité** : Utilisation de standards (JSON, SPARQL, RSS)
- **API REST** : Architecture client-serveur avec endpoints
- **Agrégation de contenu** : Combinaison de plusieurs sources
- **Valorisation du patrimoine** : Mise en valeur via le numérique

## ⚠️ Notes importantes

- Certains flux RSS peuvent ne pas être disponibles ou changer d'URL
- Les requêtes Wikidata peuvent être limitées par rate limiting
- Les images Commons nécessitent une connexion internet stable
- Le projet est une démo pédagogique, non optimisé pour la production

## 📝 Licence

Ce projet est fourni à des fins pédagogiques. Les contenus agrégés restent sous leurs licences respectives (CC BY-SA pour Wikipedia, etc.).

## 🤝 Contribution

Ce projet est une démonstration pédagogique. Pour toute amélioration ou suggestion, n'hésitez pas à ouvrir une issue.

---

**Auteur** : Projet pédagogique M2  
**Année** : 2024


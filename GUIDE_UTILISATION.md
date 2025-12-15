# 📖 Guide d'utilisation - Portail du Patrimoine Technologique

## 🚀 Démarrage rapide

### 1. Installer les dépendances
```bash
npm install
```

### 2. Démarrer le serveur
```bash
npm start
```

Le serveur démarre sur **http://localhost:3000**

### 3. Ouvrir dans le navigateur
Ouvrez votre navigateur et allez sur : `http://localhost:3000`

---

## 📄 Utilisation des pages

### Page "Explorer" (`/explorer.html`)

**Comment l'utiliser :**
1. La page charge automatiquement des résultats pour "patrimoine industriel" au chargement
2. Vous pouvez :
   - **Taper une recherche** dans la barre de recherche (ex: "pont", "observatoire", "mine")
   - **Cliquer sur une suggestion** (boutons en dessous de la barre de recherche)
   - **Appuyer sur Entrée** après avoir tapé votre recherche

**Exemples de recherches qui fonctionnent :**
- `pont`
- `observatoire`
- `mine`
- `usine`
- `patrimoine industriel`
- `chemin de fer`
- `phare`

**Si rien ne s'affiche :**
- Vérifiez que le serveur est démarré (vous devriez voir "🚀 Serveur démarré" dans le terminal)
- Vérifiez votre connexion Internet
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Essayez une autre recherche

---

### Page "Images" (`/images.html`)

**Comment l'utiliser :**
1. La page charge automatiquement des images au chargement (catégorie "Industrial heritage")
2. Vous pouvez :
   - **Choisir une catégorie** dans le menu déroulant
   - **Cliquer sur "Charger les images"** pour voir les images de cette catégorie

**Catégories disponibles :**
- Patrimoine industriel
- Ponts
- Observatoires
- Mines
- Usines
- Gares
- Phares
- Moteurs à vapeur
- Moulins à eau
- Moulins à vent
- Architecture industrielle

**Si aucune image ne s'affiche :**
- Certaines catégories peuvent être vides sur Wikimedia Commons
- Essayez une autre catégorie (par exemple "Bridges" ou "Factories")
- Vérifiez que le serveur est démarré
- Vérifiez votre connexion Internet
- Attendez quelques secondes, le chargement peut prendre du temps

**Note :** Les images proviennent de Wikimedia Commons. Si une catégorie n'existe pas ou est vide, vous verrez un message d'erreur.

---

### Page "Actualités" (`/actualites.html`)

**Comment l'utiliser :**
- La page charge automatiquement les actualités au chargement
- Les articles sont triés par date (plus récents en premier)
- Cliquez sur un titre pour lire l'article complet sur le site source

**Sources d'actualités :**
- Europeana
- TICCIH

**Si aucune actualité ne s'affiche :**
- Les flux RSS peuvent être temporairement indisponibles
- Vérifiez que le serveur est démarré
- Vérifiez votre connexion Internet

---

## 🔧 Dépannage

### Le serveur ne démarre pas

**Erreur : "Cannot find module"**
```bash
npm install
```

**Erreur : "Port already in use"**
- Changez le port dans `server.js` : `const PORT = 3001;`
- Ou arrêtez le processus qui utilise le port 3000

### Les pages ne se chargent pas

1. Vérifiez que le serveur est démarré
2. Vérifiez l'URL : `http://localhost:3000`
3. Vérifiez la console du navigateur (F12) pour les erreurs

### Aucun résultat dans "Explorer"

1. Essayez une recherche différente
2. Vérifiez votre connexion Internet
3. Vérifiez la console du navigateur (F12)
4. Vérifiez les logs du serveur dans le terminal

### Aucune image dans "Images"

1. Essayez une autre catégorie
2. Certaines catégories peuvent être vides sur Commons
3. Vérifiez votre connexion Internet
4. Attendez quelques secondes (le chargement peut être lent)

---

## 🧪 Tester les endpoints API

Vous pouvez tester les endpoints directement dans votre navigateur ou avec curl :

### Recherche Wikimedia
```
http://localhost:3000/api/wikimedia/search?query=patrimoine industriel
```

### Images Commons
```
http://localhost:3000/api/commons/images?category=Industrial heritage&limit=10
```

### Actualités
```
http://localhost:3000/api/news
```

### Tester avec le script de test
```bash
node test-server.js
```

---

## 💡 Conseils

1. **Pour Explorer :** Utilisez des mots-clés simples en français (ex: "pont", "usine", "mine")
2. **Pour Images :** Essayez plusieurs catégories, certaines sont plus populaires que d'autres
3. **Pour Actualités :** Les flux RSS peuvent mettre quelques secondes à charger
4. **Performance :** Le premier chargement peut être lent, les suivants seront plus rapides

---

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes :
1. Vérifiez que toutes les dépendances sont installées : `npm install`
2. Vérifiez que le serveur est démarré : `npm start`
3. Vérifiez la console du navigateur (F12) pour les erreurs JavaScript
4. Vérifiez les logs du serveur dans le terminal


const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Parser = require('rss-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const parser = new Parser();

// Configuration axios avec User-Agent pour Wikimedia
const axiosConfig = {
  headers: {
    'User-Agent': 'TechHeritage/1.0 (https://github.com/educational-project; contact@example.com)'
  },
  timeout: 15000
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Middleware de logging pour déboguer
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// ENDPOINT TEST: Vérifier que le serveur fonctionne
// ============================================
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Le serveur fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Fonction de filtrage pour le patrimoine technologique
// ============================================
function isRelatedToTechnicalHeritage(title, snippet, extract) {
  const text = `${title} ${snippet} ${extract}`.toLowerCase();
  
  // Mots-clés positifs (liés au patrimoine technologique - priorité aux termes techniques)
  const positiveKeywords = [
    // Patrimoine technologique (priorité)
    'patrimoine technologique', 'patrimoine technique', 'heritage technique',
    'invention', 'inventeur', 'innovateur', 'innovation', 'innovation technologique',
    'machine', 'mécanique', 'mécanisation', 'mécanisme',
    'instrument scientifique', 'appareil scientifique', 'équipement scientifique',
    'télescope', 'microscope', 'sextant', 'astrolabe', 'chronomètre',
    'observatoire', 'observatoire astronomique', 'laboratoire', 'centre de recherche',
    'ingénieur', 'ingénierie', 'ingénierie mécanique', 'ingénierie électrique',
    'technologie', 'technologique', 'technique', 'technicien',
    'savoir-faire technique', 'connaissance technique', 'compétence technique',
    'brevet', 'découverte scientifique', 'expérimentation',
    'moteur', 'turbine', 'génératrice', 'transformateur',
    'télécommunication', 'télégraphe', 'téléphone', 'radio', 'télévision',
    'électricité', 'électrotechnique', 'électronique',
    'énergie', 'centrale', 'hydroélectrique', 'thermique', 'nucléaire',
    'transport', 'métro', 'tramway', 'chemin de fer', 'railway',
    'aviation', 'aéronautique', 'aérospatial',
    'navigation', 'navigation maritime', 'navigation aérienne',
    // Patrimoine industriel (comme application du technologique)
    'patrimoine industriel', 'industriel', 'industrie', 'usine', 'manufacture', 'manufacturier',
    'site industriel', 'complexe industriel', 'architecture industrielle', 'archéologie industrielle',
    'mine', 'minier', 'carrière', 'extraction',
    'fonderie', 'forge', 'aciérie', 'sidérurgie',
    'textile', 'filature', 'tissage',
    'gare', 'station', 'phare', 'lighthouse',
    'pont', 'viaduc', 'aqueduc', 'tunnel',
    'moulin', 'mill', 'moulin à eau', 'moulin à vent',
    'patrimoine maritime', 'patrimoine ferroviaire',
    'monument historique industriel', 'lieu de mémoire industriel'
  ];
  
  // Mots-clés négatifs (à exclure)
  const negativeKeywords = [
    'patrimoine culturel immatériel', 'patrimoine naturel',
    'patrimoine mondial', 'unesco', 'patrimoine religieux',
    'patrimoine architectural', 'patrimoine artistique',
    'patrimoine littéraire', 'patrimoine musical',
    'patrimoine cinématographique', 'patrimoine gastronomique'
  ];
  
  // Vérifier les mots-clés négatifs
  for (const keyword of negativeKeywords) {
    if (text.includes(keyword.toLowerCase()) && !text.includes('industriel') && !text.includes('technique')) {
      return false;
    }
  }
  
  // Vérifier les mots-clés positifs
  for (const keyword of positiveKeywords) {
    if (text.includes(keyword.toLowerCase())) {
      return true;
    }
  }
  
  // Si la recherche contient des termes techniques (priorité), accepter
  const technicalTerms = [
    'technique', 'technologie', 'technologique', 'ingénierie', 'mécanique',
    'invention', 'innovation', 'inventeur', 'ingénieur',
    'machine', 'instrument', 'appareil', 'équipement',
    'scientifique', 'laboratoire', 'observatoire', 'télescope'
  ];
  for (const term of technicalTerms) {
    if (text.includes(term.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

// ============================================
// ENDPOINT 1: Recherche Wikimedia/Wikipedia
// ============================================
app.get('/api/wikimedia/search', async (req, res) => {
  try {
    const { query, lang = 'fr' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Paramètre "query" requis' });
    }

    console.log(`🔍 Recherche: "${query}" (lang: ${lang})`);

    // Améliorer la requête pour le patrimoine technologique
    // Ajouter des termes liés si la recherche est trop générale
    let enhancedQuery = query;
    const queryLower = query.toLowerCase();
    
    // Si la recherche ne contient pas de termes techniques, les ajouter (priorité au technologique)
    if (!queryLower.includes('patrimoine') && 
        !queryLower.includes('technique') && 
        !queryLower.includes('technologique') &&
        !queryLower.includes('invention') &&
        !queryLower.includes('innovation') &&
        !queryLower.includes('industriel') &&
        !queryLower.includes('usine') &&
        !queryLower.includes('mine') &&
        !queryLower.includes('pont')) {
      enhancedQuery = `${query} patrimoine technologique OR invention OR innovation technologique`;
    }

    // Recherche de pages Wikipedia
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php`;
    
    try {
      const searchResponse = await axios.get(searchUrl, {
        ...axiosConfig,
        params: {
          action: 'query',
          list: 'search',
          srsearch: enhancedQuery,
          srlimit: 20, // Augmenter pour avoir plus de résultats à filtrer
          format: 'json',
          origin: '*'
        }
      });

      // Vérifier si l'API a retourné une erreur
      if (searchResponse.data.error) {
        console.error('Erreur API Wikimedia:', searchResponse.data.error);
        return res.status(500).json({ 
          error: 'Erreur API Wikimedia', 
          details: searchResponse.data.error.info || searchResponse.data.error.code 
        });
      }

      const searchResults = searchResponse.data.query?.search || [];
      console.log(`✅ ${searchResults.length} résultats trouvés`);
      
      // Si aucun résultat, retourner un tableau vide
      if (searchResults.length === 0) {
        return res.json({ results: [] });
      }
      
      // Pour chaque résultat, récupérer les détails (extrait, image)
      const pageIds = searchResults.map(r => r.pageid).join('|');
      
      if (pageIds) {
        try {
          const detailsResponse = await axios.get(searchUrl, {
            ...axiosConfig,
            params: {
              action: 'query',
              pageids: pageIds,
              prop: 'extracts|pageimages|info',
              exintro: true,
              explaintext: true,
              piprop: 'thumbnail',
              pithumbsize: 300,
              format: 'json',
              origin: '*'
            }
          });

          // Vérifier si l'API a retourné une erreur
          if (detailsResponse.data.error) {
            console.error('Erreur API Wikimedia (détails):', detailsResponse.data.error);
            // Retourner quand même les résultats de base sans détails (filtrés)
            const basicResults = searchResults
              .map(result => ({
                id: result.pageid,
                title: result.title,
                snippet: result.snippet,
                extract: '',
                thumbnail: null,
                url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(result.title)}`
              }))
              .filter(result => {
                return isRelatedToTechnicalHeritage(
                  result.title,
                  result.snippet,
                  ''
                );
              })
              .slice(0, 10);
            return res.json({ results: basicResults });
          }

          const pages = detailsResponse.data.query?.pages || {};
          
          // Filtrer les résultats pour ne garder que ceux liés au patrimoine technologique
          const filteredResults = searchResults
            .map(result => {
              const page = pages[result.pageid];
              return {
                id: result.pageid,
                title: result.title,
                snippet: result.snippet,
                extract: page?.extract || result.snippet || '',
                thumbnail: page?.thumbnail?.source || null,
                url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(result.title)}`
              };
            })
            .filter(result => {
              return isRelatedToTechnicalHeritage(
                result.title,
                result.snippet,
                result.extract
              );
            })
            .slice(0, 10); // Limiter à 10 résultats après filtrage

          console.log(`✅ ${filteredResults.length} résultats filtrés (sur ${searchResults.length} initiaux)`);
          res.json({ results: filteredResults });
        } catch (detailsError) {
          console.error('Erreur récupération détails:', detailsError.message);
          // Retourner quand même les résultats de base (filtrés)
          const basicResults = searchResults
            .map(result => ({
              id: result.pageid,
              title: result.title,
              snippet: result.snippet,
              extract: result.snippet || '',
              thumbnail: null,
              url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(result.title)}`
            }))
            .filter(result => {
              return isRelatedToTechnicalHeritage(
                result.title,
                result.snippet,
                result.extract
              );
            })
            .slice(0, 10);
          res.json({ results: basicResults });
        }
      } else {
        res.json({ results: [] });
      }
    } catch (apiError) {
      console.error('Erreur requête API Wikimedia:', apiError.message);
      if (apiError.response) {
        console.error('Status:', apiError.response.status);
        console.error('Data:', apiError.response.data);
      }
      res.status(500).json({ 
        error: 'Erreur lors de la connexion à Wikimedia', 
        details: apiError.message 
      });
    }
  } catch (error) {
    console.error('Erreur générale recherche Wikimedia:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Erreur lors de la recherche Wikimedia', 
      details: error.message 
    });
  }
});

// ============================================
// ENDPOINT 2: Détails d'une page Wikipedia
// ============================================
app.get('/api/wikimedia/page/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const { lang = 'fr' } = req.query;
    
    const url = `https://${lang}.wikipedia.org/w/api.php`;
    const response = await axios.get(url, {
      ...axiosConfig,
      params: {
        action: 'query',
        titles: decodeURIComponent(title),
        prop: 'extracts|pageimages|info',
        exintro: false,
        explaintext: true,
        piprop: 'original',
        format: 'json',
        origin: '*'
      }
    });

    const pages = response.data.query?.pages || {};
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (!page || page.missing) {
      return res.status(404).json({ error: 'Page non trouvée' });
    }

    res.json({
      title: page.title,
      extract: page.extract,
      image: page.original?.source || null,
      url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
    });
  } catch (error) {
    console.error('Erreur récupération page:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération de la page' });
  }
});

// ============================================
// ENDPOINT 3: Requête SPARQL Wikidata
// ============================================
app.get('/api/wikidata/query', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Paramètre "query" (SPARQL) requis' });
    }

    const response = await axios.get('https://query.wikidata.org/sparql', {
      params: { query },
      headers: {
        'Accept': 'application/sparql-results+json',
        'User-Agent': 'TechHeritage/1.0'
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erreur requête Wikidata:', error.message);
    res.status(500).json({ error: 'Erreur lors de la requête Wikidata' });
  }
});

// ============================================
// ENDPOINT 4: Sites de patrimoine industriel (exemple Wikidata)
// ============================================
app.get('/api/wikidata/heritage-sites', async (req, res) => {
  try {
    // Requête SPARQL pour récupérer des sites de patrimoine industriel
    const sparqlQuery = `
      SELECT ?item ?itemLabel ?description ?coords ?country ?countryLabel ?image WHERE {
        ?item wdt:P31/wdt:P279* wd:Q15079522 .
        ?item wdt:P625 ?coords .
        OPTIONAL { ?item wdt:P17 ?country . }
        OPTIONAL { ?item wdt:P18 ?image . }
        OPTIONAL { ?item schema:description ?description . FILTER(LANG(?description) = "fr") }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" . }
      }
      LIMIT 50
    `;

    const response = await axios.get('https://query.wikidata.org/sparql', {
      params: { query: sparqlQuery },
      headers: {
        'Accept': 'application/sparql-results+json',
        'User-Agent': 'TechHeritage/1.0'
      }
    });

    const results = response.data.results.bindings.map(binding => ({
      id: binding.item.value.split('/').pop(),
      label: binding.itemLabel?.value || 'Sans titre',
      description: binding.description?.value || '',
      coordinates: binding.coords?.value || null,
      country: binding.countryLabel?.value || '',
      image: binding.image?.value || null,
      url: binding.item.value
    }));

    res.json({ results });
  } catch (error) {
    console.error('Erreur récupération sites patrimoine:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des sites' });
  }
});

// ============================================
// ENDPOINT 5: Images Wikimedia Commons par catégorie
// ============================================
app.get('/api/commons/images', async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    
    if (!category) {
      return res.status(400).json({ error: 'Paramètre "category" requis' });
    }

    const url = 'https://commons.wikimedia.org/w/api.php';
    
    // Essayer d'abord avec la catégorie telle quelle
    let response = await axios.get(url, {
      ...axiosConfig,
      params: {
        action: 'query',
        list: 'categorymembers',
        cmtitle: `Category:${category}`,
        cmtype: 'file',
        cmnamespace: 6,
        cmlimit: parseInt(limit),
        format: 'json',
        origin: '*'
      }
    });

    let members = response.data.query?.categorymembers || [];
    
    // Si pas de résultats, essayer avec une recherche d'images par mot-clé
    if (members.length === 0) {
      // Recherche d'images par mot-clé dans Commons
      const searchResponse = await axios.get(url, {
        ...axiosConfig,
        params: {
          action: 'query',
          list: 'search',
          srsearch: `filetype:bitmap ${category}`,
          srnamespace: 6,
          srlimit: parseInt(limit),
          format: 'json',
          origin: '*'
        }
      });
      
      const searchResults = searchResponse.data.query?.search || [];
      members = searchResults.map(r => ({ title: r.title }));
    }
    
    // Récupérer les URLs des images
    const titles = members.map(m => m.title).join('|');
    if (titles) {
      const imageResponse = await axios.get(url, {
        ...axiosConfig,
        params: {
          action: 'query',
          titles: titles,
          prop: 'imageinfo',
          iiprop: 'url|thumbmime|extmetadata',
          iiurlwidth: 400,
          format: 'json',
          origin: '*'
        }
      });

      const pages = imageResponse.data.query?.pages || {};
      const images = Object.values(pages)
        .filter(page => page.imageinfo && page.imageinfo[0] && page.imageinfo[0].thumbmime?.startsWith('image/'))
        .map(page => ({
          title: page.title,
          url: page.imageinfo[0].thumburl || page.imageinfo[0].url,
          fullUrl: page.imageinfo[0].url,
          description: page.imageinfo[0].extmetadata?.ImageDescription?.value || page.title.replace('File:', '').replace(/\.[^.]+$/, '')
        }));

      res.json({ images });
    } else {
      res.json({ images: [] });
    }
  } catch (error) {
    console.error('Erreur récupération images Commons:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des images', details: error.message });
  }
});

// ============================================
// ENDPOINT 6: Flux RSS - Actualités
// ============================================
app.get('/api/news', async (req, res) => {
  try {
    const feeds = [
      {
        name: 'Europeana',
        url: 'https://pro.europeana.eu/feed'
      },
      {
        name: 'TICCIH',
        url: 'https://ticcih.org/feed/'
      }
    ];

    const allNews = [];

    for (const feed of feeds) {
      try {
        const feedData = await parser.parseURL(feed.url);
        const items = feedData.items.slice(0, 5).map(item => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          content: item.contentSnippet || item.content || '',
          source: feed.name
        }));
        allNews.push(...items);
      } catch (err) {
        console.error(`Erreur parsing RSS ${feed.name}:`, err.message);
      }
    }

    // Trier par date (plus récent en premier)
    allNews.sort((a, b) => {
      const dateA = new Date(a.pubDate || 0);
      const dateB = new Date(b.pubDate || 0);
      return dateB - dateA;
    });

    res.json({ news: allNews });
  } catch (error) {
    console.error('Erreur récupération actualités:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des actualités' });
  }
});

// Route par défaut - servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📚 Portail de patrimoine technologique`);
});


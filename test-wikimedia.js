// Script de test pour vérifier la connexion à l'API Wikimedia
const axios = require('axios');

async function testWikimediaAPI() {
  console.log('🧪 Test de connexion à l\'API Wikimedia...\n');

  const searchUrl = 'https://fr.wikipedia.org/w/api.php';
  const query = 'patrimoine industriel';

  try {
    console.log(`1. Test de recherche: "${query}"`);
    console.log(`   URL: ${searchUrl}\n`);

    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'TechHeritage/1.0 (https://github.com/educational-project; contact@example.com)'
      },
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: 5,
        format: 'json',
        origin: '*'
      },
      timeout: 10000
    });

    console.log('✅ Connexion réussie!');
    console.log(`   Status: ${response.status}`);
    console.log(`   Résultats: ${response.data.query?.search?.length || 0}`);
    
    if (response.data.query?.search) {
      console.log('\n   Premiers résultats:');
      response.data.query.search.slice(0, 3).forEach((result, i) => {
        console.log(`   ${i + 1}. ${result.title}`);
      });
    }

    if (response.data.error) {
      console.log('\n⚠️  L\'API a retourné une erreur:');
      console.log(`   Code: ${response.data.error.code}`);
      console.log(`   Info: ${response.data.error.info}`);
    }

  } catch (error) {
    console.log('❌ Erreur de connexion:');
    console.log(`   Message: ${error.message}`);
    
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data:`, error.response.data);
    } else if (error.request) {
      console.log('   Pas de réponse du serveur');
      console.log('   Vérifiez votre connexion Internet');
    } else {
      console.log(`   Erreur: ${error.message}`);
    }
  }
}

testWikimediaAPI();


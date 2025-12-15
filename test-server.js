// Script de test pour vérifier que les endpoints fonctionnent
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
  console.log('🧪 Test des endpoints API...\n');

  // Test 1: Recherche Wikimedia
  console.log('1. Test recherche Wikimedia...');
  try {
    const response = await axios.get(`${BASE_URL}/api/wikimedia/search?query=patrimoine industriel`);
    console.log(`✅ Recherche OK - ${response.data.results?.length || 0} résultats`);
  } catch (error) {
    console.log(`❌ Erreur recherche: ${error.message}`);
  }

  // Test 2: Images Commons
  console.log('\n2. Test images Commons...');
  try {
    const response = await axios.get(`${BASE_URL}/api/commons/images?category=Industrial heritage&limit=5`);
    console.log(`✅ Images OK - ${response.data.images?.length || 0} images`);
  } catch (error) {
    console.log(`❌ Erreur images: ${error.message}`);
  }

  // Test 3: Actualités
  console.log('\n3. Test actualités RSS...');
  try {
    const response = await axios.get(`${BASE_URL}/api/news`);
    console.log(`✅ Actualités OK - ${response.data.news?.length || 0} articles`);
  } catch (error) {
    console.log(`❌ Erreur actualités: ${error.message}`);
  }

  console.log('\n✅ Tests terminés');
}

// Vérifier si le serveur est démarré
axios.get(`${BASE_URL}/`)
  .then(() => {
    testEndpoints();
  })
  .catch(() => {
    console.log('❌ Le serveur n\'est pas démarré sur http://localhost:3000');
    console.log('   Démarrez le serveur avec: npm start');
  });


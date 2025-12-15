// ============================================
// Fichier JavaScript commun
// ============================================

// Fonction utilitaire pour formater les dates
function formatDate(dateString) {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Fonction utilitaire pour tronquer le texte
function truncateText(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Gestion des erreurs API
function handleApiError(error, container) {
    console.error('Erreur API:', error);
    if (container) {
        container.innerHTML = `
            <div class="empty-state">
                <p>❌ Erreur lors du chargement des données</p>
                <p>Veuillez réessayer plus tard</p>
            </div>
        `;
    }
}

// Animation au scroll (optionnel)
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.result-card, .feature-card, .news-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Initialiser les animations au chargement
document.addEventListener('DOMContentLoaded', () => {
    // initScrollAnimations(); // Décommenter si vous voulez les animations
});


window.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const resultsDiv = document.getElementById('results');
    const offlineMessage = document.getElementById('offlineMessage');

    // Fonction pour afficher les résultats de recherche depuis le cache
    async function displayCachedSearchResults() {
        try {
            // Ouvrir le cache contenant les résultats de recherche
            const cache = await caches.open('search-results-cache');
            // Récupérer la réponse en cache pour la requête de recherche
            const cachedResponse = await cache.match(`https://api.tvmaze.com/search/shows?q=${searchInput.value.trim()}`);
            // Extraire les données JSON de la réponse en cache
            const data = await cachedResponse.json();
            // Afficher les résultats de recherche depuis le cache
            displaySearchResults(data);
        } catch (error) {
            console.error("Erreur lors de l'affichage des résultats de recherche depuis le cache :", error);
        }
    }

    // Vérifier si l'utilisateur est en ligne
    function isOnline() {
        return navigator.onLine;
    }

    // Gérer la soumission du formulaire de recherche
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const searchQuery = searchInput.value.trim();

        if (isOnline()) {
            try {
                const response = await fetch(`https://api.tvmaze.com/search/shows?q=${searchQuery}`);
                const data = await response.json();
                displaySearchResults(data);
            } catch (error) {
                console.error("Erreur lors de la recherche en ligne :", error);
                resultsDiv.innerHTML = "<p>Une erreur s'est produite lors de la recherche. Veuillez réessayer.</p>";
            }
        } else {
            // Si l'utilisateur est hors ligne, afficher les résultats de recherche depuis le cache
            offlineMessage.style.display = 'block';
            await displayCachedSearchResults();
        }
    });

    // Fonction pour afficher les résultats de recherche
    function displaySearchResults(data) {
        resultsDiv.innerHTML = "";

        data.forEach(item => {
            const show = item.show;
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("col-md-4");
            cardDiv.innerHTML = `
                <div class="card">
                    <img src="${show.image?.medium}" class="card-img-top" alt="${show.name}">
                    <div class="card-body">
                        <h5 class="card-title">${show.name}</h5>
                        <p class="card-text">${show.summary || "Aucun résumé disponible."}</p>
                        <a href="details.html?id=${show.id}" class="btn btn-primary">Voir les détails</a>
                    </div>
                </div>
            `;
            resultsDiv.appendChild(cardDiv);
        });
    }
});

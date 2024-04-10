window.addEventListener('DOMContentLoaded', async () => {
    // Récupérer l'ID de la série TV à partir de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const showId = urlParams.get('id');

    if (!showId) {
        console.error('ID de la série TV non trouvé dans l\'URL.');
        return;
    }

    try {
        const response = await fetch(`https://api.tvmaze.com/shows/${showId}`);
        const show = await response.json();

        const detailsDiv = document.getElementById('details');
        detailsDiv.innerHTML = `
            <h2>${show.name}</h2>
            <img src="${show.image?.medium}" alt="${show.name}">
            <p>${show.summary || "Aucun résumé disponible."}</p>
        `;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la série TV :', error);
        detailsDiv.innerHTML = '<p>Une erreur s\'est produite lors de la récupération des détails de la série TV.</p>';
    }
});

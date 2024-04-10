
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const showId = params.get("id");

    if (showId) {
        fetch(`https://api.tvmaze.com/shows/${showId}`)
          .then((response) => response.json())
          .then((show) => {
            const showDetails = document.getElementById("showDetails");
            showDetails.innerHTML = `
              <div class="row">
                <div class="col-md-6">
                  <h1 class="text-3xl font-bold">${show.name}</h1>
                  <img src="${show.image?.original || "https://placehold.it/210x295"}" alt="${show.name}" class="img-fluid rounded-lg shadow-lg mb-4">
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-body">
                      <p class="card-text text-gray-300">${show.summary}</p>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item text-gray-300">Genres: ${show.genres.join(", ")}</li>
                        <li class="list-group-item text-gray-300">Langue: ${show.language}</li>
                        <li class="list-group-item text-gray-300">Première: ${show.premiered}</li>
                        <li class="list-group-item text-gray-300">Note: ${show.rating.average ? show.rating.average : "N/A"}</li>
                      </ul>
                      <a href="${show.officialSite ? show.officialSite : "#"}" target="_blank" class="btn btn-primary">Site officiel</a>
                    </div>
                  </div>
                </div>
              </div>
            `;
          })
          .catch((error) => {
            console.error("Error fetching show details: ", error);
            document.getElementById("showDetails").innerHTML = `
              <p class="text-danger">Erreur lors du chargement des détails de la série.</p>
            `;
          });
      } else {
        document.getElementById("showDetails").innerHTML = `
          <p class="text-warning">Aucune série sélectionnée.</p>
        `;
      }
      
});

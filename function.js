function enregistrerRecherche(term) {
    let recherches = JSON.parse(localStorage.getItem('recherches')) || [];
    recherches.push(term);
    localStorage.setItem('recherches', JSON.stringify(recherches));
}

function recupererRecherches() {
    return JSON.parse(localStorage.getItem('recherches')) || [];
}

function afficherRecherchesHorsLigne() {
    const recherches = recupererRecherches();
    const listeRecherches = document.getElementById('listeRecherches');
    listeRecherches.innerHTML = '';
    recherches.forEach(recherche => {
        const item = document.createElement('li');
        item.textContent = recherche;
        listeRecherches.appendChild(item);
    });
}

//Récupérer projets et afficher dans la modale 

function afficherProjets() {
    const modalGallery = document.getElementById("modal-gallery");
    fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(projects => {
        projects.forEach(project => {
            const projectElement = createProjectElement(project);
            console.log(project);
            modalGallery.appendChild(projectElement);
        });
    })
    .catch(error => {
        console.log("Erreur", error);
    });
}


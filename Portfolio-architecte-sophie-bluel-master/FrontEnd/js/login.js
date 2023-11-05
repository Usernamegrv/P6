//Affichage projets et filtrage selon category name

document.addEventListener("DOMContentLoaded", () => {
    const filtersContainer = document.querySelector(".filters");
    const gallery = document.querySelector(".gallery");
    const filterButtons = document.querySelectorAll(".filter-button");

    // Ajoute un gestionnaire d'événements à chaque bouton de filtrage.
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category");
            filterProjectsByCategory(category);
        });
    });

    // Fonction pour afficher tous les projets ou filtrer par catégorie.
    function filterProjectsByCategory(categoryName) {
        fetch("http://localhost:5678/api/works")
            .then(response => response.json())
            .then(projects => {
                gallery.innerHTML = ""; 

                projects.forEach(project => {
                    if (categoryName === "Tous" || project.category.name === categoryName) {
                        const projectElement = createProjectElement(project);
                        gallery.appendChild(projectElement);
                    }
                });
            });
    }

    // Crée un élément HTML pour un projet.
    function createProjectElement(project) {
        const projectElement = document.createElement("figure");
        projectElement.innerHTML = ` <img src="${project.imageUrl}" alt="${project.title}">
                                     <figcaption>${project.title}</figcaption>`;
        return projectElement;
    }

    // Au chargement de la page, affiche tous les projets.
    filterProjectsByCategory("Tous");
});



//Récupération du token pour mode édition

const authToken = sessionStorage.getItem("authToken");
const editionBanner = document.getElementById("mode_edition");
const loginLink = document.getElementById("login-link");
const iconeModifier = document.getElementById("icone-modifer");


if (authToken) {
    // L'utilisateur est connecté
    const filterButtons = document.querySelectorAll(".filter-button");
    filterButtons.forEach(button => {
        button.style.display = "none"; 
    });
    editionBanner.style.display = "flex";

    loginLink.innerHTML='<a href="#">Logout</a>';

    loginLink.addEventListener("click", function (event) {
        event.preventDefault();
        sessionStorage.removeItem("authToken");
        
        window.location.href = "../FrontEnd/index.html"
    });

    iconeModifier.style.dsplay = "block";

} else {
    // L'utilisateur n'est pas connecté
    const filterButtons = document.querySelectorAll(".filter-button");
    filterButtons.forEach(button => {
        button.style.display = "block"; 
    });
    editionBanner.style.display = "none";

    loginLink.innerHTML = '<a href="../FrontEnd/login.html">Login</a>';

    iconeModifier.style.display = "none";
    
}
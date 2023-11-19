//-------------------------------------------------
// Affichage projets et filtrage selon category name
//-------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");
  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      filterProjectsByCategory(category);
    });
  });

  // Fonction Fetch pour afficher projets selon catégorie
  //-----------------------------------------------------
  function filterProjectsByCategory(categoryName) {
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((projects) => {
        gallery.innerHTML = "";

        projects.forEach((project) => {
          if (
            categoryName === "Tous" ||
            project.category.name === categoryName
          ) {
            const projectElement = createProjectElement(project);
            gallery.appendChild(projectElement);
          }
        });
      });
  }

  // Fonction pour déterminer le modele d'un projet pour page d'accueil
  //-------------------------------------------------------------------
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
//---------------------------------------

const authToken = sessionStorage.getItem("authToken");
const editionBanner = document.getElementById("mode_edition");
const loginLink = document.getElementById("login-link");
const iconeModifier = document.getElementById("icone-modifer");
const modifierMesProjets = document.getElementById("modifier_mesProjets");

if (authToken) {
  // L'utilisateur est connecté
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.style.display = "none";
  });
  editionBanner.style.display = "flex";

  loginLink.innerHTML = '<a href="#">logout</a>';

  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    sessionStorage.removeItem("authToken");

    window.location.href = "./index.html";
  });

  iconeModifier.style.dsplay = "block";
  modifierMesProjets.style.display = "block";
} else {
  // L'utilisateur n'est pas connecté
  const filterButtons = document.querySelectorAll(".filter-button");
  filterButtons.forEach((button) => {
    button.style.display = "block";
  });
  editionBanner.style.display = "none";

  loginLink.innerHTML = '<a href="./login.html">login</a>';

  iconeModifier.style.display = "none";
  modifierMesProjets.style.display = "none";
}

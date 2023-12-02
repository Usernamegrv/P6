let workList = [];
const gallery = document.querySelector(".gallery");

const getListProjects = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((projects) => {
      workList = projects;
      console.log(workList);
      afficherProjets(workList);
      afficherProjetsHome(workList);

      const categories = [
        ...new Set(projects.map((project) => project.category.name)),
      ];
      addFilterButtons(categories);
    })
    .catch((error) => {
      console.error("une erreur s'est produite", error);
    });
};
getListProjects();

// Filtrer projets selon catégorie
//-----------------------------------------------------
function filterProjectsByCategory(categoryName) {
  gallery.innerHTML = "";

  workList.forEach((project) => {
    if (categoryName === "Tous" || project.category.name === categoryName) {
      const projectElement = createProjectElement(project);
      gallery.appendChild(projectElement);
    }
  });
}

// Création d'un bouton
//---------------------
function createFilterButton(categoryName) {
  const button = document.createElement("button");
  button.classList.add("filter-button");
  button.setAttribute("data-category", categoryName);
  const span = document.createElement("span");
  span.textContent = categoryName;

  button.appendChild(span);
  button.addEventListener("click", () => {
    filterProjectsByCategory(categoryName);
  });
  return button;
}

//Ajouter boutons au DOM
//----------------------
function addFilterButtons(categories) {
  const filterContainer = document.querySelector(".filters");
  const allButton = createFilterButton("Tous");
  filterContainer.appendChild(allButton);

  categories.forEach((category) => {
    const button = createFilterButton(category);
    filterContainer.appendChild(button);
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
// filterProjectsByCategory("Tous");

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

let workList = [];
const gallery = document.querySelector(".gallery");

// Fetch projets
//--------------

const getListProjects = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((projects) => {
      workList = projects;

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
  filterContainer.innerHTML = "";
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

//Récupération du token pour mode édition
//---------------------------------------

const authToken = sessionStorage.getItem("authToken");
const editionBanner = document.getElementById("mode_edition");
const loginLink = document.getElementById("login-link");
const iconeModifier = document.getElementById("icone-modifer");
const modifierMesProjets = document.getElementById("modifier_mesProjets");
const filterButtons = document.querySelector(".filters");
const containerGallery = document.querySelector(".container-gallery");

if (authToken) {
  // L'utilisateur est connecté
  filterButtons.style.display = "none";
  editionBanner.style.display = "flex";
  loginLink.innerHTML = '<a href="#">logout</a>';
  containerGallery.style.marginTop = "30px";
  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    sessionStorage.removeItem("authToken");
    window.location.href = "./index.html";
  });

  iconeModifier.style.display = "block";
  modifierMesProjets.style.display = "block";
} else {
  // L'utilisateur n'est pas connecté

  filterButtons.style.display = "flex";
  editionBanner.style.display = "none";
  loginLink.innerHTML = '<a href="./login.html">login</a>';
  containerGallery.style.marginTop = "0";

  iconeModifier.style.display = "none";
  modifierMesProjets.style.display = "none";
}

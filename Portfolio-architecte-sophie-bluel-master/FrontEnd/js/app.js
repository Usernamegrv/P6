let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

// Ouvrir fermer modale
//---------------------

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = modal.querySelectorAll(focusableSelector);
  focusables[0].focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-close-modal")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const focusInModal = function (e) {
  e.preventDefault();
  console.log(focusables);
};

document.querySelectorAll(".js-modal").forEach((element) => {
  element.addEventListener("click", (e) => {
    openModal(e);
    e.preventDefault();
    getProjects();
  });
});

// Close modale avec le clavier /
//se diriger dans la modale avec clavier
//---------------------------------------

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

//--------------------------------------------
//Récupérer projets et afficher dans la modale
//--------------------------------------------

// Fonction pour ajouter projets dans la modale mode-suppression
//--------------------------------------------------------------
const afficherProjets = (projects) => {
  const modalGallery = document.getElementById("modal-gallery");

  modalGallery.innerHTML = "";

  modeAjout.style.display = "none";
  modeSuppression.style.display = "flex";

  projects.forEach((project) => {
    const projectElement = createProjectElement(project);
    modalGallery.appendChild(projectElement);
    console.log(projectElement);
  });
};

// Fonction pour déterminer le modèle d'un projet pour la modale
//--------------------------------------------------------------
function createProjectElement(project) {
  const projectElement = document.createElement("figure");

  projectElement.innerHTML = ` <img class="trash-icon" src="./assets/icons/trash-can-solid.svg" alt="icone supprimer image" id="${project.id}"> <img class="img-projects" src="${project.imageUrl}" alt="${project.title}" id="${project.id}"> `;

  const trashIcon = projectElement.querySelector(".trash-icon");
  trashIcon.addEventListener("click", () => {
    if (confirm("Etes-vous sûr de vouloir supprimer?"))
      deleteProject(project.id);
  });

  return projectElement;
}

// Fonction pour Fetch projets
//----------------------------
const getProjects = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const projects = await response.json();
      console.log("Projets récupérés:", projects);

      afficherProjets(projects);
    } else {
      console.error("Impossible de charger les projets.");
    }
  } catch (error) {
    console.error("Erreur dans le chargement des projets", error);
  }
};

// Fonction pour supprimer un projet
//----------------------------------
function deleteProject(id) {
  const apiUrl = `http://localhost:5678/api/works/${id}`;
  fetch(apiUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("La suppression a échouée.");
      }

      getProjects();
      location.reload();
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression du projet:", error);
    });
}

//-------------------
// Modale ajout photo
//-------------------

// Affiche la modale mode-ajout
//-----------------------------
const ajoutPhoto = document.getElementById("ajout-photo");
const modeAjout = document.querySelector(".mode-ajout");
const modeSuppression = document.querySelector(".mode-suppression");

ajoutPhoto.addEventListener("click", () => {
  modeSuppression.style.display = "none";
  modeAjout.style.display = "flex";
});

// Fonction pour prévisualiser l'image sélectionnée
//-------------------------------------------------
function previewImage(event) {
  const input = event.target;
  const preview = document.getElementById("preview-image");

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    console.log(reader);

    reader.onload = function (e) {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

//--------------------------
// Envoi du formulaire ajout
//--------------------------

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const imageSrcElement = form.querySelector('[name="file"]');
  const imageSrc = imageSrcElement ? imageSrcElement.value : null;

  const formData = new FormData(form);

  // Récuperer le contenu du fichier et convertir en objet Blob
  if (imageSrc) {
    await fetch(imageSrc)
      .then((response) => response.blob())
      .then((blob) => formData.append("image", blob, "image.jpg"));
  }

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }
    const data = await response.json();
    console.log("Requête réussie", data);
    getProjects();

    form.reset();
    {
      const previewImage = document.getElementById("preview-image");
      previewImage.src = "./assets/icons/picture-svgrepo-com 1.svg";
    }
  } catch (error) {
    console.error("Erreur lors de la requête:", error.message);
  }
});

// Icone arrow-left / retour sur modale précedente
//------------------------------------------------

const backModale = document.getElementById("back-modale");
backModale.addEventListener("click", () => {
  modeAjout.style.display = "none";
  modeSuppression.style.display = "flex";
});

// Activer le btn valider seulement si tous les champs sont remplis
//-----------------------------------------------------------------

const addProject = document.getElementById("addProject");
const btnValider = document.getElementById("btn-valider");

addProject.addEventListener("input", () => {
  const imageSrc = document.getElementById("file").value;
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;

  btnValider.disabled = !(imageSrc && title && category);

  btnValider.classList.toggle("active", !btnValider.disabled);
});

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

// Fonction pour affichage projets dans la modale mode-suppression
//--------------------------------------------------------------
const afficherProjets = (projects) => {
  const modalGallery = document.getElementById("modal-gallery");

  modalGallery.innerHTML = "";

  modeAjout.style.display = "none";
  modeSuppression.style.display = "flex";

  projects.forEach((project) => {
    const projectElement = createProjectElementModale(project);
    modalGallery.appendChild(projectElement);
  });
};
// Fonctions pour affichage projets après suppression ou ajout
//-------------------------------------------------------------
const afficherProjetsHome = (projects) => {
  const newGallery = document.getElementById("gallery");
  newGallery.innerHTML = "";

  projects.forEach((project) => {
    const newProjectElement = createProjectElementHome(project);
    newGallery.appendChild(newProjectElement);
  });
};

function createProjectElementHome(project) {
  const newProjectElement = document.createElement("figure");
  newProjectElement.innerHTML = ` <img src="${project.imageUrl}" alt="${project.title}" id="${project.id}">
  <figcaption>${project.title}</figcaption> `;
  return newProjectElement;
}
// Fonction pour déterminer le modèle d'un projet pour la modale
//--------------------------------------------------------------
function createProjectElementModale(project) {
  const projectElement = document.createElement("figure");

  projectElement.innerHTML = ` <img class="trash-icon" src="./assets/icons/trash-can-solid.svg" alt="icone supprimer image" id="${project.id}"> <img class="img-projects" src="${project.imageUrl}" alt="${project.title}" id="${project.id}"> `;

  const trashIcon = projectElement.querySelector(".trash-icon");
  trashIcon.addEventListener("click", () => {
    if (confirm("Etes-vous sûr de vouloir supprimer?"))
      deleteProject(project.id);
  });

  return projectElement;
}

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

      getListProjects();
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

    form.reset();
    {
      const previewImage = document.getElementById("preview-image");
      previewImage.src = "./assets/icons/picture-svgrepo-com 1.svg";
      inputMessage.textContent = "Veuillez renseigner le titre";
      selectMessage.textContent = "Veuillez faire une sélection";
    }
    getListProjects();
  } catch (error) {
    console.error("Erreur lors de la requête:", error.message);
  }
});

// Messages utilisateur formulaire envoie
//---------------------------------------
const inputMessage = document.getElementById("input-message");
const selectMessage = document.getElementById("select-message");
const categorySelect = document.getElementById("category");
const inputSelect = document.getElementById("title");

inputSelect.addEventListener("input", (e) => {
  const inputData = e.target.value;

  if (inputData.trim() === "") {
    console.log("Le titre n'est pas renseigné");
    inputMessage.textContent = "Veuillez renseigner le titre";
  } else {
    inputMessage.textContent = "";
  }
});

categorySelect.addEventListener("change", (e) => {
  const selectData = e.target.value;
  if (selectData.trim() === "") {
    console.log("la selection n'est pas faite");
    selectMessage.textContent = "Veuillez faire une selection";
  } else {
    selectMessage.textContent = "";
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

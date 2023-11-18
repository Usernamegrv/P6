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

function submitForm() {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const fileInput = document.getElementById("file");
  const imageFile = fileInput.files[0];
  const userId = sessionStorage.getItem("userId");
  const authToken = sessionStorage.getItem("authToken");
  console.log(category);
  console.log(authToken);
  console.log(imageFile);

  const reader = new FileReader();

  reader.onload = function () {
    const imageString = reader.result;

    const apiData = {
      title: title,
      categoryId: category,
      imageUrl: imageString,
      userId: userId,
    };

    console.log(apiData);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Requête réussie !!", data);
      })
      .catch((error) => {
        console.error("Erreur lors de la requête :", error.message);
      });
  };
  reader.readAsDataURL(imageFile);
}

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

//ouvrir fermer modale
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

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// close modale avec le clavier / se diriger dans la modale avec clavier
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

//Récupérer projets et afficher dans la modale

const afficherProjets = (projects) => {
  const modalGallery = document.getElementById("modal-gallery");

  modalGallery.innerHTML = "";

  projects.forEach((project) => {
    const projectElement = createProjectElement(project);
    modalGallery.appendChild(projectElement);
  });
};

function createProjectElement(project) {
  const projectElement = document.createElement("figure");

  projectElement.innerHTML = ` <img class="trash-icon" src="../FrontEnd/assets/icons/trash-can-solid.svg" alt="icone supprimer image" id="${project.id}" onclick="return confirm('Etes-vous sûr de vouloir supprimer?');"/> <img class="img-projects" src="${project.imageUrl}" alt="${project.title}" id="${project.id}"> `;

  const trashIcon = projectElement.querySelector(".trash-icon");
  trashIcon.addEventListener("click", () => {
    deleteProject(project.id);
  });

  return projectElement;
}

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

function deleteProject(projectId) {
  const apiUrl = `http://localhost:5678/api/works/{id}`;
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

      projectId.preventDefault();
      afficherProjets();
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression du projet:", error);
    });
}

document.querySelectorAll(".js-modal").forEach((element) => {
  element.addEventListener("click", (e) => {
    openModal(e);
    e.preventDefault();
    getProjects();
  });
});

// Ajout photo

const ajoutPhoto = document.getElementById("ajout-photo");
ajoutPhoto.addEventListener("click", () => {
  const modalGallery = document.getElementById("modal-gallery");
  const titleModal = document.getElementById("titleModal");
  const btnAjout = document.getElementById("ajout-photo");

  titleModal.style.display = "none";
  modalGallery.classList.remove("modal-gallery");
  modalGallery.innerHTML = ` <div class="formulaire-ajoutPhoto">
                             <h3>Ajout Photo</h3>
                             <label for="file"></label>
                             <input type="file" id="file" name="file" accept=".jpg, .png" multiple>
                             </div>
                             `;

  btnAjout.innerHTML = "Valider";
});

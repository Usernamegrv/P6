let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []

//ouvrir fermer modale
const openModal = function (e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute("href"))
    focusables = modal.querySelectorAll(focusableSelector)
    focusables[0].focus()
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)

}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function (e) {
    e.preventDefault()
    console.log(focusables)
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

// close modale avec le clavier / se diriger dans la modale avec clavier
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})


//Récupérer projets et afficher dans la modale

const afficherProjets = (projects) => {

    const modalGallery = document.getElementById("modal-gallery");

    modalGallery.innerHTML = "";

    projects.forEach(project => {
        const projectElement = createProjectElement(project);
        modalGallery.appendChild(projectElement);
    });
}

function createProjectElement(project) {
    const projectElement = document.createElement("figure");
    projectElement.innerHTML = ` <img class="img-projects" src="${project.imageUrl}" alt="${project.title}">`;

    return projectElement;
}


const getProjects = async () => {
    const authToken = sessionStorage.getItem("authToken");
    console.log(authToken);
    if (!authToken) {
        console.error(" token non trouvé.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json"
            }
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

document.querySelectorAll(".js-modal").forEach(element => {
    element.addEventListener("click", (e) => {
        openModal(e);
        e.preventDefault();
        getProjects();
    });
});





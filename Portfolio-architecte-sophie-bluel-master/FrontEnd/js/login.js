//---------------------
// FORMULAIRE CONNEXION
//---------------------

function ajoutListenerConnexion() {
  const formulaireConnexion = document.querySelector(".formulaire-connexion");
  formulaireConnexion.addEventListener("submit", function (event) {
    event.preventDefault();

    const connexion = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };

    const chargeUtile = JSON.stringify(connexion);

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.userId && data.token) {
          console.log("Connexion réussie. Id :", data.userId);
          console.log("Token:", data.token);

          const token = `${data.token}`;
          const userId = data.userId;
          sessionStorage.setItem("authToken", token);
          sessionStorage.setItem("userId", userId);
          console.log(userId);

          window.location.href = "./index.html";
        } else {
          const errorMessage = "Erreur dans l'identifiant ou le mot de passe.";
          window.alert(errorMessage);
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion :", error);
      });
  });
}

ajoutListenerConnexion();

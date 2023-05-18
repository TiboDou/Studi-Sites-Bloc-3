function getProductsAdmin() {
  // Effectuer une requête GET vers l'API pour récupérer la liste des produits
  fetch('https://studi-bloc3-api-td.herokuapp.com/produits', {
    method: "GET",
  })
    .then(response => response.json())
    .then(data => {
      const liste_produits = document.getElementById('liste_produits'); // Récupérer le conteneur du tableau des produits


      // Parcourir les produits et générer les lignes du tableau
      data.forEach(produit => {
        const row = document.createElement('tr');

        const no_produit = document.createElement('td');
        no_produit.textContent = produit.no_produit;
        row.appendChild(no_produit);

        const libelle = document.createElement('td');
        libelle.textContent = produit.libelle;
        row.appendChild(libelle);

        const description = document.createElement('td');
        description.textContent = produit.description;
        row.appendChild(description);

        const prix = document.createElement('td');
        prix.textContent = produit.prix + "€";
        row.appendChild(prix);

        const promo = document.createElement('td');
        getPromosAdmin(produit.no_produit, promo);
        row.appendChild(promo);
       

        const no_categorie = document.createElement('td');
        no_categorie.textContent = produit.no_categorie;
        row.appendChild(no_categorie);
      
        const actions = document.createElement('td');
        
        const modifierBtn = document.createElement('button');
        modifierBtn.textContent = 'Modifier';
        modifierBtn.classList.add('update-product-btn'); 
        modifierBtn.addEventListener('click', () => {
          // Logique pour la modification du produit
          const updatePopupTrigger = document.querySelector(".update-popup-trigger");
          if (updatePopupTrigger) {
            updatePopupTrigger.click();
          }
          remplirFormulaire(produit.no_produit);
          submitUpdateBtn(produit.no_produit);
          console.log('Modifier produit', produit.no_produit);
        });
        actions.appendChild(modifierBtn);
      
        const supprimerBtn = document.createElement('button');
        supprimerBtn.textContent = 'Supprimer';
        supprimerBtn.classList.add('delete-product-btn');
        supprimerBtn.addEventListener('click', () => {
          // Logique pour la suppression du produit
          submitDeleteBtn(produit.no_produit);
          const deletePopupTrigger = document.querySelector(".delete-popup-trigger");
          if (deletePopupTrigger) {
            deletePopupTrigger.click();
          }
          console.log('Supprimer produit', produit.no_produit);
        });
        actions.appendChild(supprimerBtn);


        row.appendChild(actions);
      
        liste_produits.appendChild(row);
      });
    })
    .catch(error => console.error(error));
}

function getPromosAdmin(no_produit, promoElement) {
    // Effectuer une requête GET vers l'API pour récupérer les informations sur les promotions du produit
    fetch("https://studi-bloc3-api-td.herokuapp.com/produits/" + no_produit + "/promotions", {
      method: "GET",
    })
      .then(response => response.json())
      .then(promosData => {
        // On traite les données de promotions

        if (promosData.length > 0) {
            const promoTable = document.createElement('table');
            promoTable.classList.add('tableau_promo'); //On ajoute la classe tableau_promo à notre tableau pour gérer le style
            

            promosData.forEach(promotion => {
            const noPromotion = promotion.no_promotion;
            const no_produit = promosData.no_produit;

            const promoRow = document.createElement('tr');
        
            const pourcentage = document.createElement('td');
            pourcentage.textContent = promotion.pourcentage + '%';
            promoRow.appendChild(pourcentage);
        
            const dateDebut = document.createElement('td');
            dateDebut.textContent = promotion.date_debut;
            promoRow.appendChild(dateDebut);
        
            const dateFin = document.createElement('td');
            dateFin.textContent = promotion.date_Fin;
            promoRow.appendChild(dateFin);
        
            promoTable.appendChild(promoRow);

          });
        
          promoElement.appendChild(promoTable);


        } else {
          promoElement.innerHTML = '<button class="add-promo-btn">Ajouter promotion</button>';

          const addPromoBtn = promoElement.querySelector('.add-promo-btn');
          addPromoBtn.addEventListener('click', () => {
          // Code pour ouvrir la popup d'ajout de promotion
          const popup = document.querySelector('.add-promo-popup');
          popup.classList.add('active');
          // Ajoutez ici l'appel à la fonction qui ouvre la popup d'ajout de promotion
          console.log(no_produit);
          
          submitAddPromoBtn(no_produit);
});

        }
      })
      .catch(error => { console.error(error)
                        return [];
      });
  }


/* Code concernant la popup d'ajout d'un produit */

let addPopupContainer;

function popupAddProduct() {
  addPopupContainer = document.querySelector(".add-product-popup");
  const popupTriggers = document.querySelectorAll(".popup-trigger");

  popupTriggers.forEach(trigger => {
    console.log("huehuehue");

    trigger.addEventListener("click", () => togglePopupAddProduct(addPopupContainer))
  })
}

function togglePopupAddProduct(addPopupContainer) {
  console.log("4");
  console.log("Voir : " + addPopupContainer);
  addPopupContainer.classList.toggle("active")
}

function submitAddBtn() {
  document.getElementById("add-product-form").addEventListener("submit", function(e) {
    e.preventDefault();


    const form = document.getElementById("add-product-form");
    const formData = new FormData(form);

    // On récupère les données pour tester les saisies du formulaire

    const categorie = formData.get("no_categorie");
    const libelle = formData.get("libelle");
    const description = formData.get("description");
    const prix = formData.get("prix");
    const url_img = formData.get("url_img")

    // On teste les saisie du formulaire de création de produit

    if(!testSaisieUtilisateurAddUpdate(categorie, libelle, description, prix, url_img)) {
      return;
    };

    const productData = {};
    // On itère sur chaque paire clé/valeur donc par exemple pour le champ libelle -> 
    // key = libelle , value = saisie utilisateur
    formData.forEach((value, key) => {
      productData[key] = value;
    });

    //Effectuer une requête POST vers l'api pour envoyer les inputs du formulaire
    fetch("https://studi-bloc3-api-td.herokuapp.com/produits", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);

        alert("Le produit a été créé avec succès!");

        // Fermer la pop-up en déclenchant le click sur un élément avec la classe "popup-trigger"
        const popupTrigger = document.querySelector(".popup-trigger");
        if (popupTrigger) {
          popupTrigger.click();
        } 
      })
    .catch(error => { console.error(error)
                    return [];
    });
  });
}

/* Code concernant la popup d'ajout de promotion sur un produit */

let addPromoPopupContainer;

function popupAddPromo() {
  addPromoPopupContainer = document.querySelector(".add-promo-popup");
  const popupTriggers = document.querySelectorAll(".add-promo-popup-trigger");

  popupTriggers.forEach(trigger => {
    trigger.addEventListener("click", () => togglePopupPromoProduct(addPromoPopupContainer))
  })
}

function togglePopupPromoProduct(addPromoPopupContainer) {
  addPromoPopupContainer.classList.toggle("active")
}

/* Soumission forumulaire d'ajout de promotion */

function submitAddPromoBtn(no_produit) {
  document.getElementById("add-promo-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const form = document.getElementById("add-promo-form");
    const formData = new FormData(form);

    // On récupère les données pour tester les saisies du formulaire

    const pourcentage = formData.get("pourcentage");
    const dateDebut = formData.get("date_debut");
    const dateFin = formData.get("date_Fin");

    console.log(pourcentage, dateDebut, dateFin);

    // On valide d'abord le pourcentage

    const isValidPourcentage = validationSaisiePourcentage(pourcentage);

    if (!isValidPourcentage) {
      alert('Veuillez saisir un pourcentage compris entre 0 et 100, 2 chiffres après la virgule maximum');
      return;
    } 
  
    // Puis la date de début 

    const isValidDd = validationSaisieDates(dateDebut);

    if (!isValidDd) {
      alert('Veuillez saisir la date de début au format : YYYY-MM-DD');
      return;
    } 

    // Et enfin la date de fin

    const isValidDf = validationSaisieDates(dateFin);

    if (!isValidDf) {
      alert('Veuillez saisir la date de fin au format : YYYY-MM-DD');
      return;
    } 

    const productData = {};
    // On itère sur chaque paire clé/valeur donc par exemple pour le champ libelle -> 
    // key = libelle , value = saisie utilisateur
    formData.forEach((value, key) => {
      productData[key] = value;
    });
    
    // On effectue une requête POST vers l'api pour envoyer les inputs du formulaire
    fetch("https://studi-bloc3-api-td.herokuapp.com/produits/" + no_produit + "/promotions", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
      .then(data => {
        console.log(data);

        alert("La promotion a été ajouté avec succès");

        location.reload(); // Actualiser la page est bien mieux
      })
    .catch(error => { console.error(error)
                    return [];
    });
  });
}

/* Code concernant la popup de modification d'un produit */

let updatePopupContainer;

function popupUpdateProduct() {
  console.log("5");
  updatePopupContainer = document.querySelector(".update-product-popup");
  console.log("6");
  const popupTriggers = document.querySelectorAll(".update-popup-trigger");
  console.log(popupTriggers);

  popupTriggers.forEach(trigger => {
    console.log("huehuehue");

    trigger.addEventListener("click", () => togglePopupUpdateProduct(updatePopupContainer))
  })
}

function togglePopupUpdateProduct(updatePopupContainer) {
  updatePopupContainer.classList.toggle("active")
}

function remplirFormulaire(no_produit) {
  fetch('https://studi-bloc3-api-td.herokuapp.com/produits/' + no_produit, {
    method: "GET",
  })
    .then(response => response.json())
    .then(data => {
  
      document.getElementById("update_no_categorie").value = data.no_categorie;
      document.getElementById("update_libelle").value = data.libelle;
      document.getElementById("update_description").value = data.description;
      document.getElementById("update_prix").value = data.prix;
      document.getElementById("update_url_img").value = data.url_img;

      console.log(data.libelle);
    })
    .catch(error => { console.error(error)
      return [];
    });
}


function submitUpdateBtn(no_produit) {
  document.getElementById("update-product-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const form = document.getElementById("update-product-form");
    const formData = new FormData(form);

    // On récupère les données pour tester les saisies du formulaire

    const categorie = formData.get("no_categorie");
    const libelle = formData.get("libelle");
    const description = formData.get("description");
    const prix = formData.get("prix");
    const url_img = formData.get("url_img")

    if(!testSaisieUtilisateurAddUpdate(categorie, libelle, description, prix, url_img)) {
      return;
    };

    const productData = {};
    // On itère sur chaque paire clé/valeur donc par exemple pour le champ libelle -> 
    // key = libelle , value = saisie utilisateur
    formData.forEach((value, key) => {
      productData[key] = value;
    });


    //Effectuer une requête POST vers l'api pour envoyer les inputs du formulaire
    fetch("https://studi-bloc3-api-td.herokuapp.com/produits/" + no_produit, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(productData)
    })
      .then(data => {
        console.log(data);

        alert("Le produit a été modifié avec succès!");

        location.reload(); // Actualiser la page est bien mieux
      })
    .catch(error => { console.error(error)
                    return [];
    });
  });
}

// Code concernant la suppression de produits

let deletePopupContainer;

function popupDeleteProduct() {
  console.log("1");
  deletePopupContainer = document.querySelector(".delete-product-popup");
  console.log("2");
  const deletePopupTriggers = document.querySelectorAll(".delete-popup-trigger");
  console.log(deletePopupTriggers);

  deletePopupTriggers.forEach(trigger => {
    console.log("huehuehue");

    trigger.addEventListener("click", () => togglePopupDeleteProduct(deletePopupContainer))
  })
}

function togglePopupDeleteProduct(deletePopupContainer) {
  console.log("4");
  console.log("Voir : " + deletePopupContainer);
  deletePopupContainer.classList.toggle("active")
}


function submitDeleteBtn(no_produit) {
  document.getElementById("delete-product-form").addEventListener("submit", function(e) {
    e.preventDefault();

    //Effectuer une requête POST vers l'api pour envoyer les inputs du formulaire
    fetch("https://studi-bloc3-api-td.herokuapp.com/produits/" + no_produit, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then(response => {
        console.log(response);

        alert("Le produit a été supprimé avec succès!");
        //On recharge la page
        location.reload();
      });
  });
}


/* Ci-gisent les fonctions de vérifications de saisies */

/* Vérif de saisie promotion */
function validationSaisieDates(date_df) {
  // Expression régulière pour le format "YYYY-MM-DD"
  // En gros : d = chiffre, {chiffre} = la quantité voulue. 
  // Avec ^ qui spécifie le début et $ la fin de l'expression
  let regex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (regex.test(date_df)) {
    // La date est au bon format
    return true;
  } else {
    // La date n'est pas au bon format
    return false;
  }
}

function validationSaisiePourcentage(pourcent) {
  // Expression régulière pour les pourcentage 
  let regex = /^([1-9][0-9]?|100)(\.[0-9]{1,2})?$/

  if (regex.test(pourcent)) {
    // Le pourcentage est au bon format
    return true;
  } else {
    // Le pourcentage n'est pas au bon format
    return false;
  }
}

// Fonction pour checker les saisies liées à la création et modification de produit
function testSaisieUtilisateurAddUpdate(categorie, libelle, description, prix, url_img) {
  // On valide d'abord la saisie catégorie

  const isValidCategorie = validationSaisieCategorie(categorie);

  if (!isValidCategorie) {
    alert('Veuillez saisir une catégorie entre 1 et 10');
    return false;
  } 

  // Puis celle du libelle

  const isValidLibelle = validationSaisieLibelle(libelle);

  if (!isValidLibelle) {
    alert('Veuillez cesser les carabistouilles : 30 caractères maximum, pas de caractères spéciaux en dehors de .,!');
    return false;
  } 

  // Puis celle de la description

  const isValidDescription = validationSaisieDescription(description);

  if (!isValidDescription) {
    alert('Veuillez cesser les carabistouilles : 250 caractères maximum, pas de caractères spéciaux en dehors de .,!');
    return false;
  } 

  // Puis celle du prix 

  const isValidPrix = validationSaisiePrix(prix);

  if (!isValidPrix) {
    alert('Le prix doit être compris entre 1 et 10000 et avoir 2 chiffres après la virgule maximum');
    return false;
  } 

  // Et enfin celle de l'uri de l'image

  const isValidUri = validationSaisieImg(url_img);

  if (!isValidUri) {
    alert('Veuillez cesser les carabistouilles : 250 caractères maximum, doit se terminer par .jpg ou .png');
    return false;
  } 

  return true;
}

/* Vérif de saisie création et modification produit*/
function validationSaisieCategorie(categorie) {
  // Expression régulière pour les catégories, à noter que dans le cadre de ce projet j'ai décide de me limiter à 10 catégories 
  const regex = /^([1-9]|10)$/

  if (regex.test(categorie)) {
    // La categprie est au bon format
    return true;
  } else {
    // La categorie n'est pas au bon format
    return false;
  }
}

function validationSaisieLibelle(libelle) {
  // Expression régulière pour les catégories, à noter que dans le cadre de ce projet j'ai décide de me limiter à 10 catégories 
  const regex = /^[a-zA-Z0-9.,'!àôîéèçùû ]+$/

  if ((regex.test(libelle)) && (libelle.length <= 30)) {
    // La chaine de caractère est conforme
    return true;
  } else {
    // La chaine de caractère n'est pas conforme
    return false;
  }
}

function validationSaisieDescription(description) {
  // Expression régulière pour les catégories, à noter que dans le cadre de ce projet j'ai décide de me limiter à 10 catégories 
  const regex = /^[a-zA-Z0-9.,'!àôîéèçùû  ]+$/

  if ((regex.test(description)) && (description.length <= 250)) {
    // La chaine de caractère est conforme
    return true;
  } else {
    // La chaine de caractère n'est pas conforme
    return false;
  }
}

function validationSaisiePrix(prix) {
  // Expression régulière pour les catégories, à noter que dans le cadre de ce projet j'ai décide de me limiter à 10 catégories 
  const regex = /^([1-9][0-9]?|10000)(\.[0-9]{1,2})?$/

  if (regex.test(prix)) {
    // Le prix est au bon format
    return true;
  } else {
    // La prix n'est pas au bon format
    return false;
  }
}

function validationSaisieImg(url_img) {
  /* Expression régulière pour les url d'images : 
   * J'indique que la chaîne de caractère doit se terminer par .jpg, .JPG ou .png, .PNG */
  const regex = /\.(jpg|png)$/;

  if ((regex.test(url_img)) && (url_img.length <= 250)) {
    // La chaine de caractère est conforme
    return true;
  } else {
    // La chaine de caractère n'est pas conforme
    return false;
  }
}





document.addEventListener("DOMContentLoaded", () => {
  // On appelle les fonction pour gérer l'affichage des popups, je ne suis pas fan de JS, en fait, c'est la première fois que je joue réellement avec le DOM, c'est sympa mais bordel ça devient illisible avec 400 lignes, il faut vraiment que je vois comment séparer en plusieurs fichiers, sinon, ça va vous ?
  popupAddProduct();
  popupAddPromo();
  popupUpdateProduct();
  popupDeleteProduct();
  // Appeler la fonction pour récupérer les produits du côté administrateur
  getProductsAdmin();
  submitAddBtn();
});


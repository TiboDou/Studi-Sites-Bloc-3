function getProduct() {
fetch('https://studi-bloc3-api-td.herokuapp.com/produits', {
  method: "GET",
})
.then(response => response.json())
.then(data => {
  const produitsContainer = document.getElementById('produits-container'); 

  data.forEach(produit => {
    const produitElement = document.createElement('div');
    produitElement.classList.add('produits');

    const image = document.createElement("img");
    image.src = produit.url_img; // Récupérer l'URI de l'image
    image.classList.add('image'); // Ajouter la classe 'image' à l'élément image
    produitElement.appendChild(image); // Ajouter l'image au div produitElement

    const libelle = document.createElement("h4");
    libelle.textContent = produit.libelle;
    libelle.classList.add('libelle'); // Ajouter la classe 'libelle' à l'élément libelle
    produitElement.appendChild(libelle); // Ajouter le libellé au div produitElement

    const description = document.createElement("p");
    description.textContent = produit.description;
    description.classList.add('description'); // Ajouter la classe 'description' à l'élément description
    produitElement.appendChild(description); // Ajouter la description au div produitElement

    const prixContainer = document.createElement('div')
    prixContainer.classList.add('prix_container');

    const prix = document.createElement("span");
    prix.textContent = produit.prix + " €";
    prix.classList.add('prix'); // Ajouter la classe 'prix' à l'élément prix
    prixContainer.appendChild(prix); //Ajouter le prix à la div produitElement

    const promotion = document.createElement("span");
    promotion.textContent = getPromos(produit.no_produit, produit.prix, promotion);
    promotion.classList.add('promotion'); // Ajouter la classe 'promotion' à l'élément promotion
    prixContainer.appendChild(promotion);

    produitElement.appendChild(prixContainer);
    produitsContainer.appendChild(produitElement); // Ajouter le div produitElement au conteneur produitsContainer
  });
})
.catch(error => console.error(error));
}

function getProduits(filteredData) {
  const produitsContainer = document.getElementById('produits-container'); 

  filteredData.forEach(produit => {
    const produitElement = document.createElement('div');
    produitElement.classList.add('produits');

    const image = document.createElement("img");
    image.src = produit.url_img; // Récupérer l'URI de l'image
    image.classList.add('image'); // Ajouter la classe 'image' à l'élément image
    produitElement.appendChild(image); // Ajouter l'image au div produitElement

    const libelle = document.createElement("h4");
    libelle.textContent = produit.libelle;
    libelle.classList.add('libelle'); // Ajouter la classe 'libelle' à l'élément libelle
    produitElement.appendChild(libelle); // Ajouter le libellé au div produitElement

    const description = document.createElement("p");
    description.textContent = produit.description;
    description.classList.add('description'); // Ajouter la classe 'description' à l'élément description
    produitElement.appendChild(description); // Ajouter la description au div produitElement

    const prixContainer = document.createElement('div')
    prixContainer.classList.add('prix_container');

    const prix = document.createElement("span");
    prix.textContent = produit.prix + " €";
    prix.classList.add('prix'); // Ajouter la classe 'prix' à l'élément prix
    prixContainer.appendChild(prix); //Ajouter le prix à la div produitElement

    const promotion = document.createElement("span");
    promotion.textContent = getPromos(produit.no_produit, produit.prix, promotion);
    promotion.classList.add('promotion'); // Ajouter la classe 'promotion' à l'élément promotion
    prixContainer.appendChild(promotion);

    produitElement.appendChild(prixContainer);
    produitsContainer.appendChild(produitElement);
})
}



function getPromos(no_produit, prix, promoElement) {
  fetch("https://studi-bloc3-api-td.herokuapp.com/produits/" + no_produit + "/promotions", {
      method: "GET",
    })
      .then(response => response.json())
      .then(promosData => {
        if (promosData.length > 0) {
            const promotion = promosData[0];
            /*console.log("Promotion:", promotion);
            console.log("Promotion.pourcentage:", promotion.pourcentage);
            console.log("Prix:", prix);
            console.log("Prix - prix * promotion.pourcentage :", prix - (prix * (promotion.pourcentage/100)));*/

            const prixApresPromotion = (prix - (prix * (promotion.pourcentage / 100))).toFixed(2) + "€";
            promoElement.textContent = prixApresPromotion;
            
        }
        
      })
      .catch(error => { 
        console.error(error);
        promoElement.textContent ="";
      });
} 


function getCategoriesFromProducts() {
  fetch('https://studi-bloc3-api-td.herokuapp.com/produits', {
    method: 'GET'
  })
    .then(response => response.json())
    .then(data => {
      const selectElement = document.getElementById('category-filter');
      const categories = new Set();

      // Récupérer les catégories uniques des produits
      data.forEach(produit => {
        categories.add(produit.no_categorie);
      });

        // Ajouter une option par catégorie dans le select
        categories.forEach(categorie => {
        const option = document.createElement('option');
        option.value = categorie;

        option.textContent = getLabelCategorie(categorie);
        selectElement.appendChild(option);
      });

      selectElement.addEventListener('change', () => handleCategoryFilter(data));
    })
    .catch(error => console.error(error));
}

/*Cette fonction permet de gérer l'affichage du filtre à partir des catégories*/
function getLabelCategorie(categorie) {
  switch (categorie) {
    case 1:
      return 'Fruits';
      break;
    case 2:
      return 'Légumes';
      break;
    case 3:
      return 'Mes jeux d\'enfance';
      break;
    // TODO TODO TODO TODO TODO TODO TODO TODO TODO TODO
    case 10:
      return 'Catégorie 10';
      break;
    default:
      return categorie; // Retourne la catégorie telle quelle si aucun libellé spécifique n'est défini
  }
}

function handleCategoryFilter(data) {
  const selectElement = document.getElementById('category-filter'); 
  const selectedCategory = selectElement.value;
  filterProductsByCategory(selectedCategory, data);
}

function filterProductsByCategory(selectedCategory, data) {
  const produitsContainer = document.getElementById('produits-container');
  produitsContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les produits filtrés

  // Vérifiez si la catégorie sélectionnée est "100" (Toutes les catégories)
  if (selectedCategory === '100') {
    // Afficher tous les produits
    getProduct();
  } else {
    // Filtrer les produits par catégorie
    const categorie = parseInt(selectedCategory);
    
    const filteredData = data.filter(produit => produit.no_categorie === categorie);
    getProduits(filteredData);
  }
}


document.addEventListener('DOMContentLoaded', function() {

  getProduct();
  getCategoriesFromProducts();
});
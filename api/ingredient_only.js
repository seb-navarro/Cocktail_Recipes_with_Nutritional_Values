// Base URLs for CocktailDB APIs
const ingredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?i=';
const relatedCocktailURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';

// Parse query string to extract ingredient name
const queryString = document.URL.split('?ingredient=');
const ingredient = queryString[1];
const ingredientName = decodeURIComponent(ingredient);

// DOM elements
const resultsContainer = document.getElementById('results');
const relatedCocktailsContainer = document.getElementById('related-cocktails');
const descriptionContainer = document.getElementById('description');
const totalNutritionContainer = document.getElementById('total-nutrition');

// NutritionIX API credentials
const nutritionIxURL = "https://trackapi.nutritionix.com/v2/natural/nutrients";
const appId5 = "8c9d2710", appKey5 = "7a7ac4b8da55cd1a3a1d35f2653a2e88";
const appId6 = "931b20fb", appKey6 = "76da69c1e9d2b01224c6cc11f8de562e";

// Initialize total nutrition values
let total_caloriesValue = 0,
    total_fatValue = 0,
    total_sodiumValue = 0,
    total_carbsValue = 0,
    total_sugarsValue = 0,
    total_proteinValue = 0;

// Fetch ingredient data
fetch(`${ingredientURL}${ingredientName}`)
    .then(response => {
        if (!response.ok) throw new Error(`Error fetching ingredient data: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        const results = data.ingredients || [];
        resultsContainer.innerHTML = ''; // Clear existing content

        if (results.length === 0) {
            resultsContainer.innerHTML = `<p>No information found for "${ingredientName}".</p>`;
            return;
        }

        results.forEach(ingredient => {
            // Create and populate ingredient card
            const ingredientCard = document.createElement('div');
            ingredientCard.classList.add('col');
            ingredientCard.innerHTML = `
                <div class="d-flex align-items-center mx-auto ingredient-card">
                    <div class="text-center me-3">
                        <img src="https://www.thecocktaildb.com/images/ingredients/${ingredient.strIngredient}-Medium.png" 
                             alt="${ingredient.strIngredient}" class="img-fluid" style="height: 300px; width: 300px; object-fit: cover;">
                        <h3 class="mt-2"><strong>${ingredient.strIngredient}</strong></h3>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(ingredientCard);

            // Add ingredient description
            descriptionContainer.innerHTML = `
                <div class="card-body">
                    <p class="card-text">${ingredient.strDescription || 'No description available.'}</p>
                    <p class="card-text"><strong>Type:</strong> ${ingredient.strType || 'Unknown'}</p>
                    <p class="card-text"><strong>Alcoholic:</strong> ${ingredient.strAlcohol ? 'Yes' : 'No'}</p>
                </div>
            `;

            // Fetch related cocktails
            fetch(`${relatedCocktailURL}${ingredientName}`)
                .then(response => {
                    if (!response.ok) throw new Error(`Error fetching related cocktails: ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    const cocktails = data.drinks || [];
                    relatedCocktailsContainer.innerHTML = '';

                    if (cocktails.length === 0) {
                        relatedCocktailsContainer.innerHTML = `<p>No cocktails found for "${ingredientName}".</p>`;
                        return;
                    }

                    cocktails.forEach(drink => {
                        const card = document.createElement('div');
                        card.classList.add('card', 'col-md-4', 'text-dark', 'mb-4', 'p-5', 'g-3', 'd-flex', 'justify-content-center', 'align-items-center');
                        card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        card.innerHTML = `
                            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="img-fluid" style="height: 200px; object-fit: cover;">
                            <div class="card-body">
                                <h5 class="card-title">${drink.strDrink}</h5>
                                <a href="ingredients.html?cocktail=${drink.idDrink}" class="btn btn-outline-secondary btn-md my-2">More Info</a>
                            </div>
                        `;
                        relatedCocktailsContainer.appendChild(card);
                    });
                })
                .catch(error => console.error(`Error fetching related cocktails: ${error}`));

            // Fetch nutritional data
            listIngredientSpecs(nutritionIxURL, ingredientName, appId6, appKey6, ingredientCard);
        });
    })
    .catch(error => console.error(`Error fetching ingredient data: ${error}`));

// Fetch and list ingredient specs
function listIngredientSpecs(url, ingredientName, appId, appKey, card) {
    fetch(url, {
        method: "POST",
        body: JSON.stringify({ query: ingredientName }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "x-app-id": appId,
            "x-app-key": appKey
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`NutritionIX API Error: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        const foods = data.foods || [];
        if (foods.length === 0) {
            console.warn(`No nutritional data found for ingredient: ${ingredientName}`);
            return;
        }

        const specsDiv = document.createElement('div');
        specsDiv.classList.add('mx-3');
        const specsList = document.createElement('ul');
        specsList.classList.add('list-group');
        const specsTitle = document.createElement('li');
        specsTitle.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        specsTitle.innerHTML = `1oz is equal to:`;

        specsList.appendChild(specsTitle);
        foods.forEach(food => {
            const fixedWeightInGrams = 28.35; // 1 ounce in grams
            const createSpecItem = (label, value, unit = '') => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                listItem.innerHTML = `${label}: <span class="badge rounded-pill bg-secondary">${value !== null ? `${value.toFixed(2)}${unit}` : 'N/A'}</span>`;
                return listItem;
            };
            specsList.appendChild(createSpecItem('Calories', food.nf_calories * fixedWeightInGrams / food.serving_weight_grams));
            specsList.appendChild(createSpecItem('Total Fat', food.nf_total_fat * fixedWeightInGrams / food.serving_weight_grams, 'g'));
            specsList.appendChild(createSpecItem('Sodium', food.nf_sodium * fixedWeightInGrams / food.serving_weight_grams, 'mg'));
            specsList.appendChild(createSpecItem('Carbohydrates', food.nf_total_carbohydrate * fixedWeightInGrams / food.serving_weight_grams, 'g'));
            specsList.appendChild(createSpecItem('Sugars', food.nf_sugars * fixedWeightInGrams / food.serving_weight_grams, 'g'));
            specsList.appendChild(createSpecItem('Protein', food.nf_protein * fixedWeightInGrams / food.serving_weight_grams, 'g'));
        });

        specsDiv.appendChild(specsList);
        card.appendChild(specsDiv);

        updateTotalNutrition(foods);
    })
    .catch(error => console.error(`NutritionIX API Error: ${error}`));
}

// Update total nutrition values
function updateTotalNutrition(foods) {
    const fixedWeightInGrams = 28.35; // 1 ounce in grams
    total_caloriesValue += foods.reduce((sum, food) => sum + food.nf_calories * fixedWeightInGrams / food.serving_weight_grams, 0);
    total_fatValue += foods.reduce((sum, food) => sum + food.nf_total_fat * fixedWeightInGrams / food.serving_weight_grams, 0);
    total_sodiumValue += foods.reduce((sum, food) => sum + food.nf_sodium * fixedWeightInGrams / food.serving_weight_grams, 0);
    total_carbsValue += foods.reduce((sum, food) => sum + food.nf_total_carbohydrate * fixedWeightInGrams / food.serving_weight_grams, 0);
    total_sugarsValue += foods.reduce((sum, food) => sum + food.nf_sugars * fixedWeightInGrams / food.serving_weight_grams, 0);
    total_proteinValue += foods.reduce((sum, food) => sum + food.nf_protein * fixedWeightInGrams / food.serving_weight_grams, 0);

}

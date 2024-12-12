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
const appId7 = "4315d4a8"; const appKey7 = "f17c3d4d8cfe2ff7dac75ca321b0483f";

function createNode(element) {
    return document.createElement(element);
}

function append(parent, child) {
    return parent.appendChild(child);
}


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
    // Process and display ingredient data
    .then(data => {
        const results = data.ingredients || [];
        resultsContainer.innerHTML = ''; // Clear existing content

        // Check if any data is returned
        if (results.length === 0) {
            resultsContainer.innerHTML = `<p>No information found for "${ingredientName}".</p>`;
            return;
        }
        console.log(document.getElementById('total-nutrition'));
// Create and display ingredient cards
        results.forEach(ingredient => {
            // Create and populate ingredient card
            const ingredientCard = document.createElement('div');
            ingredientCard.classList.add('row');
            ingredientCard.innerHTML = `
                <div class="d-flex align-items-center mx-auto ingredient-card">
                    <div class="text-center me-3">
                        <img src="https://www.thecocktaildb.com/images/ingredients/${ingredient.strIngredient}-Medium.png" 
                             alt="${ingredient.strIngredient}" class="img-fluid" style="height: 300px; width: 300px; object-fit: cover;">
                        <h3 class="mt-2"><strong>${ingredient.strIngredient}</strong></h3>
                    </div>
                </div>
            `;
            // Add ingredient card to results container
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
                    // Check for errors
                    if (!response.ok) throw new Error(`Error fetching related cocktails: ${response.statusText}`);
                    return response.json();
                })
                .then(data => {
                    // Process and display related cocktails
                    const cocktails = data.drinks || [];
                    relatedCocktailsContainer.innerHTML = '';
                    // Check if any data is returned
                    if (cocktails.length === 0) {
                        relatedCocktailsContainer.innerHTML = `<p>No cocktails found for "${ingredientName}".</p>`;
                        return;
                    }
                    // Create and display related cocktail cards
                    cocktails.forEach(drink => {
                        const card = document.createElement('div');
                        // Add classes and styles
                        card.classList.add('card', 'col-md-4', 'text-dark', 'mb-4', 'p-5', 'g-3', 'd-flex', 'justify-content-center', 'align-items-center');
                        card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
                        card.innerHTML = `
                            <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="img-fluid" style="height: 200px; object-fit: cover;">
                            <div class="card-body">
                                <h5 class="card-title">${drink.strDrink}</h5>
                                <a href="ingredients.html?cocktail=${drink.idDrink}" class="btn btn-outline-secondary btn-md my-2">More Info</a>
                            </div>
                        `;
                        // Add related cocktail card to related cocktails container
                        relatedCocktailsContainer.appendChild(card);
                    });
                })
                // Handle errors
                .catch(error => console.error(`Error fetching related cocktails: ${error}`));

        });
        // Fetch nutritional data
        listIngredientSpecs(nutritionIxURL, ingredientName, appId7, appKey7, totalNutritionContainer);
    })
        // Handle errors and display error message
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
            // Process and display nutritional data
            .then(data => {
                const foods = data.foods || [];
                if (foods.length === 0) {
                    console.warn(`No nutritional data found for ingredient: ${ingredientName}`);
                    return;
                }
                // Create and display card
                const specsDiv = createNode('div');
                specsDiv.setAttribute('class', 'mx-3');
        
                const specsList = createNode('ul');
                specsList.setAttribute('class', 'list-group');
        
                const specsTitle = createNode('li');
                // Add classes and styles
                specsTitle.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
                specsTitle.innerHTML = `1oz is equal to:`;
                append(specsList, specsTitle);
                // Convert grams to ounces
                const fixedWeightInGrams = 28.35; // 1 ounce in grams
                // Create and display nutritional data
                foods.forEach(food => {
                    // Create and return HTML element
                    const createSpecItem = (label, value, unit = '') => {
                        const listItem = createNode('li');
                        listItem.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
                        listItem.innerHTML = `${label}: <span class="badge rounded-pill bg-secondary">${value !== null ? `${(value * fixedWeightInGrams / food.serving_weight_grams).toFixed(2)}${unit}` : 'N/A'}</span>`;
                        return listItem;
                    };
                    // Append nutritional data
                    append(specsList, createSpecItem('Calories', food.nf_calories, ''));
                    append(specsList, createSpecItem('Total Fat', food.nf_total_fat, 'g'));
                    append(specsList, createSpecItem('Sodium', food.nf_sodium, 'mg'));
                    append(specsList, createSpecItem('Carbohydrates', food.nf_total_carbohydrate, 'g'));
                    append(specsList, createSpecItem('Sugars', food.nf_sugars, 'g'));
                    append(specsList, createSpecItem('Protein', food.nf_protein, 'g'));
                });
                // Append to card
                append(specsDiv, specsList);
                append(card, specsDiv);
                // Update total nutrition
                updateTotalNutrition(foods);
            })
            .catch(error => {
                console.error(`NutritionIX API Error: ${error}`);
                // Create and display card
                const specsDiv = createNode('div');
                specsDiv.setAttribute('class', 'mx-3');
                
                const specsList = createNode('ul');
                specsList.setAttribute('class', 'list-group');
        
                const specsTitle = createNode('li');
                specsTitle.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
                specsTitle.innerHTML = `1oz is equal to:`;
                // Append nutritional data
                append(specsList, specsTitle);
                // Create and display nutritional data
                ['Calories', 'Total Fat', 'Sodium', 'Carbohydrates', 'Sugars', 'Protein'].forEach(label => {
                    const listItem = createNode('li');
                    listItem.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
                    listItem.innerHTML = `${label}: <span class="badge rounded-pill bg-secondary">N/A</span>`;
                    append(specsList, listItem);
                });
                // Append to card
                append(specsDiv, specsList);
                append(card, specsDiv);
            });
        }
        // Update total nutrition
        function updateTotalNutrition(foods) {
            const fixedWeightInGrams = 28.35; // 1 ounce in grams
            // Calculate total nutrition
            total_caloriesValue = foods.reduce((sum, food) => sum + ((food.nf_calories || 0) * fixedWeightInGrams / food.serving_weight_grams), 0);
            total_fatValue = foods.reduce((sum, food) => sum + ((food.nf_total_fat || 0) * fixedWeightInGrams / food.serving_weight_grams), 0);
            total_sodiumValue = foods.reduce((sum, food) => sum + ((food.nf_sodium || 0) * fixedWeightInGrams / food.serving_weight_grams), 0);
            total_carbsValue = foods.reduce((sum, food) => sum + ((food.nf_total_carbohydrate || 0) * fixedWeightInGrams / food.serving_weight_grams), 0);
            total_sugarsValue = foods.reduce((sum, food) => sum + ((food.nf_sugars || 0) * fixedWeightInGrams / food.serving_weight_grams), 0);
            total_proteinValue = foods.reduce((sum, food) => sum + ((food.nf_protein || 0) * fixedWeightInGrams / food.serving_weight_grams), 0);
            // Display total nutrition
            const totalNutritionHTML = `
                <h4>Total Nutritional Values:</h4>
                <ul class="list-group list-group-flush bg-transparent">
                    <li class="list-group-item bg-transparent">Calories: ${total_caloriesValue.toFixed(2)}</li>
                    <li class="list-group-item bg-transparent">Total Fat: ${total_fatValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Sodium: ${total_sodiumValue.toFixed(2)}mg</li>
                    <li class="list-group-item bg-transparent">Total Carbohydrates: ${total_carbsValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Sugars: ${total_sugarsValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Protein: ${total_proteinValue.toFixed(2)}g</li>
                </ul>
                <h6><em><strong>Per 1 oz measured</strong></em></h6>
                
            `;
            // Update total nutrition
            const totalContainer = document.getElementById('total-nutrition');
            totalContainer.innerHTML = totalNutritionHTML;
        }
        // Create and return HTML element
        function createSpecItem(label, value, unit) {
            const listItem = createNode('li');
            listItem.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
            listItem.innerHTML = `${label}: <span class="badge rounded-pill bg-secondary">${value} ${unit}</span>`;
            return listItem;    
        }
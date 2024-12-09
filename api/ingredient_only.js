// Base URLs for CocktailDB APIs
const ingredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?i=';
const relatedCocktailURL = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';

const queryString = document.URL.split('?ingredient=');
const ingredient = queryString[1];
const ingredientName = decodeURIComponent(ingredient);

const resultsContainer = document.getElementById('results');
const relatedCocktailsContainer = document.getElementById('related-cocktails');

const appId5 = "8c9d2710"; const appKey5 = "7a7ac4b8da55cd1a3a1d35f2653a2e88";

// Initializing/Resetting variables
let total_caloriesValue = 0,
total_fatValue = 0,
total_sodiumValue = 0,
total_carbsValue = 0,
total_sugarsValue = 0,
total_proteinValue = 0;


// Fetch ingredient data
fetch(`${ingredientURL}${ingredientName}`)
    // Fetch contents from the API response and format contents to display as HTML elements
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
            // Create the card container
            const ingredientCard = document.createElement('div');
            ingredientCard.classList.add('col');
        
            // Populate the card content (image and name only)
            ingredientCard.innerHTML = `
                <div class="d-flex align-items-center mx-auto ingredient-card">
                    <!-- Left Section: Image and Name -->
                    <div class="text-center me-3">
                        <img style="height: 300px; width: 300px; object-fit: cover;" src="https://www.thecocktaildb.com/images/ingredients/${ingredient.strIngredient}-Medium.png" 
                             class="img-fluid" alt="${ingredient.strIngredient}" 
                             style="height: 200px; width: 200px; object-fit: cover;">
                        <h3 class="mt-2"><strong> ${ingredient.strIngredient}</strong></h3>
                    </div>
                </div>
            `;
        
            // Append the card to the results container
            const resultsContainer = document.getElementById('results'); // Ensure this element exists
            resultsContainer.appendChild(ingredientCard);
        
            // Add description and details to the separate "description" element
            const description = document.getElementById('description'); // Ensure this element exists
            description.innerHTML = `
                <div class="card-body">
                    <p class="card-text">${ingredient.strDescription || 'No description available.'}</p>
                    <p class="card-text"><strong>Type:</strong> ${ingredient.strType || 'Unknown'}</p>
                    <p class="card-text"><strong>Alcoholic:</strong> ${ingredient.strAlcohol ? 'Yes' : 'No'}</p>
                </div>
            `;
        });
        

        // Fetch related cocktails data
        fetch(`${relatedCocktailURL}${ingredientName}`)
            // Fetch contents from the API response and format contents to display as HTML elements    
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

                    // Building card and card contents
                    card.innerHTML = `
                        <img src="${drink.strDrinkThumb}" class="img-fluid" alt="${drink.strDrink}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${drink.strDrink}</h5>
                            <a href="ingredients.html?cocktail=${drink.idDrink}" class="btn btn-outline-secondary btn-md my-2">More Info</a>
                        </div>
                    `;
                    // Collate all contents for 'related-cocktails' div
                    relatedCocktailsContainer.appendChild(card);
                });
            })
            listIngredientSpecs(nutritionIxURL, ingredient, appId5, appKey5, card, valid_meassurement);
                // Collate all contents for 'ingredients' div
                ingredientsContainer.appendChild(card);
            });

function listIngredientSpecs(url, ingredient, appId, appKey, card, valid_meassurement) {
    // Fetch contents from the API response and format contents to display as HTML elements
    fetch(url, {
        // API header and body details for NutritionIX
        method: "POST",
        body: JSON.stringify({ query: ingredient }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "x-app-id": appId,
            "x-app-key": appKey
        }
    })
        .then(resp => {
            if (!resp.ok) throw new Error(`Nutritionix API Error: ${resp.statusText}`);
            return resp.json();
        })
        .then(data => {
            const foods = data.foods || [];
            if (!foods.length) {
                console.warn(`No foods found for ingredient: ${ingredient}`);
                return;
            }

            foods.forEach(food => {
                // Creating HTML elements
                const specs_div = createNode('div');
                const specs_ul = createNode('ul');

                const desc_li = createNode('li');
                const calories_li = createNode('li');
                const fat_li = createNode('li');
                const sodium_li = createNode('li');
                const carbs_li = createNode('li');
                const sugars_li = createNode('li');
                const protein_li = createNode('li');

                const calories_span = createNode('span');
                const fat_span = createNode('span');
                const sodium_span = createNode('span');
                const carbs_span = createNode('span');
                const sugars_span = createNode('span');
                const protein_span = createNode('span');


                // Setting required attributes for HTML elements
                specs_div.setAttribute('class', 'mx-3');
                specs_ul.setAttribute('class', 'list-group');

                desc_li.setAttribute('class', 'list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center');
                calories_li.setAttribute('class', 'list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center');
                fat_li.setAttribute('class', 'list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center');
                sodium_li.setAttribute('class', 'list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center');
                carbs_li.setAttribute('class', 'list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center');
                sugars_li.setAttribute('class', 'list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center');
                protein_li.setAttribute('class', 'list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center');

                calories_span.setAttribute('class', 'badge text-bg-secondary rounded-pill');
                fat_span.setAttribute('class', 'badge text-bg-secondary rounded-pill');
                sodium_span.setAttribute('class', 'badge text-bg-secondary rounded-pill');
                carbs_span.setAttribute('class', 'badge text-bg-secondary rounded-pill');
                sugars_span.setAttribute('class', 'badge text-bg-secondary rounded-pill');
                protein_span.setAttribute('class', 'badge text-bg-secondary rounded-pill');

                // Keeping track of sum values for each ingredient's spec
                total_caloriesValue += Number(food.nf_calories);
                total_fatValue += Number(food.nf_total_fat);
                total_sodiumValue += Number(food.nf_sodium);
                total_carbsValue += Number(food.nf_total_carbohydrate);
                total_sugarsValue += Number(food.nf_sugars);
                total_proteinValue += Number(food.nf_protein);

                // Calculating 'conversion_rate' used in getting ounce equivalent values
                serving_amount = food.serving_weight_grams;
                conversion_rate = 28.35 / serving_amount;
                // console.log(conversion_rate)    
                

                if(valid_meassurement === true){
                    calories_span.innerHTML = (food.nf_calories * conversion_rate).toFixed(2);
                    fat_span.innerHTML = (food.nf_total_fat * conversion_rate).toFixed(2) + 'g';
                    sodium_span.innerHTML = (food.nf_sodium * conversion_rate).toFixed(2) + 'g';
                    carbs_span.innerHTML = (food.nf_total_carbohydrate * conversion_rate).toFixed(2) + 'g';
                    sugars_span.innerHTML = (food.nf_sugars * conversion_rate).toFixed(2) + 'g';
                    protein_span.innerHTML = (food.nf_protein * conversion_rate).toFixed(2) + 'g';
                } else{
                    calories_span.innerHTML = "N/A";
                    fat_span.innerHTML = "N/A";
                    sodium_span.innerHTML = "N/A";
                    carbs_span.innerHTML = "N/A";
                    sugars_span.innerHTML = "N/A";
                    protein_span.innerHTML = "N/A";
                }
                

                // Text description for lists
                desc_li.innerHTML = "1oz is equal to:";
                calories_li.innerHTML = "Calories";
                fat_li.innerHTML = "Fat";
                sodium_li.innerHTML = "Sodium";
                carbs_li.innerHTML = "Carbohydrates";
                sugars_li.innerHTML = "Sugars";
                protein_li.innerHTML = "Protein";

                // Building card and card contents
                append(calories_li, calories_span);
                append(fat_li, fat_span);
                append(sodium_li, sodium_span);
                append(carbs_li, carbs_span);
                append(sugars_li, sugars_span);
                append(protein_li, protein_span);

                append(specs_ul, desc_li);
                append(specs_ul, calories_li);
                append(specs_ul, fat_li);
                append(specs_ul, sodium_li);
                append(specs_ul, carbs_li);
                append(specs_ul, sugars_li);
                append(specs_ul, protein_li);

                append(specs_div, specs_ul);

                append(card, specs_div);
            });

            // Display total values after fetching all ingredient data
            const totalContainer = document.getElementById('total-nutrition');
            totalContainer.innerHTML = `

                <h4>Total Nutrition Values (Estimate):</h4>
                <ul class="list-group list-group-flush bg-transparent">
                    <li class="list-group-item bg-transparent">Calories: ${total_caloriesValue.toFixed(2)}</li>
                    <li class="list-group-item bg-transparent">Total Fat: ${total_fatValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Sodium: ${total_sodiumValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Total Carbohydrates: ${total_carbsValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Sugars: ${total_sugarsValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Protein: ${total_proteinValue.toFixed(2)}g</li>
                </ul>

            `;
        })
        .catch(error => {
            // Custom error response
            console.error("NutritionIX API Error:", error);
            console.log("Ingredient with error: " + ingredient);
        });
}

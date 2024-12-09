// Base URLs for CocktailDB APIs
const cocktailIngredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=';
const cocktailImageURL = 'https://www.thecocktaildb.com/images/ingredients/';
let searchString = document.URL.split('?cocktail='); const cocktailId = searchString[1];

// Base URL for NutritionIX API search and keys
const nutritionIxURL = "https://trackapi.nutritionix.com/v2/natural/nutrients";
const appId1 = "877e0602"; const appKey1 = "9c96f922fd03f229782ebd80f468e923";
const appId2 = "b7b5026c"; const appKey2 = "41069590f031cbec6925acafe29900ad";
const appId3 = "cca115e6"; const appKey3 = "ca8dbac9a61a187ee8dedb2446908fd1";
const appId4 = "4a2d0dc2"; const appKey4 = "26b4cab3689702ce7e83c917ef91d81d";
const appId5 = "8c9d2710"; const appKey5 = "7a7ac4b8da55cd1a3a1d35f2653a2e88";

// Initializing/Resetting variables
let total_caloriesValue = 0,
    total_fatValue = 0,
    total_sodiumValue = 0,
    total_carbsValue = 0,
    total_sugarsValue = 0,
    total_proteinValue = 0;


function createNode(element) {
    // Function to create new HTML element
    return document.createElement(element);
}

function append(parent, child) {
    // Function to append HTML elements
    return parent.appendChild(child);
}


fetch(`${cocktailIngredientURL}${cocktailId}`)
    // Fetch contents from the API response and format contents to display as HTML elements
    .then(response => {
        if (!response.ok) throw new Error(`Cocktail API Error: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        const results = data.drinks || [];
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';


        results.forEach(drink => {
            const card = document.createElement('div');
            card.classList.add('card', 'col');

            // Building card and card contents
            card.innerHTML = `
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <h2 class="title d-flex justify-content-center align-items-center">${drink.strDrink}</h2>
            `;
            resultsContainer.appendChild(card);

            // Building array of valid ingredients
            const ingredientsArrTemp = Array.from({ length: 15 }, (_, i) => drink[`strIngredient${i + 1}`]);
            const ingredientsArr = ingredientsArrTemp.filter(ingredient => ingredient);
            // console.log("Ingredients Array:", ingredientsArr);

            // Adding content for 'instructions' paragraph
            const instrP = document.getElementById('instructions');
            instrP.innerHTML = drink.strInstructions


            // Getting and resetting content for 'ingredients' div
            const ingredientsContainer = document.getElementById('ingredients');
            ingredientsContainer.innerHTML = '';

            // Looping through all ingredients
            ingredientsArr.forEach(ingredient => {
                const card = document.createElement('div');
                card.classList.add('card', 'col-lg-3');
                const measureText = ingredient === 'Salt'
                    ? 'Garnish'

                    : drink[`strMeasure${ingredientsArr.indexOf(ingredient) + 1}`] || '';

                const meassurement_check = measureText.split(" ").join(",").split("\r").join(",").split("\n").join(",").split(",");


                let valid_meassurement = false;
                //console.log(meassurement_check)
                

                if(meassurement_check.includes("oz") || meassurement_check.includes("cl") || meassurement_check.includes("cup") || meassurement_check.includes("cups") || meassurement_check.includes("tbspn") || meassurement_check.includes("tsp") || meassurement_check.includes("tablespoons") || meassurement_check.includes("dl") || meassurement_check.includes("shot") || meassurement_check.includes("shots")){
                    valid_meassurement = true;
                }
                //console.log(valid_meassurement)

                // Building card and card contents
                card.innerHTML = `
                    <img src="${cocktailImageURL}${ingredient}-Medium.png" alt="${ingredient}">
                    <h4 class="title d-flex justify-content-center align-items-center"><a href="ingredient_only.html?ingredient=${ingredient}" class="link-secondary link-offset-2 link-underline-opacity-50 link-underline-opacity-100-hover">${ingredient}</a></h4>
                    <h5 class="d-flex justify-content-center align-items-center">${measureText}</h5>
                `;

                // Triggering API call for nutritionIX with redundancies


                listIngredientSpecs(nutritionIxURL, ingredient, appId5, appKey5, card, valid_meassurement);

                

                // Collate all contents for 'ingredients' div
                ingredientsContainer.appendChild(card);
            });

        });
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

                // Calculating 'conversion_rate' used in getting ounce equivalent values
                serving_amount = food.serving_weight_grams;
                conversion_rate = 28.35 / serving_amount;
                // console.log(conversion_rate)    



                

                if(valid_meassurement === true){
                    // Keeping track of sum values for each ingredient's spec
                    total_caloriesValue += Number(food.nf_calories) * conversion_rate;
                    total_fatValue += Number(food.nf_total_fat) * conversion_rate;
                    total_sodiumValue += Number(food.nf_sodium) * conversion_rate;
                    total_carbsValue += Number(food.nf_total_carbohydrate) * conversion_rate;
                    total_sugarsValue += Number(food.nf_sugars) * conversion_rate;
                    total_proteinValue += Number(food.nf_protein) * conversion_rate;

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

                <h4>Cocktail Nutritional Values:</h4>
                <ul class="list-group list-group-flush bg-transparent">
                    <li class="list-group-item bg-transparent">Calories: ${total_caloriesValue.toFixed(2)}</li>
                    <li class="list-group-item bg-transparent">Total Fat: ${total_fatValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Sodium: ${total_sodiumValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Total Carbohydrates: ${total_carbsValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Sugars: ${total_sugarsValue.toFixed(2)}g</li>
                    <li class="list-group-item bg-transparent">Protein: ${total_proteinValue.toFixed(2)}g</li>
                </ul>
                <br>
                <h6><em><strong>Per 1 oz of each ingredient measured</strong></em></h6>

            `;
        })
        .catch(error => {
            // Custom error response
            console.error("NutritionIX API Error:", error);
            console.log("Ingredient with error: " + ingredient);
        });
}

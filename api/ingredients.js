const cocktailIngredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='
const cocktailImageURL = 'https://www.thecocktaildb.com/images/ingredients/'
let searchString = document.URL.split('?cocktail=');
const cocktailId = searchString[1]


const nutritionIxURL = "https://trackapi.nutritionix.com/v2/natural/nutrients"
const appId1 = "877e0602"
const appKey1 = "9c96f922fd03f229782ebd80f468e923"
const appId2 = "b7b5026c"
const appKey2 = "41069590f031cbec6925acafe29900ad"
const appId3 = "cca115e6"
const appKey3 = "ca8dbac9a61a187ee8dedb2446908fd1"

let total_caloriesValue = 0,
    total_fatValue = 0,
    total_sodiumValue = 0,
    total_carbsValue = 0,
    total_sugarsValue = 0,
    total_proteinValue = 0;

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

fetch(`${cocktailIngredientURL}${cocktailId}`)
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
            card.innerHTML = `
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <h2 class="title d-flex justify-content-center align-items-center">${drink.strDrink}</h2>
                <p class="d-flex justify-content-center align-items-center">Total Nutrition List</p>
            `;
            resultsContainer.appendChild(card);

            const ingredientsArrTemp = Array.from({ length: 15 }, (_, i) => drink[`strIngredient${i + 1}`]);
            const ingredientsArr = ingredientsArrTemp.filter(ingredient => ingredient);
            console.log("Ingredients Array:", ingredientsArr);

            const instrP = document.getElementById('instrutions');
            instrP.innerHTML = drink.strInstructions


            const ingredientsContainer = document.getElementById('ingredients');
            ingredientsContainer.innerHTML = '';

            ingredientsArr.forEach(ingredient => {
                const card = document.createElement('div');
                card.classList.add('card', 'col-3');
                const measureText = ingredient === 'Salt'
                    ? 'Garnish'

                    : drink[`strMeasure${ingredientsArr.indexOf(ingredient) + 1}`] || '';

                card.innerHTML = `
                    <img src="${cocktailImageURL}${ingredient}-Medium.png" alt="${ingredient}">
                    <h4 class="title d-flex justify-content-center align-items-center">${ingredient}</h4>
                    <h5 class="d-flex justify-content-center align-items-center">${measureText}</h5>
                    <h6 class="d-flex justify-content-center align-items-center"><em>(1oz = 28.35g)</em></h6>
                `;
                
                listIngredientSpecs(nutritionIxURL, ingredient, appId3, appKey3, card);

                ingredientsContainer.appendChild(card);
            });

        });

        // console.log('total cal: ' + total_caloriesValue);
        // console.log('total fat: ' + total_fatValue);
        // console.log('total sod: ' + total_sodiumValue);
        // console.log('total carb: ' + total_carbsValue);
        // console.log('total sug: ' + total_sugarsValue);
        // console.log('total pro: ' + total_proteinValue);
    });



function listIngredientSpecs(url, ingredient, appId, appKey, card) {
    fetch(url, {
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

                total_caloriesValue += Number(food.nf_calories);
                total_fatValue += Number(food.nf_total_fat);
                total_sodiumValue += Number(food.nf_sodium);
                total_carbsValue += Number(food.nf_total_carbohydrate);
                total_sugarsValue += Number(food.nf_sugars);
                total_proteinValue += Number(food.nf_protein);


                calories_span.innerHTML = food.nf_calories + 'g';
                fat_span.innerHTML = food.nf_total_fat + 'g';
                sodium_span.innerHTML = food.nf_sodium + 'g';
                carbs_span.innerHTML = food.nf_total_carbohydrate + 'g';
                sugars_span.innerHTML = food.nf_sugars + 'g';
                protein_span.innerHTML = food.nf_protein + 'g';

                desc_li.innerHTML = "1oz is equal to:";
                calories_li.innerHTML = "Calories";
                fat_li.innerHTML = "Total Fat";
                sodium_li.innerHTML = "Sodium";
                carbs_li.innerHTML = "Total Carbohydrates";
                sugars_li.innerHTML = "Sugars";
                protein_li.innerHTML = "Protein";

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

                card.appendChild(specs_div);
            });
            // Display total values after fetching all ingredient data
            const totalContainer = document.getElementById('total-nutrition');
            totalContainer.innerHTML = `
                <h3>Total Nutrition Values</h3>
                <p>Calories: ${total_caloriesValue}g</p>
                <p>Total Fat: ${total_fatValue}g</p>
                <p>Sodium: ${total_sodiumValue}g</p>
                <p>Total Carbohydrates: ${total_carbsValue}g</p>
                <p>Sugars: ${total_sugarsValue}g</p>
                <p>Protein: ${total_proteinValue}g</p>
            `;
        })
        .catch(error => {
            console.error("Nutritionix API Error:", error);
            console.log("Ingredient: " + ingredient);
            // alert(`An error occurred while fetching data for ingredient: ${ingredient}`);
        });
}


function calc1ozEquivalent() {
    // fhwqeoifewfewq
}
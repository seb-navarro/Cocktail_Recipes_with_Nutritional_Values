const cocktailLookup = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
var searchString = document.URL.split('?cocktail=');
cocktailId = searchString[1]


// const nutrionIxURL = "https://trackapi.nutritionix.com/v2/natural/nutrients"
// const appId = "877e0602"
// const appKey = "9c96f922fd03f229782ebd80f468e923"
const cocktailIngredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='
const ingredientsRow = document.getElementById('ingredients');


function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

fetch(`${cocktailLookup}${cocktailId}`)
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
            card.classList.add('card', 'col-md-4');
            card.innerHTML = `
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <h2>${drink.strDrink}</h2>
                <p>${drink.strInstructions}</p>
            `;
            resultsContainer.appendChild(card);

            const ingredientsArrTemp = Array.from({ length: 15 }, (_, i) => drink[`strIngredient${i + 1}`]);
            const ingredientsArr = ingredientsArrTemp.filter(ingredient => ingredient);
            console.log("Ingredients Array:", ingredientsArr);

            ingredientsArr.forEach(ingredient => {
                createCards(cocktailIngredientURL, ingredient);
            });
        });
    })
    .catch(error => {
        console.error("Cocktail API Fetch Error:", error);
        alert('An error occurred while searching for the cocktail.');
    });

function createCards(url, ingredient) {
    fetch(`${cocktailIngredientURL}${cocktailLookup}&i=${ingredient}`)
        .then(resp => {
            if (!resp.ok) throw new Error(`API Error: ${resp.statusText}`);
            return resp.json();
        })
        .then(data => {
            const foods = data.foods || [];
            if (!foods.length) {
                console.warn(`No foods found for ingredient: ${ingredient}`);
                return;
            }

            foods.forEach(food => {
                const card = createNode('div');
                const cardBody = createNode('div');
                const img = createNode('img');
                const header = createNode('h2');
                const paragraph = createNode('p');

                img.setAttribute('class', 'card-img-top');
                img.setAttribute('src', food.image);
                header.textContent = food.strIngredient1;
                header.textContent = food.strMeasure1;
                paragraph.textContent = `Calories: ${food.nf_calories}`;
                append(cardBody, header);
                append(cardBody, paragraph);
                append(card, img);
                append(card, cardBody);

                ingredientsRow.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Nutritionix API Error:", error);
            alert(`An error occurred while fetching data for ingredient: ${ingredient}`);
        });
}

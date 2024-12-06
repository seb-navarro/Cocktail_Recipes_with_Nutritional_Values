const cocktailLookup = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
var searchString = document.URL.split('?cocktail=');
cocktailId = searchString[1]


const nutrionIxURL = "https://trackapi.nutritionix.com/v2/natural/nutrients"
const appId = "877e0602"
const appKey = "9c96f922fd03f229782ebd80f468e923"
const ingredientsRow = document.getElementById('ingredients');


function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}



fetch(`${cocktailLookup}${cocktailId}`)
    .then(response => response.json())
    .then(data => {
        const results = data.drinks || [];

        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';
        results.forEach(drink => {

            const card = document.createElement('div');
            card.classList.add('card');
            card.classList.add('col-md-4');
            card.innerHTML = `
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <h2>${drink.strDrink}</h2>
                <p>${drink.strInstructions}</p>
            `;
            resultsContainer.appendChild(card);
            ingredientsArrTemp = [drink.strIngredient1, drink.strIngredient2, drink.strIngredient3, drink.strIngredient4, drink.strIngredient5, drink.strIngredient6, drink.strIngredient7, drink.strIngredient8, drink.strIngredient9, drink.strIngredient10, drink.strIngredient11, drink.strIngredient12, drink.strIngredient13, drink.strIngredient14, drink.strIngredient15];
            ingredientsArr = []
            for (let i = 0; i < ingredientsArrTemp.length; i++) {
                currentIngredient = ingredientsArrTemp[i]
                if (currentIngredient == null) {
                    break
                } else {
                    ingredientsArr.push(currentIngredient)
                }
            }

            console.log(ingredientsArr)
            for (let i = 0; i < ingredientsArr.length; i++) {
                createCards(nutrionIxURL, ingredientsArr[i])
            }
        
        // resultsContainer.appendChild(card);

        });
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while searching for the cocktail.');
    });





function createCards(url, ingredient) {
    fetch(nutrionIxURL, {
        method: "POST",
        body: JSON.stringify({
            "query": ingredient
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "x-app-id": appId,
            "x-app-key": appKey
        }
    })
        .then((resp) => resp.json())
        .then(function (data) {
            let foods = data.foods;

            return foods.map(function (food) {

                let card = createNode('div'),
                    cardBody = createNode('div'),
                    img = createNode('img'),
                    header = createNode('h2'),
                    paragraph = createNode('p'),
                    aLink = createNode('a');

                
                img.setAttribute('class', 'card-img-top');
                img.src = food.photo.highres;
                
                header.setAttribute('class', 'card-title');
                header.innerHTML = `${food.food_name}`;
                
                paragraph.setAttribute('class', 'card-text');
                paragraph.innerHTML = `${food.serving_unit}`;

                cardBody.setAttribute('class', 'card-body');

                card.setAttribute('class', 'card col-md-4 align-items-center justify-content-center');
                card.setAttribute('style', 'width: 18rem;');
                
                
                append(cardBody, header);
                append(cardBody, paragraph);
                append(cardBody, aLink);

                append(card, img);
                append(card, cardBody);
                
                append(ingredientsRow, card);
            })
        })
        .catch(function (error) {
            console.log(error);
            console.error('Error:', error);
            alert('An error occurred while searching for the cocktail.');
        });
}



const cocktailIngredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='
const cocktailImageURL = 'https://www.thecocktaildb.com/images/ingredients/'
let searchString = document.URL.split('?cocktail=');
const cocktailId = searchString[1]

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

            const ingredientsContainer = document.getElementById('ingredients');
            ingredientsContainer.innerHTML = '';

            ingredientsArr.forEach(ingredient => {
                const card = document.createElement('div');
                card.classList.add('card', 'col-md-4');
                const measureText = ingredient === 'Salt' 
                    ? 'Garnish' 
                    : drink[`strMeasure${ingredientsArr.indexOf(ingredient) + 1}`] || '';
            
                card.innerHTML = `
                    <img src="${cocktailImageURL}${ingredient}-Medium.png" alt="${ingredient}">
                    <h3>${ingredient}</h3>
                    <h4>${measureText}</h4>
                `;
            
                ingredientsContainer.appendChild(card);
            });
            
            });
        });
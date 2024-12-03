const CocktailApiKey = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

        document.getElementById('searchButton').addEventListener('click', () => {
            const query = document.getElementById('search').value.trim();
            if (!query) {
                alert('Please enter a cocktail name.');
                return;
            }

            fetch(`${CocktailApiKey}${query}`)
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
                            <a href="ingredients.html?cocktail=${drink.idDrink}" class="btn btn-dark mb-1" target="_blank">More info</a>
                        `;
                        resultsContainer.appendChild(card);
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while searching for the cocktail.');
                });
        })
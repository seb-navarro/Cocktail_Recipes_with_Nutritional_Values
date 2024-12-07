const ingredientURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?i=';
const queryString = document.URL.split('?ingredient=');
const ingredient = queryString[1];

const ingredientName = decodeURIComponent(ingredient);

const resultsContainer = document.getElementById('results');

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
            const card = document.createElement('div');
            card.classList.add('card', 'col-md-4', 'text-white', 'mb-4', 'p-5', 'g-3');
            card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            card.innerHTML = `
                <img src="https://www.thecocktaildb.com/images/ingredients/${ingredient.strIngredient}-Medium.png" 
                     class="card-img-top" 
                     alt="${ingredient.strIngredient}" 
                     style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${ingredient.strIngredient}</h5>
                    <p class="card-text">${ingredient.strDescription || 'No description available.'}</p>
                    <p class="card-text"><strong>Type:</strong> ${ingredient.strType || 'Unknown'}</p>
                    <p class="card-text"><strong>Alcoholic:</strong> ${ingredient.strAlcohol ? 'Yes' : 'No'}</p>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching ingredient data:', error);
        resultsContainer.innerHTML = `<p>Error fetching ingredient details. Please try again later.</p>`;
    });

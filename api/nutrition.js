const NutritionApiKey = '';

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('search').value.trim();
    if (!query) {
        alert('Please enter a food item');
        return;
    }

    fetch(`${NutritionApiKey}${query}`)
        .then(response => response.json())
        .then(data => {
            const results = data.items || [];
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = '';
            results.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.classList.add('col-md-4');
                card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h2>${item.name}</h2>
                    <p>${item.nf_calories} calories</p>
                `;
                resultsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while searching for the cocktail.');
        });
});
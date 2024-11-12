# Recipe Explorer

This project demonstrates how to fetch and display recipes from an external API with search functionality.

```js
/*
The DOMContentLoaded event ensures that the script only runs after the document's structure 
(all elements in the DOM) is fully loaded and ready for JavaScript to interact with.
*/

document.addEventListener("DOMContentLoaded", async () => {
  // These elements will be used to display recipes and handle user input.
  const searchInput = document.getElementById("search-input");
  const recipeList = document.getElementById("recipe-list");

  // Step 1: Fetch meal data from the API
  let recipes = [];
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    const data = await response.json();
    console.log(data); // Log full response
    recipes = data.meals || []; // Safely return an empty array if data.meals is null

    displayRecipes(recipes); // Display all recipes initially
  } catch (err) {
    console.error("Error fetching recipes:", err);
    recipeList.innerHTML =
      "<p>Failed to load recipes. Please try again later.</p>";
    return; // Stop further execution if fetching fails
  }

  // Step 2: Set up search functionality
  // The "input" event triggers every time the user modifies the input field, providing real-time search results.
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredRecipes = recipes.filter(
      (recipe) =>
        recipe.strMeal.toLowerCase().includes(query) || // Match meal name
        recipe.strCategory.toLowerCase().includes(query) // Match meal category
    );
    displayRecipes(filteredRecipes);
  });

  // Helper function to display a list of recipes in the UI
  function displayRecipes(recipes) {
    recipeList.innerHTML = ""; // Clear previous results

    if (recipes.length === 0) {
      recipeList.innerHTML = "<p>No recipes found.</p>"; // Show message if no recipes match
      return;
    }

    // Create and append a card for each recipe
    recipes.forEach((recipe) => {
      const recipeCard = document.createElement("div");
      recipeCard.classList.add("recipe-card"); // Apply consistent styling
      recipeCard.innerHTML = `
            <h3>${recipe.strMeal}</h3>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="70">
            <p><strong>Category:</strong> ${recipe.strCategory}</p>
          `;
      recipeList.appendChild(recipeCard);
    });
  }
});
```

## Explanation

1. **DOMContentLoaded:**

- Ensures the script runs only after the DOM is fully loaded.

2. **Fetching Data:**

- Uses `fetch` to retrieve recipes from [TheMealDB API](https://publicapis.io/the-meal-db-api).
  Provides a fallback `([])` if the API returns `null`.

3. Search Functionality:

- Filters recipes by name or category in real time using the "input" event.

4. Dynamic Rendering:

- Creates and appends recipe cards to the DOM.

## How to Run

1. Include this script in your HTML file:

```js
<script src="script.js"></script>
```

2. Ensure your HTML includes:

```js
<input type="text" id="search-input" placeholder="Search recipes..." />
```

```js
<div id="recipe-list"></div>
```

3. Open the HTML file in a browser to see the Recipe Explorer in action.

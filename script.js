/*
The DOMContentLoaded event ensures that the script only runs after the document's structure 
(all elements in the DOM) is fully loaded and ready for JavaScript to interact with.
*/

document.addEventListener("DOMContentLoaded", async () => {
  // These elements will be used to display recipes and handle user input.
  const searchInput = document.getElementById("search-input");
  const recipeList = document.getElementById("recipe-list");

  // Step 1: Fetch product data from the API
  let recipes = [];
  try {
    recipes = await fetchRecipes(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    console.log(recipes[0]); // Inspect a sample recipe Object for reference

    displayRecipes(recipes); // Display all recipes initially
  } catch (err) {
    console.error("Error fetching recipes:", err);
    recipeList.innerHTML =
      "<p>Failed to load recipes. Please try again later.</p>";
    return; // // Stop further execution if fetching fails
  }

  // Step 2: Set up search functionality
  // The "input" event triggers every time the user modifies the input field, providing real-time search results.
  searchInput.addEventListener("input", () => {
    handleSearch(recipes, searchInput.value);
  });
});

// ==================== Helper methods/functions ====================

// Filter criteria: meal name and meal category
// DEFINITION: "query" - A technical term for userInputValue, representing the text entered by the user to search or filter specific results.
function handleSearch(recipes, query) {
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.strMeal.toLowerCase().includes(query.toLowerCase()) || // Match meal name
      recipe.strCategory.toLowerCase().includes(query.toLowerCase()) // Match meal category
  );
  displayRecipes(filteredRecipes);
}

// Fetch data from the given API URL
async function fetchRecipes(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    return data.meals || []; // in case API returns null => we are safely returning empty array to avoid later errors when calling methods as filter, forEach on the array
  } catch (err) {
    throw new Error("Failed to fetch recipes");
  }
}

// Display a list of recipes in the UI
function displayRecipes(recipes) {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = ""; // Clear previous results

  if (recipes.length === 0) {
    recipeList.innerHTML = "<p>No recipes found.</p>"; // Show message if no recipes match
    return;
  }

  // Create and append a card for each recipe
  recipes.forEach((recipe) => {
    const recipeCard = createRecipeCard(recipe);
    recipeList.appendChild(recipeCard);
  });
}

// Utility function for creating a Card for a meal
function createRecipeCard(recipe) {
  const recipeCard = document.createElement("div");

  // Dynamic CSS
  // All elements with the .recipe-card class will have the same styles applied, ensuring a uniform design.
  recipeCard.classList.add("recipe-card");

  // HTML
  // Populate the card with meal details (name, image, category) using template literals
  recipeCard.innerHTML = `
        <h3>${recipe.strMeal}</h3>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="70">
        <p><strong>Category:</strong> ${recipe.strCategory}</p>
      `;

  return recipeCard;
}

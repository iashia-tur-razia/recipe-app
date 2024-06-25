const apiKey = "7c638fd5742044e2be720ad22d432619"; // Replace with your Spoonacular API key
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const recipeContainer = document.getElementById("recipeContainer");

// Event listener for the search button
searchButton.addEventListener("click", () => {
  const query = searchInput.value;
  if (query) {
    getRecipes(query);
  }
});

// Function to get recipes from the API
async function getRecipes(query) {
  const cachedData = localStorage.getItem(query);
  if (cachedData) {
    displayRecipes(JSON.parse(cachedData));
  } else {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}&number=10`
      );
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(query, JSON.stringify(data.results));
        displayRecipes(data.results);
      } else {
        showError("Failed to fetch recipes from the API.");
      }
    } catch (error) {
      showError("An error occurred while fetching recipes.");
    }
  }
}

// Function to display recipes in the DOM
function displayRecipes(recipes) {
  recipeContainer.innerHTML = ""; // Clear previous results
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-card-content">
                <h3>${recipe.title}</h3>
                <button onclick="getRecipeDetails(${recipe.id})">View Recipe</button>
            </div>
        `;
    recipeContainer.appendChild(recipeCard);
  });
}

// Function to show an error message
function showError(message) {
  recipeContainer.innerHTML = `<p class="error">${message}</p>`;
}

// Function to fetch and display full recipe details
async function getRecipeDetails(id) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    );
    if (response.ok) {
      const recipe = await response.json();
      showRecipeDetails(recipe);
    } else {
      showError("Failed to fetch recipe details from the API.");
    }
  } catch (error) {
    showError("An error occurred while fetching recipe details.");
  }
}

// Function to display the detailed recipe information
function showRecipeDetails(recipe) {
  recipeContainer.innerHTML = ""; // Clear previous results
  const recipeDetail = document.createElement("div");
  recipeDetail.classList.add("recipe-detail");
  recipeDetail.innerHTML = `
      <div class="recipe-header">
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" alt="${recipe.title}">
</div>
<div class="recipe-body">
    <h3>Instructions</h3>
    <p>${recipe.instructions}</p>
    <div class="recipe-content">
    <h3>Ingredients</h3>
    <ul>${recipe.extendedIngredients
      .map((ing) => `<li>${ing.original}</li>`)
      .join("")}</ul>
    </div>
    <button onclick="goBack()">Go Back</button>
</div>
    `;
  recipeContainer.appendChild(recipeDetail);
}

// Function to go back to the search results
function goBack() {
  const query = searchInput.value;
  if (query) {
    displayRecipes(JSON.parse(localStorage.getItem(query)));
  }
}

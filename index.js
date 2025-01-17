const recipeInput = document.querySelector(".recipe-input");
const btn = document.querySelector(".btn");
const recipeContainer = document.querySelector(".recipe-container");
const closeBtn = document.querySelector(".recipe-close");
const content = document.querySelector(".content");

const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";
  
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    recipeContainer.innerHTML = "";

    if (!data.meals) {
      recipeContainer.innerHTML = `<h2>No recipes found for "${query}". Please try again.</h2>`;
      return;
    }

    data.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");

      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea || "Unknown"}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory || "Unknown"}</span> Category</p>
      `;

      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);

      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML = `<h2>Error fetching recipes. Please try again later.</h2>`;
    console.error("Error fetching recipes:", error);
  }
};

const fetchIngredients = (meal) => {
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      ingredients += `<li>${measure ? measure : ""} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredients;
};

const openRecipePopup = (meal) => {
  content.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div class="instructions">
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    </div>
  `;
  content.parentElement.style.display = "block";
};

closeBtn.addEventListener("click", () => {
  content.parentElement.style.display = "none";
});

btn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = recipeInput.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Type the meal in the search box.</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});

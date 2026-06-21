import { API_KEY, API_URL, RESULT_PER_PAGE } from './config';
import { getJson, localStorageInstance, sendJson } from './helpers';

export const state = {
  recipe: {},
  search: null,
  recipesList: [],
  page: 1,
  limit: RESULT_PER_PAGE,
  bookmarks: localStorageInstance.getBookmarks(),
};

export const loadRecipe = async function (id) {
  try {
    const url = `${API_URL}/${id}?key=${API_KEY}`;
    const { recipe } = await getJson(url);

    const recipeObject = {
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.image_url,
      publisher: recipe.publisher,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      servings: 4,
      sourceUrl: recipe.source_url,
      bookmarked: state.bookmarks.some(b => b.id === recipe.id),
      key: recipe.key,
    };

    state.recipe = recipeObject;
  } catch (err) {
    throw err;
  }
};

export const loadSearchedRecipesList = async search => {
  try {
    const url = `${API_URL}?search=${search}&key=${API_KEY}`;
    const { recipes } = await getJson(url);

    state.recipesList = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      imageUrl: recipe.image_url,
      publisher: recipe.publisher,
      key: recipe.key,
    }));

    state.search = search;
  } catch (err) {
    state.search = null;
    state.recipesList = [];
    throw err;
  }
};

export const getPaginatedRecipesList = () => {
  return state.recipesList.slice(
    (state.page - 1) * state.limit,
    state.page * state.limit,
  );
};

export const changePage = page => {
  state.page = page;
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity / state.recipe.servings) * newServings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  localStorageInstance.addBookmark(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
};

export const removeBookmark = function (recipe) {
  state.bookmarks = state.bookmarks.filter(rec => rec.id !== recipe.id);
  localStorageInstance.removeBookmark(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
};

export const uploadRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArray = ing[1].replaceAll(' ', '').split(',');
      if (ingArray.length !== 3)
        throw new Error('Enter with the correct format');
      const [quantity, unit, description] = ingArray;
      return { quantity: quantity ? +quantity : null, unit, description };
    });

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: +newRecipe.cookingTime,
    servings: +newRecipe.servings,
    ingredients,
  };

  const { recipe: recipeResponse } = await sendJson(
    `${API_URL}?key=${API_KEY}`,
    recipe,
  );

  const recipeObject = {
    id: recipeResponse.id,
    title: recipeResponse.title,
    imageUrl: recipeResponse.image_url,
    publisher: recipeResponse.publisher,
    cookingTime: recipeResponse.cooking_time,
    ingredients: recipeResponse.ingredients,
    servings: 4,
    sourceUrl: recipeResponse.source_url,
    bookmarked: true,
    key: recipeResponse.key,
  };

  state.recipe = recipeObject;
  addBookmark(recipeObject);

  return recipeObject;
};

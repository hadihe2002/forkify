import * as model from './model';

import 'core-js/stable';
import 'regenerator-runtime';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

async function controlRecipe() {
  try {
    const hash = window.location.hash;

    console.log(hash);

    const recipeId = hash.replace('#', '');
    if (!recipeId) return;

    recipeView.toLoadingState();

    await model.loadRecipe(recipeId);

    recipeView.render(model.state.recipe);

    searchView.update(model.getPaginatedRecipesList());

    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
}

async function controlSearchedRecipesList() {
  try {
    const searchQuery = searchView.getSearchQuery();
    await model.loadSearchedRecipesList(searchQuery);
    searchView.renderRecipesList(model.getPaginatedRecipesList());
    model.changePage(1);
    paginationView.render({
      page: model.state.page,
      limit: model.state.limit,
      recipesList: model.state.recipesList,
    });
  } catch (err) {
    console.log(err);
    searchView.renderError();
  }
}

async function controlPagination(page) {
  model.changePage(page);
  paginationView.render({
    page,
    limit: model.state.limit,
    recipesList: model.state.recipesList,
  });
  searchView.renderRecipesList(model.getPaginatedRecipesList());
}

const controlServings = function (servings) {
  if (servings <= 0) return;
  // update state
  model.updateServings(servings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  if (model.state.recipe.bookmarked) {
    model.removeBookmark(model.state.recipe);
  } else {
    model.addBookmark(model.state.recipe);
  }
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlUploadRecipe = async newRecipe => {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    bookmarksView.update(model.state.bookmarks);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    recipeView.update(model.state.recipe);
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

searchView.addShowRecipesListHandlers(controlSearchedRecipesList);
recipeView.addShowRecipeHandler(controlRecipe);
recipeView.addUpdateServings(controlServings);
paginationView.addPaginationHandlers(controlPagination);
recipeView.addHandlerAddBookMark(controlAddBookmark);
addRecipeView.addHandlerUpload(controlUploadRecipe);

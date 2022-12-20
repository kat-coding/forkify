
import 'core-js/stable';
import { async } from 'regenerator-runtime';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView';
import bookmarkView from './views/bookmarkView';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { UPLOAD_TIMEOUT_SEC } from './config.js';

/*controller.js will control the functionality of the page utilizing functions in other
js files. It will initialize functionality with the init function which calls the handler functions
for event handling.
*/

if(module.hot){
  module.hot.accept();
}

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// api url = https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    
    if (!id) return;
    recipeView.renderSpinner();
    // Update results view to mark search result
    resultsView.update(model.getSearchResultPage());
    
    
    // Loading recipe
   await model.loadRecipe(id);      
    
    // Render recipe
    recipeView.render(model.state.recipe);

    //update bookmarks
    // debugger;
    bookmarkView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
  
};
// controlRecipe();
// show new recipe with changes

const controlSearchResults = async function(){
  try{
    resultsView.renderSpinner();
    // get search query
      const query = searchView.getQuery();
      // guard clause 
      if(!query) return;
      // Load search result
      await model.loadSearchResults(query);
      // Render results
      // resultsView.render(model.state.search.results);
      resultsView.render(model.getSearchResultPage());
      // render pagination buttons
      paginationView.render(model.state.search);

  }catch(err){
    console.log(err);
  }
};

const controlPagination = function(goToPage){
  // console.log(goToPage);
        // render NEW results page
        resultsView.render(model.getSearchResultPage(goToPage));
        // render NEW pagination buttons
        paginationView.render(model.state.search);
}
const controlServings= function(newServings){
  //update recipe servings in state
  model.updateServings(newServings);

  //update view of recipe
  recipeView.update(model.state.recipe);
};
//controller function for bookmarks
const controlBookmark = function(){
  //add or remove bookmark
  if(!model.state.recipe.bookmark)  model.addBookmark(model.state.recipe);
  else  model.removeBookmark(model.state.recipe.id);
  //update recipeView
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarkView.render(model.state.bookmarks);
}
const controlBookmarksOnLoad = function(){
  bookmarkView.render(model.state.bookmarks);
}

const controlUploadRecipe = async function(newRecipe){
  try{
  // render spinner
  addRecipeView.renderSpinner();

  //Upload new recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

  //render recipe
  recipeView.render(model.state.recipe);

  //success message
  addRecipeView.renderMessage();

  //render bookmark view
  bookmarkView.render(model.state.bookmarks);

  //change ID in URL
  window.history.pushState(null, '', `#${model.state.recipe.id}`);

  //close form window
  setTimeout(function(){
     location.reload();
  }, UPLOAD_TIMEOUT_SEC * 1000);
  }catch(err){
    console.log('@', err);
    addRecipeView.renderError(err.message);
  }
}

const init = function(){
    bookmarkView.addHandlerRender(controlBookmarksOnLoad);
    recipeView.addHandlerRender(controlRecipe);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmarkHandler(controlBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlUploadRecipe);
    
}
init();
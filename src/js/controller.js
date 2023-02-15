// in parcel we can import many types of files

import 'core-js/stable' // polyfilling everything else
import 'regenerator-runtime/runtime' // polyfiling async await

import * as model from './model.js'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'
import addRecipeView from './views/addRecipeView.js'
import { MODAL_CLOSE_SEC } from './config.js'

// from parcel
// if (module.hot) {
//   module.hot.accept()
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1)

    // Guard closses. solving problem when we don't have any #545.. in url. 
    if (!id) return
    recipeView.renderSpinner()

    //  0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage())

    // 1) updating bookmarks
    bookmarksView.update(model.state.bookmarks)

    // 2) Loading recipe. It's async and it will return a promise
    await model.loadRecipe(id)

    // 3) Rendering recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    recipeView.renderError()
  }


}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner()

    // 1) Get query
    const query = searchView.getQuery()
    if (!query) return

    // 2)Load search
    await model.loadSearchResults(query)


    // 3) Render results
    // resultsView.render(model.state.search.results) // previous
    resultsView.render(model.getSearchResultsPage())

    // 4) Render initial Pagination buttons
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {
  // 1) Render New results
  resultsView.render(model.getSearchResultsPage(goToPage))

  // 2) Render New  Pagination buttons
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // Update the recipe servings  ( in state )
  model.updateServings(newServings)

  // Update the recipe view 
  // recipeView.render(model.state.recipe)

  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  // 1) Add/remove bookmark 
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)

  // 2) Update recipe view 
  recipeView.update(model.state.recipe)

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function (newRecipe) {
  console.log(newRecipe)
  try {
    // Show loading spinner 
    addRecipeView.renderSpinner()

    // Upload new recipe data
    await model.uploadRecipe(newRecipe)
    console.log(model.state.recipe)

    // Render recipe
    recipeView.render(model.state.recipe)

    // Display success message
    addRecipeView.renderMessage()

    // Render bookmark view 
    bookmarksView.render(model.state.bookmarks)

    // Change id in the url. Using history API. Will allow changing url without refreshing the page
    // 1 - state, 2- title, 3 - url
    window.history.pushState(null, '', `#${model.state.recipe.id}`)

    // Close form window 
    setTimeout(function () {
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error('👍', err)
    addRecipeView.renderError(err.message)
  }

}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServings)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()

// update method will update only text and attributes in the dom without rerendering entire view 
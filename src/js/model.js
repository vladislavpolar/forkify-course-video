// module in which we will be write entrire model

import { async } from 'regenerator-runtime'
import { API_URL, RES_PER_PAGE, KEY } from './config.js'
// import { getJSON, sendJSON } from './helpers.js'
import { AJAX } from './helpers.js'

// will containt a recipe, and in which contoller will grab and take the recipe out of there
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE
  },
  bookmarks: []
}

const createRecipeObject = function (data) {
  const { recipe } = data.data
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    img: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key })
  }
}

// it only will change state object
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`)
    state.recipe = createRecipeObject(data)

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true
    else state.recipe.bookmark = false

  } catch (err) {
    console.error(`${err} 💩💩💩💩`)
    throw err
  }
}

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        img: rec.image_url,
        ...(rec.key && { key: rec.key })
      }
    })
    state.search.page = 1
  } catch (err) {
    console.error(`${err} 💩💩💩💩`)
    throw err
  }
}

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page

  const start = (page - 1) * state.search.resultsPerPage // 0
  const end = page * state.search.resultsPerPage  //9

  return state.search.results.slice(start, end)
}

// reach to state and change quantity in each ingredient
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * newServings / state.recipe.servings

    // new quantity = old quantity * new servings / old servings // 2 * 8 / 4 = 4 
  })

  state.recipe.servings = newServings
}

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe)

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true

  persistBookmarks()
}

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id)
  state.bookmarks.splice(index, 1)

  // Mark current recipe as NOT bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false

  persistBookmarks()
}
const init = function () {
  const storage = localStorage.getItem('bookmarks')
  if (storage) state.bookmarks = JSON.parse(storage)
}

init()

const clearBookmarks = function () {
  localStorage.clear('bookmarks')
}
// clearBookmarks()



export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object
      .entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',')
        const ingArr = ing[1].split(',').map(el => el.trim())
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format!')

        const [quantity, unit, description] = ingArr
        return { quantity: quantity ? +quantity : null, unit, description }
      })

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    }

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe)
    state.recipe = createRecipeObject(data)

    addBookmark(state.recipe)
  } catch (err) {
    throw err
  }

}

// git status - cheking files
// git add -A  - adding all untracked files
// green means - something was added and M - is modified

// Commiting the files - we save modifications of all the files to the repository
// snapshot of code at the certain point of time
// git commit -m 'Initial commit'

// Merging changes together. New feature branch with master branch
// when we in branch in which we want to add new code we use
// git merge (name of branch which contains new code) new-feature
// Go to previous commit and delete changes
// git reset --hard HEAD

// git log - log of all the commits. key q - quit log, sometimes :q

// git reset --hard fdkfjslfjdsljl (id of commit which taken from log). Deleting previous commit


// But usually for better safety, we create Git branch
// git branch - list all the branches that we currently have. * - means the branch in which we are cur in

// Creating New Branch (copy of current master branch in which we can develop new code and
// adding new features, but without effecting the code that in the master branch )
// git branch "name"

// Switching to the new branch
// git checkout new-feature (name)

// // Merging changes together. New feature branch with master branch
// when we in branch in which we want to add new code we use
// git merge (name of branch which contains new code) new-feature
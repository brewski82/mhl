/*
  Copyright 2019 William R. Bruschi

  This file is part of My Honey's List.

  My Honey's List is free software: you can redistribute it and/or
  modify it under the terms of the GNU Affero General Public License
  as published by the Free Software Foundation, either version 3 of
  the License, or (at your option) any later version.

  My Honey's List is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with My Honey's List.  If not, see
  <https://www.gnu.org/licenses/>.

  Additional Terms:

  Per section 7.b and 7.c of the GNU Affero General Public License
  version 3, you must preserve the copyright notice and a link to
  https://github.com/brewski82/mhl in the footer of the user
  interface.

*/

/**
* Dev function to easily remove a path.
*/
function removePath(server, name) {
    server.router._registry.remove(name);
}

/*
 * Create all the url paths that our API supports.
 */
function createPaths(server, handlerContainer) {
    server.post({path: '/login', name: 'post-login'}, (req, res, next) => handlerContainer.createLogin(req, res, next));
    server.get({path: '/login/:uuid', name: 'get-login'}, (req, res, next) => handlerContainer.getOrCreateAccount(req, res, next));
    server.get({path: '/login-status', name: 'get-login-status'}, (req, res, next) => handlerContainer.getLoginStatus(req, res, next));
    server.post({path: '/account/emails', name: 'post-account-email'}, (req, res, next) => handlerContainer.createAccountEmail(req, res, next));
    server.del({path: '/account/emails', name: 'del-account-email'}, (req, res, next) => handlerContainer.deactivateEmail(req, res, next));
    server.get({path: '/account/emails', name: 'get-account-emails'}, (req, res, next) => handlerContainer.getEmails(req, res, next));
    server.get({path: '/account/emails/:accountEmailId/:uuid', name: 'verify-account-email'}, (req, res, next) => handlerContainer.verifyEmail(req, res, next));
    server.del({path: '/account/session', name: 'del-session'}, (req, res, next) => handlerContainer.deactivateSession(req, res, next));
    server.del({path: '/account', name: 'del-account'}, (req, res, next) => handlerContainer.deactivateAccount(req, res, next));
    server.get({path: '/categories/id/:item', name: 'get-category-id'}, (req, res, next) => handlerContainer.getCategoryId(req, res, next));
    server.get({path: '/categories/name/:categoryId', name: 'get-category-name'}, (req, res, next) => handlerContainer.getCategoryName(req, res, next));
    server.get({path: '/categories', name: 'get-categories'}, (req, res, next) => handlerContainer.getCategories(req, res, next));
    server.post({path: '/shopping-lists', name: 'post-shopping-list'}, (req, res, next) => handlerContainer.createShoppingList(req, res, next));
    server.get({path: '/shopping-lists', name: 'get-shopping-lists'}, (req, res, next) => handlerContainer.getShoppingLists(req, res, next));
    server.put({path: '/shopping-lists/:shoppingListId', name: 'put-shopping-list'}, (req, res, next) => handlerContainer.updateShoppingList(req, res, next));
    server.get({path: '/shopping-lists/:shoppingListId', name: 'get-shopping-list'}, (req, res, next) => handlerContainer.getShoppingList(req, res, next));
    server.post({path: '/shopping-lists/:shoppingListId/items', name: 'post-shopping-list-id-item'}, (req, res, next) => handlerContainer.dispatchShoppingListId(req, res, next));
    server.get({path: '/shopping-lists/:shoppingListId/items', name: 'get-shopping-list-id-items'}, (req, res, next) => handlerContainer.getShoppingListItems(req, res, next));
    server.put({path: '/shopping-lists/:shoppingListId/items/:itemId', name: 'put-shopping-list-id-item'}, (req, res, next) => handlerContainer.updateShoppingListItem(req, res, next));
    server.post({path: '/shopping-lists/:shoppingListId/recipes', name: 'post-shopping-list-id-recipe'}, (req, res, next) => handlerContainer.addRecipeToShoppingList(req, res, next));
    server.get({path: '/shopping-lists/:shoppingListId/recipes', name: 'get-shopping-list-id-recipes'}, (req, res, next) => handlerContainer.getShoppingListRecipes(req, res, next));
    server.del({path: '/recipes/:recipeId', name: 'del-recipe-id'}, (req, res, next) => handlerContainer.deleteRecipe(req, res, next));
    server.put({path: '/recipes/:recipeId', name: 'put-recipe-id'}, (req, res, next) => handlerContainer.updateRecipe(req, res, next));
    server.post({path: '/recipes', name: 'post-recipe'}, (req, res, next) => handlerContainer.createRecipe(req, res, next));
    server.get({path: '/recipes', name: 'get-recipes'}, (req, res, next) => handlerContainer.getRecipes(req, res, next));
    server.get({path: '/recipes/:recipeId', name: 'get-recipe-id'}, (req, res, next) => handlerContainer.getRecipe(req, res, next));
    server.get({path: '/recipes/:recipeId/items', name: 'get-recipe-id-items'}, (req, res, next) => handlerContainer.getRecipeItems(req, res, next));
    server.post({path: '/recipes/:recipeId/items', name: 'post-recipe-id-item'}, (req, res, next) => handlerContainer.createRecipeItem(req, res, next));
    server.get({path: '/recipes/:recipeId/items/:itemId', name: 'get-recipe-id-item'}, (req, res, next) => handlerContainer.getRecipeItem(req, res, next));
    server.del({path: '/recipes/:recipeId/items/:itemId', name: 'del-recipe-id-item'}, (req, res, next) => handlerContainer.deleteRecipeItem(req, res, next));
    server.put({path: '/recipes/:recipeId/items/:itemId', name: 'put-recipe-id-item'}, (req, res, next) => handlerContainer.updateRecipeItem(req, res, next));
}

module.exports = createPaths;

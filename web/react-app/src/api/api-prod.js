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


async function doFetch(resource, init = {}) {
    const response = await fetch(resource, Object.assign(
        {
            credentials: "same-origin",
            mode: "same-origin",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        }, init));
    return response.json();
}

function doFetchGet(resource, init = {}) {
    return doFetch(resource, Object.assign(
        {
            method: "GET"
        }, init));
}

function doFetchPost(resource, init = {}, body = {}) {
    return doFetch(resource, Object.assign(
        {
            method: "POST",
            body: JSON.stringify(body)
        }, init));
}

function doFetchPut(resource, init = {}, body = {}) {
    return doFetch(resource, Object.assign(
        {
            method: "PUT",
            body: JSON.stringify(body)
        }, init));
}

function doFetchDel(resource, init = {}) {
    return doFetch(resource, Object.assign(
        {
            method: "DELETE"
        }, init));
}

const apiProd = {
    createRecipe: () => {
        return doFetchPost('/api/recipes');
    },
    getRecipes: () => {
        return doFetchGet('/api/recipes');
    },
    updateRecipe: (recipeId, name, description, source) => {
        return doFetchPut(`/api/recipes/${recipeId}`, {}, {name, description, source});
    },
    getRecipeItems: (recipeId) => {
        return doFetchGet(`/api/recipes/${recipeId}/items`);
    },
    createRecipeItem: (recipeId, recipeItemValue) => {
        return doFetchPost(`/api/recipes/${recipeId}/items`, {}, {item: recipeItemValue});
    },
    deleteRecipeItem: (recipeId, recipeItemId) => {
        return doFetchDel(`/api/recipes/${recipeId}/items/${recipeItemId}`);
    },
    updateRecipeItem: (recipeId, recipeItemId, recipeItemValue) => {
        return doFetchPut(`/api/recipes/${recipeId}/items/${recipeItemId}`, {}, {item: recipeItemValue});
    },
    addRecipeToShoppingList: (recipeId, shoppingListId) => {
        return doFetchPost(`/api/shopping-lists/${shoppingListId}/recipes`, {}, {recipeId});
    },
    getShoppingListRecipes: (shoppingListId) => {
        return doFetchGet(`/api/shopping-lists/${shoppingListId}/recipes`);
    },
    getEmails: () => {
        return doFetchGet('/api/account/emails');
    },
    createAccountEmail: (email) => {
        return doFetchPost('/api/account/emails', {}, {email});
    },
    createShoppingListItem:  (shoppingListId, shoppingListItemValue) => {
        return doFetchPost(`/api/shopping-lists/${shoppingListId}/items`, {}, {item: shoppingListItemValue});
    },
    createShoppingList: (name) => {
        return doFetchPost('/api/shopping-lists', {}, {name});
    },
    updateShoppingListItem:  (shoppingListId, shoppingListItemId, shoppingListItemValue, categoryId, isChecked) => {
        return doFetchPut(`/api/shopping-lists/${shoppingListId}/items/${shoppingListItemId}`, {}, {item: shoppingListItemValue, categoryId, isChecked});
    },
    getLoginStatus:  () => {
        return doFetchGet('/api/login-status');
    },
    deactivateSession:  () => {
        return doFetchDel('/api/account/session');
    },
    deactivateAccount:  () => {
        return doFetchDel('/api/account');
    },
    getCategoryId: (shoppingListItemValue) => {
        return doFetchGet(`/api/categories/id/${shoppingListItemValue}`);
    },
    getCategories: () => {
        return doFetchGet('/api/categories');
    },
    getShoppingLists: () => {
        return doFetchGet('/api/shopping-lists');
    },
    getShoppingListItems: (shoppingListId) => {
        return doFetchGet(`/api/shopping-lists/${shoppingListId}/items`);
    },
    updateShoppingListName: (shoppingListId, name) => {
        return doFetchPut(`/api/shopping-lists/${shoppingListId}`, {}, {name});
    },
    createLogin: (email) => {
        return doFetchPost('/api/login', {}, {email});
    }
};

export default apiProd;

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

import { api } from '../api/api';

let setSpinner = function () {
    console.error('Please call setSpinnerFunction prior to using this function.');
};

export function setSpinnerFunction(fn) {
    setSpinner = fn;
}

export function showSavedSpinner() {
    setSpinner('saved');
}

export function showSavingSpinner() {
    setSpinner('saving');
}

export function showLoadingSpinner() {
    setSpinner('loading');
}

export function showErrorSpinner() {
    setSpinner('error');
}

export function hideSpinner() {
    setTimeout(function() {
        setSpinner('default');
    }, 2000);
}

export async function createRecipe() {
    try {
        showSavingSpinner();
        const {recipeId} = await api.createRecipe();
        showSavedSpinner();
        hideSpinner();
        return recipeId;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return 0;
    }
}

export async function loadRecipes() {
    try {
        showLoadingSpinner();
        const recipes = await api.getRecipes();
        hideSpinner();
        return recipes;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return [];
    }
}

export async function getRecipe(recipeId) {
    try {
        showLoadingSpinner();
        const recipe = await api.getRecipe(recipeId);
        hideSpinner();
        return recipe;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return {};
    }
}

export async function getRecipeItems(recipeId) {
    try {
        showLoadingSpinner();
        const recipeItems = await api.getRecipeItems(recipeId);
        hideSpinner();
        return recipeItems;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return {};
    }
}

export async function updateRecipe(recipeId, recipeName, recipeDescription, recipeSource) {
    try {
        showSavingSpinner();
        const {recipeUpdated} = await api.updateRecipe(recipeId, recipeName, recipeDescription, recipeSource);
        showSavedSpinner();
        hideSpinner();
        if (!recipeUpdated) {
            console.error(recipeUpdated);
            showErrorSpinner();
        }
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
}

export async function createRecipeItem(recipeId, recipeItemValue) {
    try {
        showSavingSpinner();
        const {recipeItemId} = await api.createRecipeItem(recipeId, recipeItemValue);
        showSavedSpinner();
        hideSpinner();
        return recipeItemId;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return 0;
    }
}

export async function deleteRecipeItem(recipeId, recipeItemId) {
    try {
        showSavingSpinner();
        const {itemDeleted} = await api.deleteRecipeItem(recipeId, recipeItemId);
        if (itemDeleted) {
            showSavedSpinner();
            hideSpinner();
        } else {
            showErrorSpinner();
        }
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
}

export async function updateRecipeItem(recipeId, recipeItemId, recipeItemValue) {
    try {
        showSavingSpinner();
        const {itemUpdated} = await api.updateRecipeItem(recipeId, recipeItemId, recipeItemValue);
        if (itemUpdated) {
            showSavedSpinner();
            hideSpinner();
        } else {
            showErrorSpinner();
        }
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
}

export async function addRecipeToShoppingList(recipeId, shoppingListId) {
    try {
        showSavingSpinner();
        const {copiedRecipeItems} = await api.addRecipeToShoppingList(recipeId, shoppingListId);
        if (copiedRecipeItems) {
            showSavedSpinner();
            hideSpinner();
        } else {
            showErrorSpinner();
        }
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
}

var propKey = 1; // Used by react arrays only - differs from "id" stored in backend.
export async function createShoppingListItem(shoppingListId, shoppingListItemValue, isLoggedIn, dispatch) {
    try {
        let currentPropKey = ++propKey;
        dispatch({
            type: 'add',
            shoppingListItem: {
                shoppingListItemValue,
                shoppingListId,
                propKey: currentPropKey
            }
        });
        if (isLoggedIn) {
            showSavingSpinner();
            const returnedItem = await api.createShoppingListItem(shoppingListId, shoppingListItemValue);
            showSavedSpinner();
            returnedItem.propKey = currentPropKey;
            dispatch({type: 'update id', shoppingListItem: {...returnedItem, shoppingListId}});
            hideSpinner();
            return;
        }
        showLoadingSpinner();
        const {categoryId} = await api.getCategoryId(shoppingListItemValue);
        const shoppingListItem = {
            shoppingListId,
            shoppingListItemValue,
            shoppingListItemChecked: false,
            categoryId,
            propKey: currentPropKey
        };
        dispatch({
            type: 'update',
            shoppingListItem
        });
        hideSpinner();
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
};

export async function updateShoppingListItem(shoppingListItem, isLoggedIn, dispatch) {
    try {
        dispatch({type: 'update', shoppingListItem});
        if (isLoggedIn) {
            showSavingSpinner();
            const result = await api.updateShoppingListItem(shoppingListItem.shoppingListId, shoppingListItem.shoppingListItemId, shoppingListItem.shoppingListItemValue, shoppingListItem.categoryId, shoppingListItem.shoppingListItemChecked);
            if (!result.itemUpdated) {
                showErrorSpinner();
            } else {
                showSavedSpinner();
                hideSpinner();
            }
        }
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
};

export function generateDefaultShoppingListName() {
    return "Shopping List for " + (new Date()).toDateString();
}

export async function createShoppingList(currentShoppingListItemsReducer, currentShoppingListIdSetter) {
    try {
        showSavingSpinner();
        const shoppingListName = generateDefaultShoppingListName();
        const {shoppingListId} = await api.createShoppingList(shoppingListName);
        currentShoppingListIdSetter(shoppingListId);
        currentShoppingListItemsReducer({type: "init", shoppingListId, shoppingListName, shoppingListItems: []});
        hideSpinner();
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
};

export async function loadCurrentShoppingListOrCreateNew() {
    try {
        const shoppingLists = await api.getShoppingLists();
        if (shoppingLists.length > 0) {
            return shoppingLists[0];
        } else {
            const shoppingListName = generateDefaultShoppingListName();
            const {shoppingListId} = await api.createShoppingList(shoppingListName);
            return {shoppingListId, shoppingListName, shoppingListItems: []};
        }
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return {};
    }
};

export async function getShoppingListItems(shoppingListId) {
    try {
        const shoppingListItems = await api.getShoppingListItems(shoppingListId);
        return shoppingListItems;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return [];
    }
};

export async function getShoppingList(shoppingListId) {
    try {
        const shoppingList = await api.getShoppingList(shoppingListId);
        return shoppingList;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return {};
    }
};

export async function getShoppingLists() {
    try {
        showLoadingSpinner();
        const shoppingLists = await api.getShoppingLists();
        hideSpinner();
        return shoppingLists;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return [];
    }
}

export async function getCategories() {
    try {
        const categories = await api.getCategories();
        return categories;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return [];
    }
};

export async function loadEmails() {
    try {
        showLoadingSpinner();
        const emails = await api.getEmails();
        console.log(emails);
        hideSpinner();
        return emails;
    } catch (err) {
        console.error(err);
        showErrorSpinner();
        return [];
    }
};

export async function createAccountEmail(email) {
    try {
        showSavingSpinner();
        const {emailAdded} = await api.createAccountEmail(email);
        if (emailAdded) {
            hideSpinner();
        } else {
            showErrorSpinner();
        }
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
};

export async function createLogin(email) {
    try {
        showLoadingSpinner();
        await api.createLogin(email);
        hideSpinner();
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
};

export async function doLogout() {
    try {
        showLoadingSpinner();
        await api.deactivateSession();
        hideSpinner();
        window.location.reload(true);
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
};

export async function deactivateAccount() {
    try {
        showLoadingSpinner();
        await api.deactivateAccount();
        hideSpinner();
        window.location.reload(true);
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
};

export async function updateShoppingListName(shoppingListId, shoppingListName) {
    try {
        const result = await api.updateShoppingListName(shoppingListId, shoppingListName);
        if (!result.shoppingListUpdated) {
            showErrorSpinner();
        } else {
            showSavedSpinner();
            hideSpinner();
        }
    } catch (err) {
        console.error(err);
        showErrorSpinner();
    }
};

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

export const LOAD_CATEGORIES = "LOAD_CATEGORIES";
export const CHANGE_IS_LOGGED_IN = "CHANGE_IS_LOGGED_IN";
export const CREATE_NEW_SHOPPING_LIST = "CREATE_NEW_SHOPPING_LIST";
export const LOAD_SHOPPING_LISTS = "LOAD_SHOPPING_LISTS";
export const CHANGE_CURRENT_SHOPPING_LIST_ID = "CHANGE_CURRENT_SHOPPING_LIST_ID";
export const DELETE_SELECTED_SHOPPING_LISTS = "DELETE_SELECTED_SHOPPING_LISTS"; // TODO
export const UPDATE_SHOPPING_LIST_NAME = "UPDATE_SHOPPING_LIST_NAME";
export const CREATE_SHOPPING_LIST_ITEM = "CREATE_SHOPPING_LIST_ITEM";
export const UPDATE_SHOPPING_LIST_ITEM = "UPDATE_SHOPPING_LIST_ITEM";
export const LOAD_SHOPPING_LIST_ITEMS = "LOAD_SHOPPING_LIST_ITEMS";
export const DELETE_SELECTED_SHOPPING_LIST_ITEMS = "DELETE_SELECTED_SHOPPING_LIST_ITEMS";
export const LOAD_CURRENT_SHOPPING_LIST_RECIPES = "LOAD_CURRENT_SHOPPING_LIST_RECIPES";
export const SHOW_SAVING_SPINNER = "SHOW_SAVING_SPINNER";
export const SHOW_SAVED_SPINNER = "SHOW_SAVED_SPINNER";
export const SHOW_ERROR_SPINNER = "SHOW_ERROR_SPINNER";
export const SHOW_LOADING_SPINNER = "SHOW_LOADING_SPINNER";
export const HIDE_SPINNER = "HIDE_SPINNER";
export const CREATE_RECIPE = "CREATE_RECIPE";
export const UPDATE_RECIPE = "UPDATE_RECIPE";
export const CREATE_RECIPE_ITEM = "CREATE_RECIPE_ITEM";
export const UPDATE_RECIPE_ITEM = "UPDATE_RECIPE_ITEM";
export const DELETE_RECIPE_ITEM = "DELETE_RECIPE_ITEM";
export const LOAD_RECIPES = "LOAD_RECIPES";
export const LOAD_RECIPE_ITEMS = "LOAD_RECIPE_ITEMS";
export const LOAD_EMAILS = "LOAD_EMAILS";
export const LOGOUT = "LOGOUT";

export function showSavedSpinner(dispatch, value) {
    dispatch({type: SHOW_SAVED_SPINNER});
    return value;
}

export function showSavingSpinner(dispatch, value) {
    dispatch({type: SHOW_SAVING_SPINNER});
    return value;
}

export function showLoadingSpinner(dispatch, value) {
    dispatch({type: SHOW_LOADING_SPINNER});
    return value;
}

export function showErrorSpinner(dispatch, value) {
    dispatch({type: SHOW_ERROR_SPINNER});
    return value;
}

export function hideSpinner(dispatch, value) {
    setTimeout(function() {
        dispatch({type: HIDE_SPINNER});
    }, 2000);
    return value;
}

// Action Creators

var propKey = 1; // Used by react arrays only - differs from "id" stored in backend.

export function createRecipe() {
    return async function(dispatch) {
        try {
            showSavingSpinner(dispatch);
            const {recipeId} = await api.createRecipe();
            dispatch({type: CREATE_RECIPE, recipeId});
            showSavedSpinner(dispatch);
            hideSpinner(dispatch);
            return recipeId;
        } catch (err) {
            console.log(err);
            showErrorSpinner(dispatch);
            return 0;
        }
    };
}

export function loadRecipes() {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            const recipes = await api.getRecipes();
            dispatch({type: LOAD_RECIPES, recipes});
            hideSpinner(dispatch);
        } catch (err) {
            console.log(err);
            showErrorSpinner(dispatch);
        }
    };
}

export function loadRecipeItems(recipeId) {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            let recipeItems = await api.getRecipeItems(recipeId);
            dispatch({type: LOAD_RECIPE_ITEMS, recipe: {recipeId, recipeItems}});
            hideSpinner(dispatch);
        } catch (err) {
            console.log(err);
            showErrorSpinner(dispatch);
        }
    };
}

export function updateRecipe(recipeId, recipeName, recipeDescription, recipeSource) {
    return async function(dispatch) {
        try {
            showSavingSpinner(dispatch);
            dispatch({type: UPDATE_RECIPE, recipeId, recipeName, recipeDescription, recipeSource});
            const {recipeUpdated} = await api.updateRecipe(recipeId, recipeName, recipeDescription, recipeSource);
            showSavedSpinner(dispatch);
            hideSpinner(dispatch);
            if (!recipeUpdated) {
                console.log(recipeUpdated);
                showErrorSpinner(dispatch);
            }
        } catch (err) {
            console.log(err);
            showErrorSpinner(dispatch);
        }
    };
}

export function createRecipeItem(recipeId, recipeItemValue) {
    return async function(dispatch) {
        try {
            showSavingSpinner(dispatch);
            const {recipeItemId} = await api.createRecipeItem(recipeId, recipeItemValue);
            dispatch({type: CREATE_RECIPE_ITEM, recipeId, recipeItemValue, recipeItemId});
            showSavedSpinner(dispatch);
            hideSpinner(dispatch);
        } catch (err) {
            console.log(err);
            showErrorSpinner(dispatch);
        }
    };
}

export function deleteRecipeItem(recipeId, recipeItemId) {
    return async function(dispatch) {
        try {
            showSavingSpinner(dispatch);
            dispatch({type: DELETE_RECIPE_ITEM, recipeId, recipeItemId});
            const {itemDeleted} = await api.deleteRecipeItem(recipeId, recipeItemId);
            if (itemDeleted) {
                showSavedSpinner(dispatch);
                hideSpinner(dispatch);
            } else {
                showErrorSpinner(dispatch);
            }
        } catch (err) {
            console.error(err);
            showErrorSpinner(dispatch);
        }
    };
}

export function updateRecipeItem(recipeId, recipeItemId, recipeItemValue) {
    return async function(dispatch) {
        try {
            showSavingSpinner(dispatch);
            dispatch({type: UPDATE_RECIPE_ITEM, recipeId, recipeItemId, recipeItemValue});
            const {itemUpdated} = await api.updateRecipeItem(recipeId, recipeItemId, recipeItemValue);
            if (itemUpdated) {
                showSavedSpinner(dispatch);
                hideSpinner(dispatch);
            } else {
                showErrorSpinner(dispatch);
            }
        } catch (err) {
            console.error(err);
            showErrorSpinner(dispatch);
        }
    };
}

export function addRecipeToShoppingList(recipeId, shoppingListId) {
    return async function(dispatch) {
        try {
            showSavingSpinner(dispatch);
            const {copiedRecipeItems} = await api.addRecipeToShoppingList(recipeId, shoppingListId);
            if (copiedRecipeItems) {
                await loadShoppingListItems(shoppingListId)(dispatch);
                await loadCurrentShoppingListRecipes(shoppingListId)(dispatch);
            } else {
                showErrorSpinner(dispatch);
            }
        } catch (err) {
            console.error(err);
            showErrorSpinner(dispatch);
        }
    };
}

export function loadCurrentShoppingListRecipes(shoppingListId) {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            const recipes = await api.getShoppingListRecipes(shoppingListId);
            dispatch({type: LOAD_CURRENT_SHOPPING_LIST_RECIPES, recipes});
            hideSpinner(dispatch);
        } catch (err) {
            console.error(err);
            showErrorSpinner(dispatch);
        }
    };
}

export function createShoppingListItem(shoppingListId, shoppingListItemValue, isLoggedIn) {
    return async function(dispatch) {
        try {
            let currentPropKey = ++propKey;
            dispatch({
                type: CREATE_SHOPPING_LIST_ITEM,
                shoppingListItemValue,
                shoppingListId,
                propKey: currentPropKey
            });
            if (isLoggedIn) {
                showSavingSpinner(dispatch);
                const returnedItem = await api.createShoppingListItem(shoppingListId, shoppingListItemValue);
                showSavedSpinner(dispatch);
                returnedItem.propKey = currentPropKey;
                dispatch({type: UPDATE_SHOPPING_LIST_ITEM, item: {...returnedItem, shoppingListId}});
                hideSpinner(dispatch);
                return;
            }
            showLoadingSpinner(dispatch);
            const {categoryId} = await api.getCategoryId(shoppingListItemValue);
            const item = {
                shoppingListId,
                shoppingListItemValue,
                shoppingListItemChecked: false,
                categoryId,
                propKey: currentPropKey
            };
            dispatch({
                type: UPDATE_SHOPPING_LIST_ITEM,
                item
            });
            hideSpinner(dispatch);
        } catch (err) {
            console.error(err);
            showErrorSpinner(dispatch);
        }
    };
};

export function updateShoppingListItem(item, isLoggedIn) {
    return async (dispatch) => {
        try {
            dispatch({type: UPDATE_SHOPPING_LIST_ITEM, item});
            if (isLoggedIn) {
                showSavingSpinner(dispatch);
                const result = await api.updateShoppingListItem(item.shoppingListId, item.shoppingListItemId, item.shoppingListItemValue, item.categoryId, item.shoppingListItemChecked);
                if (!result.itemUpdated) {
                    showErrorSpinner(dispatch);
                } else {
                    showSavedSpinner(dispatch);
                    hideSpinner(dispatch);
                }
            }
        } catch (err) {
            showErrorSpinner(dispatch);
        }
    };
};

export function loadShoppingListItems(shoppingListId) {
    return async (dispatch) => {
        try {
            showLoadingSpinner(dispatch);
            const items = await api.getShoppingListItems(shoppingListId);
            dispatch({type: LOAD_SHOPPING_LIST_ITEMS, items: items.map(item => ({...item, propKey: ++propKey})), shoppingListId});
            hideSpinner(dispatch);
        } catch (err) {
            showErrorSpinner(dispatch);
        }
    };
};

export function generateDefaultShoppingListName() {
    return "Shopping List for " + (new Date()).toDateString();
}

export function createShoppingList() {
    return async function(dispatch) {
        try {
            showSavingSpinner(dispatch);
            const shoppingListName = generateDefaultShoppingListName();
            const {shoppingListId} = await api.createShoppingList(shoppingListName);
            dispatch({type: CREATE_NEW_SHOPPING_LIST, shoppingListId, shoppingListName});
            await loadCurrentShoppingListRecipes(shoppingListId)(dispatch);
            hideSpinner(dispatch);
        } catch (err) {
            showErrorSpinner(dispatch);
        }
    };
};

export function loadShoppingLists(shouldUpdateCurrent) {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            const shoppingLists = await api.getShoppingLists();
            dispatch({type: LOAD_SHOPPING_LISTS, shoppingLists: shoppingLists.map(({shoppingListId, shoppingListName}) => ({shoppingListId, shoppingListName}))});
            if (shouldUpdateCurrent) {
                if (shoppingLists.length > 0) {
                    const shoppingListId = shoppingLists[0].shoppingListId;
                    await changeCurrentShoppingListId(shoppingListId)(dispatch);
                } else {
                    createShoppingList()(dispatch);
                }
            }
            hideSpinner(dispatch);
        } catch (err) {
            showErrorSpinner(dispatch);
        }
    };
};

export function loadCategories() {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            const categories = await api.getCategories();
            dispatch({type: LOAD_CATEGORIES, categories});
            hideSpinner(dispatch);
        } catch (err) {
            showErrorSpinner(dispatch);
        }
    };
};

export function loadEmails() {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            const emails = await api.getEmails();
            console.log(emails);
            dispatch({type: LOAD_EMAILS, emails});
            hideSpinner(dispatch);
        } catch (err) {
            showErrorSpinner(dispatch);
        }
    };
};

export function createAccountEmail(email) {
    return async function(dispatch) {
        try {
            showSavingSpinner(dispatch);
            const {emailAdded} = await api.createAccountEmail(email);
            if (emailAdded) {
                hideSpinner(dispatch);
            } else {
                showErrorSpinner(dispatch);
            }

        } catch (err) {
            showErrorSpinner(dispatch);
        }
    };
};

export function createLogin(email) {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            await api.createLogin(email);
            hideSpinner(dispatch);
        } catch (err) {
            console.log(err);
            showErrorSpinner(dispatch);
        }
    };
};

export function doLogin() {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            const {isLoggedIn} = await api.getLoginStatus();
            dispatch({type: CHANGE_IS_LOGGED_IN, isLoggedIn});
            hideSpinner(dispatch);
            if (isLoggedIn) {
                loadShoppingLists(true)(dispatch);
            }
        } catch (err) {
            console.log(err);
            showErrorSpinner(dispatch);
        }
    };
};

export function doLogout() {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            await api.deactivateSession();
            hideSpinner(dispatch);
            window.location.reload(true);
        } catch (err) {
            console.log(err);
            showErrorSpinner(dispatch);
        }
    };
};

export function deactivateAccount() {
    return async function(dispatch) {
        try {
            showLoadingSpinner(dispatch);
            await api.deactivateAccount();
            hideSpinner(dispatch);
            window.location.reload(true);
        } catch (err) {
            console.log(err);
            showErrorSpinner(dispatch);
        }
    };
};


export const deleteShoppingListSelectedItems = (shoppingListId) => ({
    type: DELETE_SELECTED_SHOPPING_LIST_ITEMS,
    shoppingListId
});

export function changeCurrentShoppingListId(shoppingListId) {
    return async (dispatch) => {
        try {
            dispatch({type: CHANGE_CURRENT_SHOPPING_LIST_ID, shoppingListId});
            await loadCurrentShoppingListRecipes(shoppingListId)(dispatch);
            await loadShoppingListItems(shoppingListId)(dispatch);
        } catch (err) {
            showErrorSpinner(dispatch);
        }
    };

};

export function updateShoppingListName(shoppingListId, shoppingListName, isLoggedIn) {
    return async (dispatch) => {
        try {
            dispatch({type: UPDATE_SHOPPING_LIST_NAME,
                      shoppingListId,
                      shoppingListName});
            if (isLoggedIn) {
                dispatch({type: 'SHOW_SAVING_SPINNER'});
                const result = await api.updateShoppingListName(shoppingListId, shoppingListName);
                if (!result.shoppingListUpdated) {
                    showErrorSpinner(dispatch);
                } else {
                    showSavedSpinner(dispatch);
                    hideSpinner(dispatch);
                }
            }
        } catch (err) {
            showErrorSpinner(dispatch);
        }
    };
};

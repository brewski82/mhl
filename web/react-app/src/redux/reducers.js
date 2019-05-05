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

import { combineReducers } from 'redux';
import * as actions from './actions';

function shoppingListItems(state = [], action) {
    switch (action.type) {
    case actions.CREATE_SHOPPING_LIST_ITEM:
        let shoppingList = state.find(({shoppingListId}) => shoppingListId === action.shoppingListId);
        if (!shoppingList) {
            return [...state, {
                shoppingListId: action.shoppingListId,
                shoppingListItems: [{propKey: action.propKey, shoppingListItemValue: action.shoppingListItemValue, shoppingListItemChecked: false, categoryId: null, shoppingListId: action.shoppingListId}]
            }];
        }
        return state.map((shoppingList) => {
            if (shoppingList.shoppingListId === action.shoppingListId) {
                let { shoppingListItems } = shoppingList;
                return {
                    shoppingListId: action.shoppingListId,
                    shoppingListItems: [...shoppingListItems, {propKey: action.propKey, shoppingListItemValue: action.shoppingListItemValue, shoppingListItemChecked: false, categoryId: null, shoppingListId: action.shoppingListId}]
                };
            } else {
                return shoppingList;
            }
        });
    case actions.UPDATE_SHOPPING_LIST_ITEM:
        return state.map((shoppingList) => {
            if (shoppingList.shoppingListId === action.item.shoppingListId) {
                let { shoppingListItems } = shoppingList;
                return {
                    shoppingListId: action.item.shoppingListId,
                    shoppingListItems: shoppingListItems.map((item) => {
                        if (item.propKey === action.item.propKey) {
                            return Object.assign({}, item, {
                                shoppingListId: action.item.shoppingListId,
                                shoppingListItemId: action.item.shoppingListItemId,
                                shoppingListItemValue: action.item.shoppingListItemValue,
                                shoppingListItemChecked: action.item.shoppingListItemChecked,
                                categoryId: action.item.categoryId.toString()
                            });
                        }
                        return item;
                    })
                };
            } else {
                return shoppingList;
            }
        });
    case actions.DELETE_SELECTED_SHOPPING_LIST_ITEMS:
        return state.map((shoppingList) => {
            if (shoppingList.shoppingListId === action.shoppingListId) {
                let { shoppingListItems } = shoppingList;
                return {
                    shoppingListId: action.shoppingListId,
                    shoppingListItems: shoppingListItems.filter(item => !item.shoppingListItemChecked)
                };
            } else {
                return shoppingList;
            }
        });
    case actions.CREATE_NEW_SHOPPING_LIST:
        return [...state, {shoppingListId: action.shoppingListId, shoppingListItems: []}];
    case actions.LOAD_SHOPPING_LIST_ITEMS:
        shoppingList = state.find(({shoppingListId}) => shoppingListId === action.shoppingListId);
        if (!shoppingList) {
            return [...state, {
                shoppingListId: action.shoppingListId,
                shoppingListItems: action.items
            }];
        }
        return state.map((shoppingList) => {
            if (shoppingList.shoppingListId === action.shoppingListId) {
                let shoppingListItems = action.items;
                return {
                    shoppingListId: action.shoppingListId,
                    shoppingListItems
                };
            } else {
                return shoppingList;
            }
        });
    default:
        return state;
    }
};

function shoppingLists(state = [], action) {
    switch (action.type) {
    case actions.UPDATE_SHOPPING_LIST_NAME:
        const {shoppingListId, shoppingListName} = action;
        if (state.some((item) => item.shoppingListId === shoppingListId)) {
            return state.map((item) => {
                if (item.shoppingListId === shoppingListId) {
                    return {shoppingListId, shoppingListName};
                }
                return item;
            });
        }
        return [...state, {shoppingListId, shoppingListName}];
    case actions.LOAD_SHOPPING_LISTS:
        return [...action.shoppingLists];
    case actions.CREATE_NEW_SHOPPING_LIST:
        return [...state, {shoppingListId: action.shoppingListId, shoppingListName: action.shoppingListName}];
    default:
        return state;
    }
}

function currentShoppingListId(state = 0, action) {
    switch (action.type) {
    case actions.CHANGE_CURRENT_SHOPPING_LIST_ID:
        return action.shoppingListId;
    case actions.CREATE_NEW_SHOPPING_LIST:
        return action.shoppingListId;
    default:
        return state;
    }
}

function currentShoppingListRecipes(state = [], action) {
    switch(action.type) {
    case actions.LOAD_CURRENT_SHOPPING_LIST_RECIPES:
        return action.recipes;
    default:
        return state;
    }
}

function shoppingListItemToHighlight(state = "", action) {
    switch (action.type) {
    case actions.UPDATE_SHOPPING_LIST_ITEM:
        return action.item.propKey;
    case actions.CREATE_SHOPPING_LIST_ITEM:
        return action.propKey;
    default:
        return state;
    }
};

function spinnerState(state = "hide", action) {
    switch (action.type) {
    case actions.SHOW_SAVING_SPINNER:
        return "saving";
    case actions.SHOW_SAVED_SPINNER:
        return "saved";
    case actions.SHOW_ERROR_SPINNER:
        return "error";
    case actions.SHOW_LOADING_SPINNER:
        return "loading";
    case actions.HIDE_SPINNER:
        return "hide";
    default:
        return state;
    }
};

function isLoggedIn(state = false, action) {
    switch (action.type) {
    case actions.CHANGE_IS_LOGGED_IN:
        return action.isLoggedIn;
    default:
        return state;
    }
}

function categories(state = [], action) {
    switch (action.type) {
    case actions.LOAD_CATEGORIES:
        return action.categories;
    default:
        return state;
    }
}

function emails(state = [], action) {
    switch (action.type) {
    case actions.LOAD_EMAILS:
        return action.emails;
    default:
        return state;
    }
}

function recipes(state = [], action) {
    switch(action.type) {
    case actions.CREATE_RECIPE:
        return [...state, {recipeId: action.recipeId, recipeName: "New Recipe", recipeDescription: null, recipeSource: null}];
    case actions.LOAD_RECIPES:
        return action.recipes;
    case actions.UPDATE_RECIPE:
        return state.map(recipe => {
            if (recipe.recipeId === action.recipeId) {
                return {
                    recipeId: action.recipeId,
                    recipeName: action.recipeName,
                    recipeDescription: action.recipeDescription,
                    recipeSource: action.recipeSource
                };
            } else {
                return recipe;
            }
        });
    default:
        return state;
    }
}

function recipeItems(state = [], action) {
    switch(action.type) {
    case actions.CREATE_RECIPE: {
        return [...state, {recipeId: action.recipeId, recipeItems: []}];
    }
    case actions.LOAD_RECIPE_ITEMS:
        let recipe = state.find(({recipeId}) => recipeId === action.recipeId);
        if (!recipe) {
            return [...state, action.recipe];
        }
        return state.map(recipe => {
            if (recipe.recipeId === action.recipe.recipeId) {
                return action.recipe;
            }
            return recipe;
        });
    case actions.CREATE_RECIPE_ITEM:
        return state.map((recipe) => {
            const {recipeId, recipeItems} = recipe;
            if (recipeId === action.recipeId) {
                return {
                    recipeId,
                    recipeItems: [...recipeItems, {recipeItemId: action.recipeItemId, recipeItemValue: action.recipeItemValue}]
                };
            } else {
                return recipe;
            }
        });
    case actions.UPDATE_RECIPE_ITEM:
        return state.map(recipe => {
            const {recipeId, recipeItems} = recipe;
            if (recipeId === action.recipeId) {
                return {
                    recipeId,
                    recipeItems: recipeItems.map(recipeItem => {
                        const {recipeItemId} = recipeItem;
                        if (recipeItemId === action.recipeItemId) {
                            return {
                                recipeItemId,
                                recipeItemValue: action.recipeItemValue
                            };
                        } else {
                            return recipeItem;
                        }
                    })
                };
            } else {
                return recipe;
            }
        });
    case actions.DELETE_RECIPE_ITEM:
        return state.map(recipe => {
            const {recipeId, recipeItems} = recipe;
            if (recipeId === action.recipeId) {
                return {
                    recipeId,
                    recipeItems: recipeItems.filter(({recipeItemId}) => recipeItemId !== action.recipeItemId)
                };
            } else {
                return recipe;
            }
        });
    default:
        return state;
    }
}

const myHoneysListApp = combineReducers({shoppingListItems, shoppingListItemToHighlight, spinnerState, isLoggedIn, categories, shoppingLists, currentShoppingListId, recipes, recipeItems, currentShoppingListRecipes, emails});

export default myHoneysListApp;

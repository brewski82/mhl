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

let id = 1;
const apiDev = {
    createRecipe: () => {
        console.log("Creating recipe...");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({recipeId: ++id});
            }, 1500);
        });
    },
    updateRecipe: (recipeId, recipeName, recipeDescription, recipeSource) => {
        console.log("Updating recipe...");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({recipeUpdated: true});
            }, 1500);
        });
    },
    getRecipes: () => {
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve([]);
            }, 1500);
        });
    },
    createRecipeItem: (recipeId, recipeItemValue) => {
        console.log("Create recipe item...");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({recipeItemId: ++id});
            }, 1500);
        });
    },
    deleteRecipeItem: (recipeId, recipeItemId) => {
        console.log("Delete recipe item...");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({itemDeleted: true});
            }, 1500);
        });
    },
    updateRecipeItem: (recipeId, recipeItemId, recipeItemValue) => {
        console.log("Update recipe item...");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({itemUpdated: true});
            }, 1500);
        });
    },
    addRecipeToShoppingList: (recipeId, shoppingListId) => {
        console.log("Adding recipe to shopping list...");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({copiedRecipeItems: true});
            }, 1500);
        });
    },
    getShoppingListRecipes: (shoppingListId) => {
        console.log("Getting recipes for shopping list");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                if (shoppingListId === 1) {
                    resolve([{recipeId: 1, recipeName: "Sweet potatoe soup"}]);
                } else {
                    resolve([]);
                }
            }, 1500);
        });
    },
    getEmails: () => {
        console.log("Getting email addresses");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve([{email: "one@example.com"}, {email: "two@example.com"}]);
            }, 1500);
        });
    },
    createAccountEmail: (email) => {
        console.log("Creating email");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({emailAdded: true});
            }, 1500);
        });
    },
    createShoppingListItem:  (shoppingListId, shoppingListItemValue) => {
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                let result = {};
                result.shoppingListId = shoppingListId;
                result.shoppingListItemId = id++;
                result.categoryId = Math.floor(Math.random() * 20);
                result.shoppingListItemValue = shoppingListItemValue;
                result.shoppingListItemChecked = false;
                resolve(result);
            }, 1500);
        });
    },
    createShoppingList: () => {
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({shoppingListId: id++});
            }, 1500);
        });
    },
    updateShoppingListItem:  (shoppingListId, shoppingListItemId, shoppingListItemValue, categoryId, isChecked) => {
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({itemUpdated: true});
            }, 1500);
        });
    },
    getLoginStatus:  () => {
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({isLoggedIn: false});
            }, 1500);
        });
    },
    deactivateSession:  () => {
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({isLoggedIn: false});
            }, 1500);
        });
    },
    deactivateAccount:  () => {
        console.log("Deleting account!!!");
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({deactivated: true});
            }, 1500);
        });
    },
    getCategoryId: (shoppingListItemValue) => {
        console.log('Lookup cateogry id for shopping list item ' + shoppingListItemValue);
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({categoryId: Math.floor(Math.random() * 20)});
            }, 1500);
        });
    },
    getCategories: async () => {
        console.log('Loading categories...');
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve( [
                    {categoryId: 21, categoryName: 'Produce'},
                    {categoryId: 1, categoryName: 'Dairy'},
                    {categoryId: 2, categoryName: 'Breakfast/Cereals'},
                    {categoryId: 3, categoryName: 'Frozen Foods'},
                    {categoryId: 4, categoryName: 'Cleaning/Laundry'},
                    {categoryId: 5, categoryName: 'Snack Foods'},
                    {categoryId: 6, categoryName: 'Beverages'},
                    {categoryId: 7, categoryName: 'Bread/Bakery'},
                    {categoryId: 8, categoryName: 'Deli'},
                    {categoryId: 9, categoryName: 'Seafood'},
                    {categoryId: 10, categoryName: 'Meat/Poultry'},
                    {categoryId: 11, categoryName: 'Condiments'},
                    {categoryId: 12, categoryName: 'Baking/Spices'},
                    {categoryId: 13, categoryName: 'Canned/Jarred'},
                    {categoryId: 14, categoryName: 'Pasta/Rice'},
                    {categoryId: 15, categoryName: 'Personal Care'},
                    {categoryId: 16, categoryName: 'Pets'},
                    {categoryId: 17, categoryName: 'Baby'},
                    {categoryId: 18, categoryName: 'Pharmacy'},
                    {categoryId: 19, categoryName: 'Other'},
                    {categoryId: 20, categoryName: 'International'}
                ]);
            }, 3500);
        });
    },
    getShoppingLists: async () => {
        console.log('Fetching shopping lists...');
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve( [
                    {shoppingListId: 1, shoppingListName: "sl name 1"},
                    {shoppingListId: 10, shoppingListName: "sl name 2"},
                    {shoppingListId: 15, shoppingListName: "sl name 3"}
                ]);
            }, 2500);
        });
    },
    getShoppingListItems: async (shoppingListId) => {
        console.log('Fetching shopping items...');
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve( [
                    {shoppingListId, shoppingListItemId: 1, categoryId: 1, shoppingListItemValue: "milk", shoppingListItemChecked: false},
                    {shoppingListId, shoppingListItemId: 2, categoryId: 2, shoppingListItemValue: "cheese", shoppingListItemChecked: false},
                    {shoppingListId, shoppingListItemId: 3, categoryId: 3, shoppingListItemValue: "tuna", shoppingListItemChecked: false}
                ]);
            }, 2500);
        });
    },
    updateShoppingListName: async () => {
        console.log('updateShoppingListName...');
        return new Promise((resolve, reject) => {
            console.log("Sleeping for fake api call...");
            setTimeout(function(){
                resolve({shoppingListUpdated: true});
            }, 2500);
        });
    }
};

export default apiDev;

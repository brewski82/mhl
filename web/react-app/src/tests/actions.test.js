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

import * as actions from '../api/actions';;
import fetchMock from 'fetch-mock';
import { sleep } from '../Utils';

describe('spinners', () => {
    const fn = jest.fn();
    actions.setSpinnerFunction(fn);
    test('showSavedSpinner', () => {
        actions.showSavedSpinner();
        expect(fn).toHaveBeenCalledWith('saved');
    });
    test('showSavingSpinner', () => {
        actions.showSavingSpinner();
        expect(fn).toHaveBeenCalledWith('saving');
    });
    test('showLoadingSpinner', () => {
        actions.showLoadingSpinner();
        expect(fn).toHaveBeenCalledWith('loading');
    });
    test('showErrorSpinner', () => {
        actions.showErrorSpinner();
        expect(fn).toHaveBeenCalledWith('error');
    });
    test('hideSpinner', async () => {
        actions.hideSpinner();
        await sleep(3000);
        expect(fn).toHaveBeenCalledWith('default');
    });
});

async function runTest(actionFunction) {
    const fn = jest.fn();
    const result = await actionFunction();
    expect(fn).toHaveBeenCalled();
    return result;
}

async function runTestForNumber(actionFunction) {
    const result = await runTest(actionFunction);
    expect(Number.isInteger(result)).toBeTruthy();
}

async function runTestForArray(actionFunction) {
    const result = await runTest(actionFunction);
    expect(Array.isArray(result)).toBeTruthy();
}

async function runTestForObject(actionFunction) {
    const result = await runTest(actionFunction);
    expect(result instanceof Object).toBeTruthy();
}

test('createRecipe', () => {
    runTestForNumber(actions.createRecipe);
});

test('loadRecipes', () => {
    runTestForArray(actions.loadRecipes);
});

test('getRecipe', () => {
    runTestForObject(actions.getRecipe);
});

test('getRecipeItems', () => {
    runTestForObject(actions.getRecipeItems);
});

test('updateRecipe', () => {
    runTest(actions.updateRecipe);
});

test('createRecipeItem', () => {
    runTestForNumber(actions.createRecipeItem);
});

test('deleteRecipeItem', () => {
    runTest(actions.deleteRecipeItem);
});

test('updateRecipeItem', () => {
    runTest(actions.updateRecipeItem);
});

test('addRecipeToShoppingList', () => {
    runTest(actions.addRecipeToShoppingList);
});

test('createShoppingListItem', () => {
    runTest(actions.createShoppingListItem);
});

test('updateShoppingListItem', () => {
    runTest(actions.updateShoppingListItem);
});

test('createShoppingList', () => {
    runTest(actions.createShoppingList);
});

test('loadCurrentShoppingListOrCreateNew', () => {
    runTestForObject(actions.loadCurrentShoppingListOrCreateNew);
});

test('getShoppingListItems', () => {
    runTestForArray(actions.getShoppingListItems);
});

test('getShoppingList', () => {
    runTestForObject(actions.getShoppingList);
});

test('getShoppingLists', () => {
    runTestForArray(actions.getShoppingLists);
});

test('getCategories', () => {
    runTestForArray(actions.getCategories);
});

test('loadEmails', () => {
    runTest(actions.loadEmails);
});

test('createAccountEmail', () => {
    runTest(actions.createAccountEmail);
});

test('createLogin', () => {
    runTest(actions.createLogin);
});

test('doLogout', () => {
    runTest(actions.doLogout);
});

test('deactivateAccount', () => {
    runTest(actions.deactivateAccount);
});

test('updateShoppingListName', () => {
    runTest(actions.updateShoppingListName);
});

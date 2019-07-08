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

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { RecipeContainer, RecipeRow, EditRecipe } from '../RecipeContainer';
import {IsLoggedInContext, CurrentShoppingListIdContext} from '../App';
const recipes = [
    {
        recipeId: 1, recipeName: "name", recipeDescription: "description", recipeSource: "source"
    }
];
const recipeItems = [
    {
        recipeId: 1,
        recipeItems: [{recipeItemId: 1, recipeItemValue: "cheese"}]
    }
];

test('Recipe row renders without crashing', () => {
    render(<RecipeRow recipe={recipes[0]} editRecipe={jest.fn()} addItemsToList={jest.fn()} />);
});


test('Recipe Container Renders', () => {
    render(<RecipeContainer />);
});

test('Edit Recipe Renders', () => {
    render(<EditRecipe recipeId={1} />);
});


// test('Edit Recipe', async () => {
//     const {getByText, queryByText} = render
//     (
//         <CurrentShoppingListIdContext.Provider value={1}>
//           <IsLoggedInContext.Provider value={true}>
//             <RecipeContainer loadRecipes={jest.fn()} isLoggedIn={true} recipes={recipes} createRecipe={jest.fn()} />
//           </IsLoggedInContext.Provider>
//         </CurrentShoppingListIdContext.Provider>
//     );
//     const button = getByText('Create New Recipe');
//     expect(button).toBeTruthy();
//     fireEvent.click(button);
//     await waitFor(() => getByText('Back to recipe list'));
//     expect(getByText('Back to recipe list')).toBeTruthy();
// });

// test('Add items to list', async () => {
//     const mock = jest.fn();
//     const {getByText} = render
//     (
//         <CurrentShoppingListIdContext.Provider value={1}>
//           <IsLoggedInContext.Provider value={true}>
//             <RecipeContainer addRecipeToShoppingList={mock} loadRecipes={jest.fn()} isLoggedIn={true} recipes={recipes} createRecipe={jest.fn()} />
//           </IsLoggedInContext.Provider>
//         </CurrentShoppingListIdContext.Provider>
//     );
//     const button = getByText('Add Recipe to Shopping List');
//     expect(button).toBeTruthy();
//     fireEvent.click(button);
//     await waitFor(() => expect(mock).toHaveBeenCalled());
// });

// test('Show recipe list', async () => {
//     const mock = jest.fn();
//     const {getByText, queryByText} = render(<Provider store={store}><RecipeContainerComponent addRecipeToShoppingList={mock} loadRecipes={jest.fn()} isLoggedIn={true} recipes={recipes} createRecipe={jest.fn()} /></Provider>);
//     const button = getByText('Edit');
//     expect(button).toBeTruthy();
//     fireEvent.click(button);
//     await waitFor(() => expect(queryByText('Create New Recipe')).toBeFalsy());
//     await waitFor(() => expect(queryByText('Back to recipe list')).toBeTruthy);
//     fireEvent.click(getByText('Back to recipe list'));
//     await waitFor(() => expect(queryByText('Create New Recipe')).toBeTruthy);
//     await waitFor(() => expect(queryByText('Back to recipe list')).toBeFalsy);
// });

test('Update recipe', async () => {
    const mockFn = jest.fn();
    const {getByText} = render(<RecipeRow recipe={recipes[0]} editRecipe={mockFn} addItemsToList={jest.fn()} />);
    const button = getByText('Edit');
    expect(button).toBeTruthy();
    fireEvent.click(button);
    await waitFor(() => expect(mockFn).toHaveBeenCalled());
});

test('Add recipe item', async () => {
    const mockFn = jest.fn();
    const {getByText} = render(<RecipeRow recipe={recipes[0]} editRecipe={jest.fn()} addItemsToList={mockFn} />);
    const button = getByText('Add Recipe to Shopping List');
    expect(button).toBeTruthy();
    fireEvent.click(button);
    await waitFor(() => expect(mockFn).toHaveBeenCalled());
});

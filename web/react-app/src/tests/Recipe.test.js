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
import ReactDOM from 'react-dom';
import {shallow} from 'enzyme';
import Enzyme from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from 'redux-mock-store';
import { RecipeContainer, RecipeContainerComponent, RecipeRow, EditRecipe, EditRecipeComponent } from '../RecipeContainer';
import thunk from 'redux-thunk';
const mockStore = configureMockStore([thunk]);
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
const store = mockStore({ recipes, isLoggedIn: true, currentShoppingListId: 1, recipeItems });
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('Recipe Container Renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}><RecipeContainer /></Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

test('Edit Recipe Renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}><EditRecipe recipeId={1} /></Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

test('Recipe Row Renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}><RecipeRow recipe={{recipeName: "name"}} /></Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

test('Edit Recipe', () => {
    const recipeContainer = shallow(<RecipeContainerComponent loadRecipes={jest.fn()}/>).instance();
    expect(recipeContainer.state.showList).toBeTruthy();
    recipeContainer.editRecipe(1);
    expect(recipeContainer.state.showList).toBeFalsy();
});

test('Add items to list', () => {
    const recipeContainer = shallow(<RecipeContainerComponent loadRecipes={jest.fn()} addRecipeToShoppingList={jest.fn()}/>).instance();
    recipeContainer.addItemsToList(1);
    expect(recipeContainer.props.addRecipeToShoppingList).toHaveBeenCalled();
});

test('Show recipe list', () => {
    const recipeContainer = shallow(<RecipeContainerComponent loadRecipes={jest.fn()}/>).instance();
    expect(recipeContainer.state.showList).toBeTruthy();
    recipeContainer.editRecipe(1);
    expect(recipeContainer.state.showList).toBeFalsy();
    recipeContainer.showRecipeList();
    expect(recipeContainer.state.showList).toBeTruthy();
});

test('Create recipe', async () => {
    expect.assertions(2);
    const recipeContainer = shallow(<RecipeContainerComponent loadRecipes={jest.fn()} createRecipe={jest.fn()}/>).instance();
    await recipeContainer.createRecipe();
    expect(recipeContainer.props.createRecipe).toHaveBeenCalled();
    expect(recipeContainer.state.showList).toBeFalsy();
});

test('Update recipe', () => {
    const editRecipe = shallow(<EditRecipeComponent loadRecipeItems={jest.fn()} recipeId={1} recipes={recipes} recipeItems={recipeItems} updateRecipe={jest.fn()}/>).instance();
    editRecipe.updateRecipe();
    expect(editRecipe.props.updateRecipe).toHaveBeenCalled();
    expect(editRecipe.state.showRecipeNameInput).toBeFalsy();
});

test('Add recipe item', () => {
    const editRecipe = shallow(<EditRecipeComponent loadRecipeItems={jest.fn()} recipeId={1} recipes={recipes} recipeItems={recipeItems} createRecipeItem={jest.fn()}/>).instance();
    editRecipe.state.recipeItemValue = "new item";
    editRecipe.addRecipeItem();
    expect(editRecipe.props.createRecipeItem).toHaveBeenCalledWith(1, "new item");
    expect(editRecipe.state.recipeItemValue).toBe("");
});

test('Update recipe item', () => {
    const editRecipe = shallow(<EditRecipeComponent loadRecipeItems={jest.fn()} recipeId={1} recipes={recipes} recipeItems={recipeItems} updateRecipeItem={jest.fn()}/>).instance();
    editRecipe.updateRecipeItem(1, "new item");
    expect(editRecipe.props.updateRecipeItem).toHaveBeenCalledWith(1, 1, "new item");
    expect(editRecipe.state.showRecipeItemInputId).toBe(0);
});

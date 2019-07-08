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
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import {shallow} from 'enzyme';
import Enzyme from 'enzyme';
import { ShoppingList, ShoppingListComponent } from '../ShoppingList';
const shoppingListItems = [
    {
        shoppingListId: 1,
        shoppingListItems: [{propKey: 1, shoppingListItemValue: "milk", shoppingListItemChecked: false, categoryId: 1}]
    }
];
const currentShoppingListRecipes = [];

test('TODO', () => {
   // TODO
});

// test('Renders', () => {
//     render(<Provider store={store}><ShoppingListComponent shoppingListId={'1'}/></Provider>);
//     // const div = document.createElement('div');
//     // ReactDOM.render(<Provider store={store}><table><tbody><ShoppingList shoppingListId={1} /></tbody></table></Provider>, div);
//     // ReactDOM.unmountComponentAtNode(div);
// });

// test('handleCreateItem no input', () => {
//     const shoppingList = shallow(<ShoppingListComponent createShoppingListItem={jest.fn()} shoppingListItems={[]} shoppingListRecipes={[]} />).instance();
//     shoppingList.handleCreateItem();
//     expect(shoppingList.props.createShoppingListItem).toHaveBeenCalledTimes(0);
// });

// test('handleCreateItem with input', () => {
//     const shoppingList = shallow(<ShoppingListComponent createShoppingListItem={jest.fn()} shoppingListItems={[]} shoppingListRecipes={[]} />).instance();
//     shoppingList.state.createItemInput = "cheese";
//     shoppingList.handleCreateItem();
//     expect(shoppingList.props.createShoppingListItem).toHaveBeenCalledTimes(1);
// });

// test('handleCreateNewList', () => {
//     const shoppingList = shallow(<ShoppingListComponent createShoppingList={jest.fn()} createShoppingListItem={jest.fn()} shoppingListItems={[]} shoppingListRecipes={[]} />).instance();
//     shoppingList.handleCreateNewList();
//     expect(shoppingList.props.createShoppingList).toHaveBeenCalledTimes(1);
// });

// test('handleDeleteSelectedItems', () => {
//     const shoppingList = shallow(<ShoppingListComponent shoppingListId={1} deleteShoppingListSelectedItems={jest.fn()} createShoppingList={jest.fn()} createShoppingListItem={jest.fn()} shoppingListRecipes={[]} shoppingListItems={[]} />).instance();
//     shoppingList.handleDeleteSelectedItems();
//     expect(shoppingList.props.deleteShoppingListSelectedItems).toHaveBeenCalledWith(1);
// });

// test('sortShoppingListCompare', () => {
//     const categories = [{categoryId: 3, categoryName: "A"}, {categoryId: 5, categoryName: "B"}];
//     const shoppingList = shallow(<ShoppingListComponent categories={categories} shoppingListId={1} deleteShoppingListSelectedItems={jest.fn()} createShoppingList={jest.fn()} createShoppingListItem={jest.fn()} shoppingListItems={[]} shoppingListRecipes={[]} />).instance();
//     let a = {};
//     let b = {};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(1);
//     a = {categoryId: 3};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(-1);
//     b = {categoryId: 3};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(0);
//     a = {categoryId: 3, shoppingListItemValue: "milk"};
//     b = {categoryId: 3, shoppingListItemValue: "eggs"};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(1);
//     b = {categoryId: 3, shoppingListItemValue: "milk"};
//     a = {categoryId: 3, shoppingListItemValue: "eggs"};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(-1);
//     b = {categoryId: 10, shoppingListItemValue: "milk"};
//     a = {categoryId: 3, shoppingListItemValue: "eggs"};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(-1);
//     b = {categoryId: 10, shoppingListItemValue: "milk"};
//     a = {categoryId: 20, shoppingListItemValue: "eggs"};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(1);
//     b = {categoryId: 5, shoppingListItemValue: "milk"};
//     a = {categoryId: 3, shoppingListItemValue: "eggs"};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(-1);
//     b = {categoryId: 3, shoppingListItemValue: "milk"};
//     a = {categoryId: 5, shoppingListItemValue: "eggs"};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(1);
//     b = {categoryId: 3, shoppingListItemValue: "milk"};
//     a = {categoryId: 5, shoppingListItemValue: "eggs", shoppingListItemChecked: true};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(1);
//     b = {categoryId: 3, shoppingListItemValue: "milk", shoppingListItemChecked: false};
//     a = {categoryId: 5, shoppingListItemValue: "eggs", shoppingListItemChecked: true};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(1);
//     b = {categoryId: 3, shoppingListItemValue: "milk", shoppingListItemChecked: false};
//     a = {categoryId: 5, shoppingListItemValue: "eggs"};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(1);
//     b = {categoryId: 3, shoppingListItemValue: "milk", shoppingListItemChecked: false};
//     a = {categoryId: 5, shoppingListItemValue: "eggs", shoppingListItemChecked: false};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(1);
//     b = {categoryId: 3, shoppingListItemValue: "milk", shoppingListItemChecked: true};
//     a = {categoryId: 5, shoppingListItemValue: "eggs", shoppingListItemChecked: true};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(1);
//     b = {categoryId: 3, shoppingListItemValue: "milk", shoppingListItemChecked: true};
//     a = {categoryId: 5, shoppingListItemValue: "eggs"};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(-1);
//     b = {categoryId: 3, shoppingListItemValue: "milk", shoppingListItemChecked: true};
//     a = {categoryId: 5, shoppingListItemValue: "eggs", shoppingListItemChecked: false};
//     expect(shoppingList.sortShoppingListCompare(a, b)).toEqual(-1);
// });

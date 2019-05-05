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
import { ShoppingListName, ShoppingListNameComponent } from '../ShoppingListName';
const mockStore = configureMockStore();
const store = mockStore({ shoppingLists: [] });
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('Renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}><ShoppingListName shoppingListId={0}/></Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

test('Id is required', () => {
    expect(() => {
        shallow(<ShoppingListNameComponent shoppingLists={[]}/>);
    }).toThrow();
});

test('Show input', () => {
    const shoppingListName = shallow(<ShoppingListNameComponent shoppingListId={0} shoppingLists={[]}/>).instance();
    shoppingListName.showShoppingListNameInput();
    expect(shoppingListName.state.showShoppingListNameInput).toBeTruthy();
});

test('Change name', () => {
    const shoppingListName = shallow(<ShoppingListNameComponent shoppingListId={0} shoppingLists={[]} updateShoppingListName={jest.fn()}/>).instance();
    shoppingListName.setState({shoppingListName: "new-name"});
    shoppingListName.updateShoppingListName();
    expect(shoppingListName.state.showShoppingListNameInput).toBeFalsy();
    expect(shoppingListName.state.shoppingListName).toBe("new-name");
    expect(shoppingListName.props.updateShoppingListName).toHaveBeenCalled();
});

test('Change name extra spaces', () => {
    const shoppingListName = shallow(<ShoppingListNameComponent isLoggedIn={false} shoppingLists={[]} shoppingListId={0} updateShoppingListName={jest.fn()}/>).instance();
    shoppingListName.setState({shoppingListName: "new-name     "});
    shoppingListName.updateShoppingListName();
    expect(shoppingListName.state.showShoppingListNameInput).toBeFalsy();
    expect(shoppingListName.props.updateShoppingListName).toHaveBeenCalledWith(0, "new-name", false);
});


test('Component update shopping list id ', () => {
    const shoppingListName = shallow(<ShoppingListNameComponent shoppingLists={[{shoppingListId: 1, shoppingListName: "new"}]} shoppingListId={1} updateShoppingListName={jest.fn()}/>).instance();
    shoppingListName.setState = jest.fn();
    shoppingListName.componentDidUpdate({shoppingListId: 0});
    expect(shoppingListName.setState).toHaveBeenCalledWith({"shoppingListName": "new"});
});

test('Component update shopping list name ', () => {
    const shoppingListName = shallow(<ShoppingListNameComponent shoppingLists={[{shoppingListId: 1, shoppingListName: "new"}]} shoppingListId={1} updateShoppingListName={jest.fn()}/>).instance();
    shoppingListName.setState = jest.fn();
    shoppingListName.componentDidUpdate({shoppingListId: 1, shoppingLists: [{shoppingListId: 1, shoppingListName: "old"}]});
    expect(shoppingListName.setState).toHaveBeenCalledWith({"shoppingListName": "new"});
});

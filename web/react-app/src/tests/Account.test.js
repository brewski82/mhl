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
import { Account, AccountComponent } from '../Account';
import thunk from 'redux-thunk';
// import { applyMiddleware } from 'redux';
const mockStore = configureMockStore([thunk]);
const loadEmails = jest.fn();
const store = mockStore({ isLoggedIn: true, categories: [], shoppingLists: [] });
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('Renders', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}><Account/></Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
});

test('Good email', () => {
    const accountComponent = shallow(<AccountComponent loadEmails={loadEmails} createAccountEmail={jest.fn()} />).instance();
    accountComponent.state.addEmailInput = "a@example.com";
    accountComponent.handleAddEmail();
    expect(accountComponent.props.createAccountEmail).toHaveBeenCalledTimes(1);
    expect(accountComponent.state.isValid).toBeTruthy();
});

test('Bad email', () => {
    const accountComponent = shallow(<AccountComponent loadEmails={loadEmails} createAccountEmail={jest.fn()} />).instance();
    accountComponent.state.addEmailInput = "a";
    accountComponent.handleAddEmail();
    expect(accountComponent.state.isValid).toBeFalsy();
});

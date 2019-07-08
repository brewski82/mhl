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

import { render } from '@testing-library/react';
import React from 'react';
import { Nav } from '../Nav';
import { BrowserRouter as Router } from "react-router-dom";
import {CurrentShoppingListItemsContext, IsLoggedInContext, CurrentShoppingListIdContext, SetNumberOfShoppingListItemsContext} from '../App';

test('Nav renders without crashing', () => {
    render
    (
        <CurrentShoppingListIdContext.Provider value={1}>
          <IsLoggedInContext.Provider value={false}>
            <SetNumberOfShoppingListItemsContext.Provider value={jest.fn()}>
              <Router>
                <Nav/>
              </Router>
            </SetNumberOfShoppingListItemsContext.Provider>
          </IsLoggedInContext.Provider>
        </CurrentShoppingListIdContext.Provider>
    );
});

test('Not logged in', async () => {
    const { getByText } = render
    (
        <CurrentShoppingListIdContext.Provider value={1}>
          <IsLoggedInContext.Provider value={false}>
            <SetNumberOfShoppingListItemsContext.Provider value={jest.fn()}>
              <Router>
                <Nav/>
              </Router>
            </SetNumberOfShoppingListItemsContext.Provider>
          </IsLoggedInContext.Provider>
        </CurrentShoppingListIdContext.Provider>);
    expect(getByText('Log In')).toBeTruthy();
});

test('Logged in', async () => {
    const { queryByText, getByText } = render
    (
        <CurrentShoppingListIdContext.Provider value={1}>
          <IsLoggedInContext.Provider value={true}>
            <SetNumberOfShoppingListItemsContext.Provider value={jest.fn()}>
              <Router>
                <Nav/>
              </Router>
            </SetNumberOfShoppingListItemsContext.Provider>
          </IsLoggedInContext.Provider>
        </CurrentShoppingListIdContext.Provider>);
    expect(queryByText('Log In')).toBeFalsy();
    expect(getByText('Account')).toBeTruthy();
});

test('Not logged in with items to save', async () => {
    const { queryByText, getByText, getByRole } = render
    (
        <CurrentShoppingListItemsContext.Provider value={[1,2,3]}>
          <CurrentShoppingListIdContext.Provider value={1}>
            <IsLoggedInContext.Provider value={false}>
              <SetNumberOfShoppingListItemsContext.Provider value={jest.fn()}>
              <Router>
                <Nav/>
              </Router>
            </SetNumberOfShoppingListItemsContext.Provider>
            </IsLoggedInContext.Provider>
          </CurrentShoppingListIdContext.Provider>
        </CurrentShoppingListItemsContext.Provider>
    );
    // expect(queryByText('Log In')).toBeFalsy();
    // expect(queryByText('Account')).toBeFalsy();
    // expect(queryByText('Save List')).toBeTruthy();
});

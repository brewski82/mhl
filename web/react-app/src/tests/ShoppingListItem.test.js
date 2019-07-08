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
import ReactDOM from 'react-dom';
import { ShoppingListItem, ShoppingListItemComponent } from '../ShoppingListItem';
const shoppingListItems = [
    {
        shoppingListId: 1,
        shoppingListItems: [{propKey: 1, shoppingListItemValue: "milk", shoppingListItemChecked: false, categoryId: 1}]
    }
];

test('TODO', () => {
   // TODO
});

// test('Renders', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<Provider store={store}><table><tbody><ShoppingListItem shoppingListId={1} propKey={1} /></tbody></table></Provider>, div);
//     ReactDOM.unmountComponentAtNode(div);
// });

// test('Toggle checkbox', async () => {
//     const {getByRole} = render(<Provider store={store}><ShoppingListItemComponent item={{shoppingListItemValue: "milk", shoppingListItemChecked: false, categoryId: 1}} updateShoppingListItem={jest.fn()} /></Provider>);
//     const shoppingListItemCheckbox = getByRole('checkbox');
//     expect(shoppingListItemCheckbox.checked).toBeFalsy();
//     fireEvent.click(shoppingListItemCheckbox);
//     await waitFor(() => expect(shoppingListItemCheckbox.checked).toBeTruthy());
// });

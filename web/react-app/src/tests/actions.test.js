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

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../redux/actions';;
import fetchMock from 'fetch-mock';
import { sleep } from '../Utils';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
// const dispatch = jest.fn();

describe('spinners', () => {
    test('showSavedSpinner calls dispatch function and returns the provided value', () => {
        const val = 1;
        const fn = jest.fn();
        const returnVal = actions.showSavedSpinner(fn, val);
        expect(returnVal).toEqual(val);
        expect(fn).toHaveBeenCalledWith({type: actions.SHOW_SAVED_SPINNER});
    });
    test('hideSpinner calls dispatch function and returns the provided value', async () => {
        const val = 1;
        const fn = jest.fn();
        actions.hideSpinner(fn, val);
        await sleep(3000);
        expect(fn).toHaveBeenCalledWith({type: actions.HIDE_SPINNER});
    });
});

// describe('current shopping list', () => {
//     afterEach(() => {
//         fetchMock.restore();
//     });

//     test('createShoppingListItem', () => {
//         const item = 'myitem';
//         const dispatch = jest.fn();
//         fetchMock.postOnce('/api/v1/shopping-lists', {
//             body: { value: item },
//             headers: { 'content-type': 'application/json' }
//         });

//         return actions.createShoppingListItem(1, item, true)(dispatch).then((response) => {
//             console.log(response);
//             expect(dispatch).toHaveBeenCalledWith(
//                 {
//                     "item": {"categoryId": 18, "propKey": 2, "shoppingListId": 1, "shoppingListItemChecked": false, "shoppingListItemId": 1, "shoppingListItemValue": "myitem"},
//                     "type": "UPDATE_SHOPPING_LIST_ITEM"
//                 });
//             // expect(dispatch).toHaveBeenCalledWith({
//             //     type: actions.ADD_ITEM_CURRENT_SHOPPING_LIST,
//             //     item,
//             //     propKey: 1
//             // });
//             // expect(response.value).toBe(item);
//         });
//     });

// });

// describe('async actions', () => {
//   afterEach(() => {
//     fetchMock.restore()
//   })

//   it('creates FETCH_TODOS_SUCCESS when fetching todos has been done', () => {
//     fetchMock.getOnce('/todos', {
//       body: { todos: ['do something'] },
//       headers: { 'content-type': 'application/json' }
//     })

//     const expectedActions = [
//       { type: types.FETCH_TODOS_REQUEST },
//       { type: types.FETCH_TODOS_SUCCESS, body: { todos: ['do something'] } }
//     ]
//     const store = mockStore({ todos: [] })

//     return store.dispatch(actions.fetchTodos()).then(() => {
//       // return of async actions
//       expect(store.getActions()).toEqual(expectedActions)
//     })
//   })
// })

// describe('actions', () => {



//   it('should create an action to add an item to the shopping list', () => {
//     const item = 'eggs'
//     const expectedAction = {
//       type: actions.ADD_ITEM_CURRENT_SHOPPING_LIST,
//       item
//     }
//     expect(actions.createShoppingListItem(item)).toEqual(expectedAction)
//   })
// });

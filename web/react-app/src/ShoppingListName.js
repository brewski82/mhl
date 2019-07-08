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

import React, { useState, useEffect, useContext } from 'react';
import { checkForEnterKey } from './Utils';
import { updateShoppingListName, generateDefaultShoppingListName, getShoppingList } from './api/actions';
import { IsLoggedInContext, CurrentShoppingListIdContext } from './App';
import { CurrentShoppingListNameContext } from './ShoppingList';

/**
 * Handles displaying and updating shopping list names.
 */
function ShoppingListName() {
    const isLoggedIn = useContext(IsLoggedInContext);
    const { currentShoppingListId } = useContext(CurrentShoppingListIdContext);
    const { currentShoppingListName, setCurrentShoppingListName } = useContext(CurrentShoppingListNameContext);
    const [showShoppingListNameInput, setShowShoppingListNameInput] = useState(false);

    useEffect(() => {
        (async () => {
            console.log('in ShoppingListName effect');
            if (isLoggedIn) {
                if (currentShoppingListId !== 0) {
                    console.log('sln');
                    const shoppingList = await getShoppingList(currentShoppingListId);
                    setCurrentShoppingListName(shoppingList.shoppingListName);
                }
            }
        })();
    }, [isLoggedIn, currentShoppingListId]);

    /**
     * Makes the call to the backend to persist the name change.
     */
    const persistShoppingListName = () => {
        // Set to a default name if the user blanked the input.
        if (currentShoppingListName.length === 0) {
            setCurrentShoppingListName(generateDefaultShoppingListName());
        }
        setCurrentShoppingListName(currentShoppingListName.trim());
        updateShoppingListName(currentShoppingListId, currentShoppingListName);
        setShowShoppingListNameInput(false);
    };

    const showShoppingListNameInputBox = () => {
        setShowShoppingListNameInput(true);
    };

    return (
        <div>
          {showShoppingListNameInput ? (
              <input className="form-control" id="shopping-list-name-input"
                     name="shoppingListName"
                     onChange={e => setCurrentShoppingListName(e.target.value)}
                     onKeyPress={e => checkForEnterKey(e, persistShoppingListName)}
                     onBlur={persistShoppingListName}
                     value={currentShoppingListName} />

          ) : (
              <div className="row">
                <h3 onClick={showShoppingListNameInputBox}>{currentShoppingListName}</h3>
                <button type="button" className="btn btn-link" onClick={showShoppingListNameInputBox}>Edit Name</button>
              </div>
          )}
        </div>
    );
}

export {ShoppingListName};

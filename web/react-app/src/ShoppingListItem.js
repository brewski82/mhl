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

import React, { useState, useContext } from 'react';
import { checkForEnterKey } from './Utils';
import { updateShoppingListItem } from './api/actions';
import {IsLoggedInContext, CurrentShoppingListItemsDispatchContext} from './App';
import {CategoryListContext} from './ShoppingList';

/**
 * Function for displaying the category drop down. The second argument
 * is an array of categories. If not present or is empty, the drop
 * down will not display. The first argument is the selected
 * category. If not present, the default "Category..." option will be
 * selected. The third argument is a callback that fires when the user
 * changes the selected drop down item.
 */
function CategoryDropdown(props) {
    const categoryId = props.categoryId;
    const callback = props.callback;
    const categories = useContext(CategoryListContext);
    return <div className="input-group mb-3">
             {categories && categories.length > 0 ?
             <select className="custom-select" id="inputGroupSelect01" value={categoryId ? categoryId : ''} onChange={callback}>
               {!categoryId && <option key="-1" value="-1">Category...</option>}
               {categories.map(cat =>  <option value={cat.categoryId} key={cat.categoryId}>{cat.categoryName}</option>)}
              </select>
              :
              <p>Loading Categories...</p>
             }
           </div>;
}

/**
 * Component for shopping list items. These components should be
 * created with an "item" property which contains keys of shoppingListItemValue,
 * shoppingListItemChecked, and categoryId.
 */
function ShoppingListItem(props) {
    const [{showInput, shoppingListItemChecked}, setState] = useState({showInput: false, shoppingListItemChecked: props.item.shoppingListItemChecked || false});
    const [shoppingListItemValue, setShoppingListItemValue] = useState(props.item.shoppingListItemValue);
    const isLoggedIn = useContext(IsLoggedInContext);
    const currentShoppingListItemsDispatch  = useContext(CurrentShoppingListItemsDispatchContext);

    /**
     * Toggles the checkbox. When checked, the item is considered
     * complete and is candidate for deletion.
     */
    const toggleChecked = () => {
        setState((prevState) => {
            let newValue = !prevState.shoppingListItemChecked;
            updateShoppingListItem(
                {
                    shoppingListId: props.shoppingListId,
                    shoppingListItemId: props.item.shoppingListItemId,
                    shoppingListItemValue: shoppingListItemValue,
                    shoppingListItemChecked: newValue,
                    categoryId: props.item.categoryId,
                    propKey: props.item.propKey
                },
                isLoggedIn,
                currentShoppingListItemsDispatch
            );
            return {...prevState, shoppingListItemChecked: newValue};
        });
    };

    /**
     * Changes the item's cateogry.
     */
    const updateCategory = (categoryId) => {
        updateShoppingListItem(
            {
                shoppingListId: props.shoppingListId,
                shoppingListItemId: props.item.shoppingListItemId,
                shoppingListItemValue: shoppingListItemValue,
                shoppingListItemChecked: shoppingListItemChecked,
                categoryId: parseInt(categoryId),
                propKey: props.item.propKey
            },
            isLoggedIn,
            currentShoppingListItemsDispatch
        );
    };

    /**
     * Changes the item's shoppingListItemValue, i.e. the text of the item.
     */
    const updateShoppingListItemValue = () => {
        if (shoppingListItemValue.length > 0) {
            updateShoppingListItem(
                {
                    shoppingListId: props.shoppingListId,
                    shoppingListItemId: props.item.shoppingListItemId,
                    shoppingListItemValue: shoppingListItemValue,
                    shoppingListItemChecked: shoppingListItemChecked,
                    categoryId: props.item.categoryId,
                    propKey: props.item.propKey
                },
                isLoggedIn,
                currentShoppingListItemsDispatch
            );
        } else {
            // If the user deleted the item's text, revert to the
            // original item as we do not want to allow empty text
            // items.
            setState((prevState) => ({...prevState, shoppingListItemValue: props.item.shoppingListItemValue}));
        }
        setState((prevState) => ({...prevState, showInput: false}));
    };

    return (
        <tr className={props.shoppingListItemToHighlight === props.propKey ? "item-highlight" : ""}>
          <td className="shopping-list-item-checkbox align-middle text-center">
            <input type="checkbox"
                   name="shoppingListItemChecked"
                   onChange={toggleChecked}
                   checked={shoppingListItemChecked}
                   value={shoppingListItemChecked}/>
          </td>
          <td onClick={() => setState((prevState) => ({...prevState, showInput: true}))}>
            {showInput ? (
                <input name="shoppingListItemValue"
                       onChange={e => setShoppingListItemValue(e.target.value)}
                       value={shoppingListItemValue}
                       onKeyPress={e => checkForEnterKey(e, updateShoppingListItemValue)}
                       onBlur={updateShoppingListItemValue}/>
            ) : (
                <div>
                  {props.item.shoppingListItemChecked ? (<del>{props.item.shoppingListItemValue}</del>) : props.item.shoppingListItemValue}
                </div>
            )}
          </td>
          <td className="shopping-list-item-category">
            <CategoryDropdown categoryId={props.item.categoryId} callback={e => updateCategory(e.target.value)}/>
          </td>
        </tr>
    );
}

export  {ShoppingListItem}

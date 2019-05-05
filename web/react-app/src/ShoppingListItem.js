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
import { handleInputChange, checkForEnterKey } from './Utils';
import { connect } from "react-redux";
import { updateShoppingListItem } from './redux/actions';

/**
 * Function for displaying the category drop down. The second argument
 * is an array of categories. If not present or is empty, the drop
 * down will not display. The first argument is the selected
 * category. If not present, the default "Category..." option will be
 * selected. The third argument is a callback that fires when the user
 * changes the selected drop down item.
 */
function categoryDropdown(categoryId, categories, callback) {
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
class ShoppingListItemComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showInput: false, shoppingListItemValue: this.props.item.shoppingListItemValue, shoppingListItemChecked: this.props.item.shoppingListItemChecked};
        this.handleInputChange = handleInputChange.bind(this);
    }

    /**
     * Toggles the checkbox. When checked, the item is considered
     * complete and is candidate for deletion.
     */
    toggleChecked = () => {
        // Since toggling the checkbox relies on the previous state,
        // pass a function to setState to correctly get the previous
        // state. See
        // https://reactjs.org/docs/state-and-lifecycle.html for more
        // info.
        this.setState((state, props) => {
            let newValue = !state.shoppingListItemChecked;
            props.updateShoppingListItem(
                {
                    shoppingListId: props.shoppingListId,
                    shoppingListItemId: props.item.shoppingListItemId,
                    shoppingListItemValue: state.shoppingListItemValue,
                    shoppingListItemChecked: newValue,
                    categoryId: props.item.categoryId,
                    propKey: props.item.propKey
                },
                this.props.isLoggedIn
            );
            return {shoppingListItemChecked: newValue};
        });
    }

    /**
     * Changes the item's cateogry.
     */
    updateCategory = (categoryId) => {
        this.props.updateShoppingListItem(
            {
                shoppingListId: this.props.shoppingListId,
                shoppingListItemId: this.props.item.shoppingListItemId,
                shoppingListItemValue: this.state.shoppingListItemValue,
                shoppingListItemChecked: this.state.shoppingListItemChecked,
                categoryId: parseInt(categoryId),
                propKey: this.props.item.propKey
            },
            this.props.isLoggedIn
        );
    }

    /**
     * Changes the item's shoppingListItemValue, i.e. the text of the item.
     */
    updateShoppingListItemValue = () => {
        if (this.state.shoppingListItemValue.length > 0) {
            this.props.updateShoppingListItem(
                {
                    shoppingListId: this.props.shoppingListId,
                    shoppingListItemId: this.props.item.shoppingListItemId,
                    shoppingListItemValue: this.state.shoppingListItemValue,
                    shoppingListItemChecked: this.state.shoppingListItemChecked,
                    categoryId: this.props.item.categoryId,
                    propKey: this.props.item.propKey
                },
                this.props.isLoggedIn
            );
        } else {
            // If the user deleted the item's text, revert to the
            // original item as we do not want to allow empty text
            // items.
            this.setState({shoppingListItemValue: this.props.item.shoppingListItemValue});
        }
        this.setState({showInput: false});
    }

    render() {
        return (
            <tr className={this.props.shoppingListItemToHighlight === this.props.propKey ? "item-highlight" : ""}>
              <td className="shopping-list-item-checkbox align-middle text-center">
                <input type="checkbox" name="shoppingListItemChecked" onChange={this.toggleChecked} checked={this.state.shoppingListItemChecked} />
              </td>
              <td onClick={e => this.setState({showInput: true})}>
                {this.state.showInput ? (
                    <input name="shoppingListItemValue" onChange={this.handleInputChange} value={this.state.shoppingListItemValue}
                           onKeyPress={e => checkForEnterKey(e, this.updateShoppingListItemValue)}
                           onBlur={this.updateShoppingListItemValue}/>
                ) : (
                    <div>
                      {this.props.item.shoppingListItemChecked ? (<del>{this.props.item.shoppingListItemValue}</del>) : this.props.item.shoppingListItemValue}
                    </div>
                )}
              </td>
              <td className="shopping-list-item-category">{categoryDropdown(this.props.item.categoryId, this.props.categories, e => this.updateCategory(e.target.value))}</td>
            </tr>
        );
    }
}

const ShoppingListItem = connect((state, ownProps) => {
    const shoppingList = state.shoppingListItems.find(({shoppingListId}) => shoppingListId === ownProps.shoppingListId);
    const shoppingListItem = shoppingList.shoppingListItems.find(({propKey}) => propKey === ownProps.propKey);
    return {item: shoppingListItem, categories: state.categories, isLoggedIn: state.isLoggedIn, shoppingListItemToHighlight: state.shoppingListItemToHighlight};
}, {updateShoppingListItem})(ShoppingListItemComponent);

export  {ShoppingListItem, ShoppingListItemComponent}

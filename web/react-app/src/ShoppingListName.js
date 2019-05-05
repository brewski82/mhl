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
import { connect } from "react-redux";
import { handleInputChange, checkForEnterKey } from './Utils';
import { updateShoppingListName, generateDefaultShoppingListName } from './redux/actions';

/**
 * Handles displaying and updating shopping list names. Subscribes to
 * the array of {shoppingListId, shoppingListName} objects for the
 * user. Requires passing a shopping list id via the props. For
 * unauthenticated users, use zero as the id. The id is allowed to
 * update after the user logs in or creates an account.
 */
class ShoppingListNameComponent extends React.Component {
    constructor(props) {
        super(props);
        if (!('shoppingListId' in props) || isNaN(props.shoppingListId)) {
            throw new Error('shoppingListId is a required prop.');
        }
        let shoppingListName = this.findShoppingListName(props);
        if (!shoppingListName) {
            shoppingListName = generateDefaultShoppingListName();
        }
        this.state = { showShoppingListNameInput: false, shoppingListName};
        this.handleInputChange = handleInputChange.bind(this);
    }

    /**
     * Returns the shopping list name from the array of
     * {shoppingListId, shoppingListName} objects. Returns null if not
     * found.
     */
    findShoppingListName(props) {
        const shoppingList = props.shoppingLists.find(({shoppingListId}) => shoppingListId === props.shoppingListId);
        if (!shoppingList) {
            return null;
        }
        return shoppingList.shoppingListName;
    }

    /**
     * props.shoppingListId can change in this component in the event
     * an non-logged-in user starts creating a list, then decides to
     * log in. In this case, the shopping list id will start with zero
     * but will be assigned a valid id after logging in. This method
     * checks for that condition and sets the state if necessary,
     * causing a render.
     */
    componentDidUpdate(prevProps) {
        if (this.props.shoppingListId !== prevProps.shoppingListId) {
            const shoppingListName = this.findShoppingListName(this.props);
            this.setState({shoppingListName});
            return;
        }
        const prevShoppingListName = this.findShoppingListName(prevProps);
        const shoppingListName = this.findShoppingListName(this.props);
        if (prevShoppingListName !== shoppingListName) {
            this.setState({shoppingListName});
        }
    }

    /**
     * Makes the call to the backend to persist the name change.
     */
    updateShoppingListName = () => {
        const {shoppingListId} = this.props;
        let {shoppingListName} = this.state;
        // Set to a default name if the user blanked the input.
        if (shoppingListName.length === 0) {
            shoppingListName = generateDefaultShoppingListName();
        }
        shoppingListName = shoppingListName.trim();
        this.props.updateShoppingListName(shoppingListId, shoppingListName, this.props.isLoggedIn);
        this.setState({showShoppingListNameInput: false, shoppingListName});
    }

    showShoppingListNameInput = () => {
        this.setState({showShoppingListNameInput: true});
    }

    render() {
        return (
            <div>
              {this.state.showShoppingListNameInput ? (
                  <input className="form-control" id="shopping-list-name-input"
                         name="shoppingListName"
                         onChange={this.handleInputChange}
                         onKeyPress={e => checkForEnterKey(e, this.updateShoppingListName)}
                         onBlur={this.updateShoppingListName}
                         value={this.state.shoppingListName} />

              ) : (
                  <div className="row">
                    <h3 onClick={this.showShoppingListNameInput}>{this.state.shoppingListName}</h3>
                    <button type="button" className="btn btn-link" onClick={this.showShoppingListNameInput}>Edit Name</button>
                  </div>
              )}
            </div>
        );
    }
}

const ShoppingListName = connect(state => ({shoppingLists: state.shoppingLists, isLoggedIn: state.isLoggedIn}), {updateShoppingListName})(ShoppingListNameComponent);

export {ShoppingListName, ShoppingListNameComponent};

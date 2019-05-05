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
import { createShoppingListItem, createShoppingList, deleteShoppingListSelectedItems } from './redux/actions';
import { connect } from "react-redux";
import { ShoppingListName } from './ShoppingListName';
import { ShoppingListItem } from './ShoppingListItem';
import './ShoppingList.css';

/**
 * Component for editing a shopping list. This is the default
 * component that will show on the home screen, even for user who are
 * not logged in.
 */
class ShoppingListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { createItemInput: "", showShoppingListNameInput: false };
        this.handleInputChange = handleInputChange.bind(this);
    }

    /**
     * Creates a new shopping list item.
     */
    handleCreateItem = () => {
        if (this.state.createItemInput.length > 0) {
            this.props.createShoppingListItem(this.props.shoppingListId, this.state.createItemInput, this.props.isLoggedIn);
            this.setState({ createItemInput: ""});
        }
    };

    /**
     * Creates a new shopping list. The old list can still be accessed
     * by the "Lists" menu item. The new list is created with a
     * default shopping list name.
     */
    handleCreateNewList = () => {
        this.props.createShoppingList();
    }

    /**
     * Permanately deletes any marked shopping list items.
     */
    handleDeleteSelectedItems = () => {this.props.deleteShoppingListSelectedItems(this.props.shoppingListId);}

    /**
     * Function to determine the sort order of shopping list items.
     */
    sortShoppingListCompare = (a, b) => {
        if (a.shoppingListItemChecked && !b.shoppingListItemChecked) {
            return 1;
        }
        if (!a.shoppingListItemChecked && b.shoppingListItemChecked) {
            return -1;
        }
        if (!a.categoryId) {
            return 1;
        }
        if (!b.categoryId) {
            return -1;
        }
        if (a.categoryId === b.categoryId) {
            if (a.shoppingListItemValue < b.shoppingListItemValue) {
                return -1;
            }
            if (a.shoppingListItemValue > b.shoppingListItemValue) {
                return 1;
            }
            return 0;
        }
        let aCat = this.props.categories.find(({categoryId}) => a.categoryId === categoryId);
        let bCat = this.props.categories.find(({categoryId}) => b.categoryId === categoryId);
        if (!aCat) {
            return 1;
        }
        if (!bCat) {
            return -1;
        }
        if (aCat.categoryName < bCat.categoryName) {
            return -1;
        }
        if (aCat.categoryName > bCat.categoryName) {
            return 1;
        }
        return 1;
    }

    render() {
        let arrayToSort = this.props.shoppingListItems ? this.props.shoppingListItems.map(item => Object.assign({}, item)) : [];
        arrayToSort.sort(this.sortShoppingListCompare);
        let recipes = this.props.shoppingListRecipes.map(item => Object.assign({}, item));
        recipes.sort((a, b) => a.recipeName.localeCompare(b.recipeName));

        return (
            <div>
              <ShoppingListName shoppingListId={this.props.shoppingListId} />
              <div className="form-group row">
                <div className="col-sm-8">
                  <input className="form-control" id="shopping-list-item" placeholder="Add item..."
                         name="createItemInput"
                         onChange={this.handleInputChange}
                         onKeyPress={e => checkForEnterKey(e, this.handleCreateItem)}
                         value={this.state.createItemInput} />
                </div>
                <div className="col-sm-4">
                  <button onClick={this.handleCreateItem} className="btn btn-primary mb-2">Add</button>
                </div>
              </div>
              <div className="table-responsive" style={{minHeight: 200 + 'px'}}>
                <table className="table table-hover table-sm table-bordered">
                  <tbody>
                    {arrayToSort.map(item => <ShoppingListItem key={item.propKey} propKey={item.propKey} shoppingListItemId={item.shoppingListItemId}
                                                               shoppingListItemValue={item.shoppingListItemValue} shoppingListItemChecked={item.shoppingListItemChecked}
                                                               categoryId={item.categoryId}
                                                               shoppingListId={this.props.shoppingListId}/>)}
                  </tbody>
                </table>
              </div>
              <hr/>
              {recipes.length > 0 &&
               <div>
                 <h5>Recipes added to this list:</h5>
                 <ul>
                   {recipes.map(({recipeId, recipeName}) => <li key={recipeId}>{recipeName}</li>)}
                 </ul>
                 <hr/>
               </div>
              }
              <div className="row"><div className="shopping-list-footer">
                                     {this.props.isLoggedIn && <button className="btn btn-info" onClick={this.handleCreateNewList}>Create new list</button>}
                                     <button className="btn btn-warning" onClick={this.handleDeleteSelectedItems}>Delete selected items</button>
                                   </div></div>
            </div>
        );
    }
};

const shoppingListMapStateToProps = state => {
    const shoppingList = state.shoppingListItems.find(({shoppingListId}) => shoppingListId === state.currentShoppingListId);
    let shoppingListItems = [];
    if (shoppingList) {
        shoppingListItems = shoppingList.shoppingListItems;
    }
    return {
        shoppingListItems,
        categories: state.categories,
        isLoggedIn: state.isLoggedIn,
        shoppingListRecipes: state.currentShoppingListRecipes
    };
};

const ShoppingList = connect(shoppingListMapStateToProps, { createShoppingListItem, createShoppingList, deleteShoppingListSelectedItems })(ShoppingListComponent);

export {ShoppingList, ShoppingListComponent};

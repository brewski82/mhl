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

import React, { useState, useContext, useEffect } from 'react';
import { checkForEnterKey } from './Utils';
import { createShoppingListItem, generateDefaultShoppingListName, getCategories, createShoppingList, loadCurrentShoppingListOrCreateNew } from './api/actions';
import { ShoppingListName } from './ShoppingListName';
import { ShoppingListItem } from './ShoppingListItem';
import './ShoppingList.css';
import {IsLoggedInContext, CurrentShoppingListItemsContext, CurrentShoppingListIdContext, CurrentShoppingListItemsDispatchContext, CurrentShoppingListRecipesContext, SetNumberOfShoppingListItemsContext} from './App';

const CurrentShoppingListNameContext = React.createContext();
const CategoryListContext = React.createContext([]);

/**
 * Component for editing a shopping list. This is the default
 * component that will show on the home screen, even for user who are
 * not logged in.
 */
function ShoppingList(props) {
    const [createItemInput, setCreateItemInput] = useState('');
    const [currentShoppingListName, setCurrentShoppingListName] = useState(generateDefaultShoppingListName());
    const isLoggedIn = useContext(IsLoggedInContext);
    const {currentShoppingListId, setCurrentShoppingListId} = useContext(CurrentShoppingListIdContext);
    const currentShoppingListItems = useContext(CurrentShoppingListItemsContext);
    const currentShoppingListItemsDispatch  = useContext(CurrentShoppingListItemsDispatchContext);
    const currentShoppingListRecipes = useContext(CurrentShoppingListRecipesContext);
    const setNumberOfShoppingListItems = useContext(SetNumberOfShoppingListItemsContext);
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        (async () => {
            if (categoryList.length === 0) {
                const categories = await getCategories();
                setCategoryList(categories);
            }
            if (isLoggedIn) {
                if (currentShoppingListId === 0) {
                    const shoppingList = await loadCurrentShoppingListOrCreateNew();
                    setCurrentShoppingListId(shoppingList.shoppingListId);
                    setNumberOfShoppingListItems(shoppingList.shoppingListItems.length);
                }
            }
        })();
    }, [isLoggedIn]);

    useEffect(() => {
        setNumberOfShoppingListItems(currentShoppingListItems.length);
    });

    /**
     * Creates a new shopping list item.
     */
    const handleCreateItem = () => {
        if (createItemInput.length > 0) {
            createShoppingListItem(currentShoppingListId, createItemInput, isLoggedIn, currentShoppingListItemsDispatch);
            setCreateItemInput('');
        }
    };

    /**
     * Creates a new shopping list. The old list can still be accessed
     * by the "Lists" menu item. The new list is created with a
     * default shopping list name.
     */
    const handleCreateNewList = () => {
        createShoppingList(currentShoppingListItemsDispatch, setCurrentShoppingListId);
    };

    /**
     * Permanately deletes any marked shopping list items.
     */
    const handleDeleteSelectedItems = () => {
        currentShoppingListItemsDispatch({type: "delete selected items"});
    };

    /**
     * Function to determine the sort order of shopping list items.
     */
    const sortShoppingListCompare = (a, b) => {
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
        let aCat = categoryList.find(({categoryId}) => a.categoryId === categoryId);
        let bCat = categoryList.find(({categoryId}) => b.categoryId === categoryId);
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
    };

    let arrayToSort = currentShoppingListItems ? currentShoppingListItems.map(item => Object.assign({}, item)) : [];
    arrayToSort.sort(sortShoppingListCompare);
    let recipes = currentShoppingListRecipes.map(item => Object.assign({}, item));
    recipes.sort((a, b) => a.recipeName.localeCompare(b.recipeName));

    return (
        <div>
          <CurrentShoppingListNameContext.Provider value={{currentShoppingListName, setCurrentShoppingListName}}>
            <ShoppingListName />
          </CurrentShoppingListNameContext.Provider>
          <div className="form-group row">
            <div className="col-sm-8">
              <input className="form-control" id="shopping-list-item" placeholder="Add item..."
                     name="createItemInput"
                     onChange={e => setCreateItemInput(e.target.value)}
                     onKeyPress={e => checkForEnterKey(e, handleCreateItem)}
                     value={createItemInput} />
            </div>
            <div className="col-sm-4">
              <button onClick={handleCreateItem} className="btn btn-primary mb-2">Add</button>
            </div>
          </div>
          <CategoryListContext.Provider value={categoryList}>
            <div className="table-responsive" style={{minHeight: 200 + 'px'}}>
              <table className="table table-hover table-sm table-bordered">
                <tbody>
                  {arrayToSort.map(item => <ShoppingListItem key={item.propKey} propKey={item.propKey} item={item} shoppingListId={currentShoppingListId}/>)}
                </tbody>
              </table>
            </div>
          </CategoryListContext.Provider>
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
                       {isLoggedIn && <button className="btn btn-info" onClick={handleCreateNewList}>Create new list</button>}
                       <button className="btn btn-warning" onClick={handleDeleteSelectedItems}>Delete selected items</button>
                     </div></div>
        </div>
    );
};

export {ShoppingList, CurrentShoppingListNameContext, CategoryListContext};

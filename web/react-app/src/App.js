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

import React, { useEffect, useState, useReducer } from 'react';
import { AppRouter } from './AppRouter.js';
import { api } from './api/api';
import { loadCurrentShoppingListOrCreateNew, setSpinnerFunction } from './api/actions';
import './App.css';

export const IsLoggedInContext = React.createContext(false);
export const CurrentShoppingListIdContext = React.createContext({});
export const CurrentShoppingListItemsContext = React.createContext([]);
export const CurrentShoppingListItemsDispatchContext = React.createContext();
export const CurrentShoppingListRecipesContext = React.createContext([]);
export const CurrentShoppingListRecipesDispatchContext = React.createContext();
export const SpinnerContext = React.createContext('default');
export const SetSpinnerContext = React.createContext();
export const SetNumberOfShoppingListItemsContext = React.createContext();
export const NumberOfShoppingListItemsContext = React.createContext();

function currentShoppingListItemsReducer(state, action) {
    switch (action.type) {
    case 'add':
        if (state == null) {
            return [action.shoppingListItem];
        }
        return [...state, action.shoppingListItem];
    case 'init':
        return action.shoppingListItems;
    case 'update':
        return state.map(item => item.shoppingListItemId === action.shoppingListItem.shoppingListItemId ? action.shoppingListItem : item);
    case 'update id':
        return state.map(item => item.propKey === action.shoppingListItem.propKey ? action.shoppingListItem : item);
    case "delete selected items":
        return state.filter(item => !item.shoppingListItemChecked);
    default:
        throw new Error();
    }
}

function currentShoppingListRecipesReducer(state = [], action) {
    switch (action.type) {
    case "init":
        return action.recipes;
    case "add":
        return [...state, action.recipe];
    default:
        throw new Error();
    }
}

export function App(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [spinner, setSpinner] = useState('default');
    const [currentShoppingListId, setCurrentShoppingListId] = useState(0);
    const [currentShoppingListItems, currentShoppingListItemsDispatch] = useReducer(currentShoppingListItemsReducer, []);
    const [currentShoppingListRecipes, currentShoppingListRecipesDispatch] = useReducer(currentShoppingListRecipesReducer, []);
    const [numberOfShoppingListItems, setNumberOfShoppingListItems] = useState(0);
    setSpinnerFunction(setSpinner);

    useEffect(() => {
        (async () => {
            const {isLoggedIn} = await api.getLoginStatus();
            setIsLoggedIn(isLoggedIn);
            if (isLoggedIn) {
                if (currentShoppingListId === 0) {
                    const shoppingList = await loadCurrentShoppingListOrCreateNew();
                    console.log(shoppingList);
                    setCurrentShoppingListId(shoppingList.shoppingListId);
                    currentShoppingListItemsDispatch({type: 'init', shoppingListItems: shoppingList.shoppingListItems || []});
                }
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (isLoggedIn) {
                const recipes = await api.getShoppingListRecipes(currentShoppingListId);
                currentShoppingListRecipesDispatch({type: "init", recipes});
            }
        })();
    }, [currentShoppingListId]);

    return (
        <div className="App">
          <IsLoggedInContext.Provider value={isLoggedIn}>
            <CurrentShoppingListIdContext.Provider value={{currentShoppingListId, setCurrentShoppingListId}}>
              <CurrentShoppingListItemsContext.Provider value={currentShoppingListItems}>
                <CurrentShoppingListItemsDispatchContext.Provider value={currentShoppingListItemsDispatch}>
                  <CurrentShoppingListRecipesContext.Provider value={currentShoppingListRecipes}>
                    <CurrentShoppingListRecipesDispatchContext.Provider value={currentShoppingListRecipesDispatch}>
                      <SpinnerContext.Provider value={spinner}>
                        <SetSpinnerContext.Provider value={setSpinner}>
                          <NumberOfShoppingListItemsContext.Provider value={numberOfShoppingListItems}>
                            <SetNumberOfShoppingListItemsContext.Provider value={setNumberOfShoppingListItems}>
                              <AppRouter/>
                            </SetNumberOfShoppingListItemsContext.Provider>
                          </NumberOfShoppingListItemsContext.Provider>
                        </SetSpinnerContext.Provider>
                      </SpinnerContext.Provider>
                    </CurrentShoppingListRecipesDispatchContext.Provider>
                  </CurrentShoppingListRecipesContext.Provider>
                </CurrentShoppingListItemsDispatchContext.Provider>
              </CurrentShoppingListItemsContext.Provider>
            </CurrentShoppingListIdContext.Provider>
          </IsLoggedInContext.Provider>
        </div>
    );
}

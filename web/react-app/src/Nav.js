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

import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import {IsLoggedInContext, CurrentShoppingListIdContext, CurrentShoppingListItemsContext, SetNumberOfShoppingListItemsContext, NumberOfShoppingListItemsContext} from './App';
import { getShoppingListItems } from './api/actions';

export function Nav() {
    const isLoggedIn = useContext(IsLoggedInContext);
    const currentShoppingListItems = useContext(CurrentShoppingListItemsContext);
    const {currentShoppingListId} = useContext(CurrentShoppingListIdContext);
    const numberOfShoppingListItems = useContext(NumberOfShoppingListItemsContext);
    const setNumberOfShoppingListItems = useContext(SetNumberOfShoppingListItemsContext);
    const saveList = <NavLink to="/login/" className="nav-link" activeClassName='is-active' ><span className="main-save-list">Save List</span></NavLink>;
    const account = <NavLink to="/account/" className="nav-link" activeClassName='is-active' >Account</NavLink>;
    const logIn = <NavLink to="/login/" className="nav-link" activeClassName='is-active' >Log In</NavLink>;;

    useEffect(() => {
        (async () => {
            if (currentShoppingListId !== 0) {
                const shoppingListItems = getShoppingListItems(currentShoppingListId);
                if (shoppingListItems) {
                    setNumberOfShoppingListItems(shoppingListItems.length);
                }
            }
        })();
    }, [currentShoppingListId]);

    useEffect(() => {
        setNumberOfShoppingListItems(currentShoppingListItems.length);
    }, [currentShoppingListItems]);

    let accountDiv = logIn;
    if (isLoggedIn) {
        accountDiv = account;
    } else if (numberOfShoppingListItems > 0) {
        accountDiv = saveList;
    }
    return (
        <div>
          <SetNumberOfShoppingListItemsContext.Provider value={setNumberOfShoppingListItems}>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
              <a className="navbar-brand" href="/">My Honey's List</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <NavLink exact={true} to="/" className="nav-link" activeClassName='is-active' >Home</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/shopping-lists/" className="nav-link" activeClassName='is-active' >Lists</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/recipes/" className="nav-link" activeClassName='is-active' >Recipes</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/about/" className="nav-link" activeClassName='is-active' >About</NavLink>
                  </li>
                </ul>
                <ul className="navbar-nav mt-2 mt-md-0">
                  <li className="nav-item">
                    {accountDiv}
                  </li>
                </ul>
              </div>
            </nav>
          </SetNumberOfShoppingListItemsContext.Provider>
        </div>
    );
}

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

import React, {useContext, useState, useEffect} from 'react';
import { NavLink } from "react-router-dom";
import {IsLoggedInContext, CurrentShoppingListIdContext} from './App';
import {getShoppingLists} from './api/actions';

function ShoppingListRow(props) {
    const {setCurrentShoppingListId} = useContext(CurrentShoppingListIdContext);
    return (
        <li>
          {props.shoppingList.shoppingListName} - <NavLink to="/" onClick={() => setCurrentShoppingListId(props.shoppingList.shoppingListId)}>Use List</NavLink>
        </li>
    );
}

function ShoppingListContainer() {
    const isLoggedIn = useContext(IsLoggedInContext);
    const [isLoading, setIsLoading] = useState(true);
    const [shoppingLists, setShoppingLists] = useState([]);


    useEffect(() => {
        (async () => {
            if (isLoggedIn) {
                const lists = await getShoppingLists();
                setShoppingLists(lists);
                setIsLoading(false);
            }
        })();
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return (<div><p>Please login to see your shopping lists.</p></div>);
    }
    if (isLoading) {
        return (<div><p>Loading your shopping lists...</p></div>);
    }
    if (shoppingLists.length === 0) {
        return (<div><p>No shopping lists to display.</p></div>);
    }
    return (
        <ul>
          {shoppingLists.map((shoppingList, index) => (<ShoppingListRow key={index} shoppingList={shoppingList}/>))}
        </ul>
    );
};

// const ShoppingListContainer = connect((state) => ({shoppingLists: state.shoppingLists, isLoggedIn: state.isLoggedIn}), {changeCurrentShoppingListId})(ShoppingListContainerComponent);

export {ShoppingListContainer};

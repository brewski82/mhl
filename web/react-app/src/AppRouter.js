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
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Nav } from './Nav.js';
import { ShoppingList } from './ShoppingList';
import { ShoppingListContainer } from './ShoppingListContainer';
import { RecipeContainer } from './RecipeContainer';
import { Account } from './Account';
import { Login } from './Login';
import { Footer } from './Footer';
import { loadCategories, doLogin } from './redux/actions';

const About = () => <div>
                      <h2>About</h2>
                      <hr/>
                      <div>
                        <p>
                          My Honey's List aims to be the world's easiest grocery shopping list application! It was originally created when we couldn't find an app that met all of our particular needs, such as recipe managment and the ability to easily add recipe items to your shopping list. MHL sorts lists by category, making shopping more efficent. Newly added items are initially assigned a category automatically. MHL remembers category assignment, so the more you use it, the better it gets at guessing categories!
                        </p>
                        <p>
                          MHL is <a href="https://github.com/brewski82/mhl">open source software</a>.
                        </p>
                      </div>
                    </div>;

class AppRouterComponent extends React.Component {

    componentDidMount() {
        this.props.loadCategories();
        this.props.doLogin();
    }

    render() {
        return (
            <Router>
              <div className="container">
                <Nav/>
                <main role="main">
                  <Route path="/" exact render={props => (<ShoppingList shoppingListId={this.props.currentShoppingListId} {...props}/>)} />
                  <Route path="/shopping-lists/" exact component={ShoppingListContainer} />
                  <Route path="/recipes/" exact component={RecipeContainer} />
                  <Route path="/about/" exact component={About} />
                  <Route path="/account/" exact component={Account} />
                  <Route path="/login/" exact component={Login} />
                </main>
                <Footer/>
              </div>
            </Router>
        );}
}

const AppRouter = connect(state => ({currentShoppingListId: state.currentShoppingListId}), {loadCategories, doLogin})(AppRouterComponent);

export { AppRouter, AppRouterComponent };

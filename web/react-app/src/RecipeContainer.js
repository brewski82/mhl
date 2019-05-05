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
import './RecipeContainer.css';
import { handleInputChange, checkForEnterKey } from './Utils';
import { createRecipe, updateRecipe, loadRecipes, createRecipeItem, deleteRecipeItem, updateRecipeItem, loadRecipeItems, addRecipeToShoppingList } from './redux/actions';
import { connect } from "react-redux";

/**
 * Handles displaying the recipe in the recipe list.
 */
function RecipeRow(props) {
    return (
        <li>
          {props.recipe.recipeName} <button className="btn btn-link" onClick={() => props.editRecipe(props.recipe.recipeId)}>Edit</button>
          - <button className="btn btn-link" onClick={() => props.addItemsToList(props.recipe.recipeId)}>Add Recipe to Shopping List</button>
        </li>
    );
}

/**
 * Component used to edit a recipe. Users can modify the recipe name,
 * source, description, and add/delete/modify recipe ingredients.
 */
class EditRecipeComponent extends React.Component {
    constructor(props) {
        super(props);
        const recipe = props.recipes.find(({recipeId}) => recipeId === props.recipeId);
        const {recipeName = "New Recipe", recipeDescription = "", recipeSource = ""} = recipe;
        this.state = {showRecipeNameInput: false, recipeName, recipeDescription, recipeSource, recipeItemValue: "", showRecipeItemInputId: 0};
        this.handleInputChange = handleInputChange.bind(this);
    }

    /**
     * General function to update all attributes of a recipe sans
     * ingredients.
     */
    updateRecipe = () => {
        const recipeId = this.props.recipeId;
        let {recipeName, recipeDescription, recipeSource} = this.state;
        // Set to a default name if the user blanked the input.
        if (recipeName.length === 0) {
            recipeName = "New Recipe";
        }
        recipeName = recipeName.trim();
        this.props.updateRecipe(recipeId, recipeName, recipeDescription, recipeSource);
        this.setState({showRecipeNameInput: false, recipeName});
    }

    /**
     * Adds a recipe item/ingredient.
     */
    addRecipeItem = () => {
        if (this.state.recipeItemValue.length > 0 && this.state.recipeItemValue.trim().length > 0) {
            this.props.createRecipeItem(this.props.recipeId, this.state.recipeItemValue.trim());
            this.setState({recipeItemValue: ""});
        }
    }

    /**
     * Updates a recipe item/ingredient.
     */
    updateRecipeItem = (recipeItemId, recipeItemValue) => {
        if (recipeItemValue.length > 0 && recipeItemValue.trim().length > 0) {
            this.props.updateRecipeItem(this.props.recipeId, recipeItemId, recipeItemValue);
        }
        this.setState({showRecipeItemInputId: 0});
    }

    componentDidMount() {
        this.props.loadRecipeItems(this.props.recipeId);
    }

    render() {
        let recipeDescription = this.state.recipeDescription ? this.state.recipeDescription : "";
        let recipeSource = this.state.recipeSource ? this.state.recipeSource : "";
        let recipeItems = [];
        if (this.props.recipeItems) {
            const recipe = this.props.recipeItems.find(({recipeId}) => recipeId === this.props.recipeId);
            if (recipe) {
                recipeItems = recipe.recipeItems;
            }
        }
        return (
            <div className="recipe-edit">
              <hr/>
              {this.state.showRecipeNameInput ? (
                  <input className="form-control recipe-edit-name" id="recipe-name-input"
                         name="recipeName"
                         onChange={this.handleInputChange}
                         onKeyPress={e => checkForEnterKey(e, this.updateRecipe)}
                         onBlur={this.updateRecipe}
                         value={this.state.recipeName} />

              ) : (
                  <h3 onClick={() => this.setState({showRecipeNameInput: true})}>{this.state.recipeName}</h3>
              )}
              <div className="form-group row">
                <div className="recipe-label">Source: </div>
                <div className="col-sm-10">
                  <input className="form-control" id="recipe-source-input"
                         name="recipeSource"
                         onChange={this.handleInputChange}
                         onKeyPress={e => checkForEnterKey(e, this.updateRecipe)}
                         onBlur={this.updateRecipe}
                         value={recipeSource} />
                </div>
              </div>
              <div className="form-group row">
                <div className="recipe-label">Description: </div>
                <div className="col-sm-10">
                  <textarea className="form-control" id="recipe-description-input"
                            name="recipeDescription"
                            onChange={this.handleInputChange}
                            onKeyPress={e => checkForEnterKey(e, this.updateRecipe)}
                            onBlur={this.updateRecipe}
                            value={recipeDescription} />
                </div>
              </div>
              <div className="form-group row recipe-item">
                <div className="col-sm-10">
                  <input className="form-control" id="recipe-item" placeholder="Add recipe item..."
                         name="recipeItemValue"
                         onChange={this.handleInputChange}
                         onKeyPress={e => checkForEnterKey(e, this.addRecipeItem)}
                         value={this.state.recipeItemValue} />
                </div>
                <button onClick={this.addRecipeItem} className="btn btn-primary mb-2">Add</button>
              </div>
              <div>
                <table className="table table-hover table-sm table-bordered">
                  <tbody>
                    {recipeItems.map(({recipeItemId, recipeItemValue}) =>
                                     <tr key={recipeItemId}>
                                       {this.state.showRecipeItemInputId === recipeItemId ?
                                        <td>
                                          <input className="form-control recipe-edit-item" id="recipe-item-edit"
                                                 name="recipeItemEdit"
                                                 onKeyPress={e => checkForEnterKey(e, () => this.updateRecipeItem(recipeItemId, e.target.value))}
                                                 onBlur={e => this.updateRecipeItem(recipeItemId, e.target.value)}
                                                 defaultValue={recipeItemValue} />
                                        </td>
                                        :
                                        <td onClick={() => this.setState({showRecipeItemInputId: recipeItemId})}>{recipeItemValue}</td>
                                       }
                                       <td className="recipe-item-delete">
                                         <button className="btn btn-warning" onClick={() => this.props.deleteRecipeItem(this.props.recipeId, recipeItemId)}>Delete Item</button>
                                       </td>
                                     </tr>
                                    )}
                  </tbody>
                </table>
              </div>
              <hr/>
              <button className="btn btn-info" onClick={() => this.props.showRecipeList()}>Back to recipe list</button>
            </div>
        );
    }
}

const EditRecipe = connect((state) => ({recipes: state.recipes, recipeItems: state.recipeItems}), {updateRecipe, createRecipeItem, deleteRecipeItem, updateRecipeItem, loadRecipeItems})(EditRecipeComponent);

/**
 * Main component for the Recipe page. Defaults to displaying a list
 * of all the user's recipes.
 */
class RecipeContainerComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showList: true };
    }

    /**
     * Function to switch from the recipe list view to the view for
     * editing a single recipe.
     */
    editRecipe = (recipeId) => {
        this.setState({showList: false, recipeId});
    }

    /**
     * Adds all of the recipe's ingredients to the current shopping
     * list.
     */
    addItemsToList = (recipeId) => {
        this.props.addRecipeToShoppingList(recipeId, this.props.currentShoppingListId);
    }

    /**
     * Switches from the edit recipe view to the recipe list view.
     */
    showRecipeList = () => {
        this.setState({showList: true});
    }

    /**
     * Creates a new recipe and switches to the edit recipe view.
     */
    createRecipe = async () => {
        const recipeId = await this.props.createRecipe();
        this.editRecipe(recipeId);
    }

    componentDidMount() {
        if (this.props.isLoggedIn) {
            this.props.loadRecipes();
        }
    }

    render() {
        if (!this.props.isLoggedIn) {
            return (<div><p>Please login to see your recipes.</p></div>);
        }
        if (this.state.showList) {
            return (
                <div>
                  <h2>Recipes</h2>
                  <hr/>
                  <button className="btn btn-info" onClick={this.createRecipe}>Create New Recipe</button>
                  <hr/>
                  <ul>
                    {this.props.recipes.map((recipe, index) => (
                        <RecipeRow key={index} recipe={recipe} editRecipe={this.editRecipe}  addItemsToList={this.addItemsToList}/>
                    ))}
                  </ul>
                </div>
            );
        }
        return (
            <EditRecipe recipeId={this.state.recipeId}
                        showRecipeList={this.showRecipeList}/>
        );
    }
};

const RecipeContainer = connect((state) => ({recipes: state.recipes, isLoggedIn: state.isLoggedIn, currentShoppingListId: state.currentShoppingListId}), {createRecipe, loadRecipes, addRecipeToShoppingList})(RecipeContainerComponent);

export {RecipeContainer, RecipeContainerComponent, RecipeRow, EditRecipe, EditRecipeComponent};

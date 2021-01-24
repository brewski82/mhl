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

import React, { useState, useEffect, useContext } from 'react';
import './RecipeContainer.css';
import { checkForEnterKey } from './Utils';
import { createRecipe, updateRecipe, loadRecipes, createRecipeItem, deleteRecipeItem, updateRecipeItem, addRecipeToShoppingList, getRecipe, getRecipeItems } from './api/actions';
import {IsLoggedInContext, CurrentShoppingListIdContext, CurrentShoppingListRecipesDispatchContext} from './App';

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
function EditRecipe(props) {
    const [recipeName, setRecipeName] = useState('New Recipe');
    const [recipeDescription, setRecipeDescription] = useState('');
    const [recipeSource, setRecipeSource] = useState('');
    const [recipeItemValue, setRecipeItemValue] = useState('');
    const [recipeItems, setRecipeItems] = useState([]);
    const [showRecipeNameInput, setShowRecipeNameInput] = useState(false);
    const [showRecipeItemInputId, setShowRecipeItemInputId] = useState(0);
    const isLoggedIn = useContext(IsLoggedInContext);

    useEffect(() => {
        (async () => {
            if (isLoggedIn) {
                const {recipeName, recipeDescription, recipeSource} = await getRecipe(props.recipeId);
                if (recipeName) {
                    setRecipeName(recipeName);
                    setRecipeDescription(recipeDescription);
                    setRecipeSource(recipeSource);
                    const recipeItems = await getRecipeItems(props.recipeId);
                    if (recipeItems) {
                        setRecipeItems(recipeItems);
                    }
                }
            }
        })();
    }, []);

    /**
     * General function to update all attributes of a recipe sans
     * ingredients.
     */
    const doUpdateRecipe = async () => {
        const recipeId = props.recipeId;
        let newRecipeName = "New Recipe";
        if (recipeName.trim().length > 0) {
            newRecipeName = recipeName.trim();
        }
        await updateRecipe(recipeId, newRecipeName, recipeDescription, recipeSource);
        setRecipeName(newRecipeName);
        setShowRecipeNameInput(false);
    };

    /**
     * Adds a recipe item/ingredient.
     */
    const addRecipeItem = async () => {
        if (recipeItemValue.length > 0 && recipeItemValue.trim().length > 0) {
            const value = recipeItemValue.trim();
            setRecipeItemValue('');
            const recipeItemId = await createRecipeItem(props.recipeId, value);
            setRecipeItems(prevRecipeItems => [...prevRecipeItems, {recipeItemId, recipeItemValue: recipeItemValue.trim()}]);
        }
    };

    /**
     * Deletes a recipe item.
     */
    const deleteItem = async (recipeItemId) => {
        await deleteRecipeItem(props.recipeId, recipeItemId);
        setRecipeItems(recipeItems.filter(id => id.recipeItemId !== recipeItemId));
    };

    /**
     * Updates a recipe item/ingredient.
     */
    const doUpdateRecipeItem = async (recipeItemId, recipeItemValue) => {
        if (recipeItemValue.length > 0 && recipeItemValue.trim().length > 0) {
            await updateRecipeItem(props.recipeId, recipeItemId, recipeItemValue);
            setRecipeItems(prevRecipeItems => prevRecipeItems.map(recipeItem => recipeItem.recipeItemId === recipeItemId ? {recipeItemId, recipeItemValue} : recipeItem));
        }
        setShowRecipeItemInputId(0);
    };

    const recipeNameInputDiv = <input className="form-control recipe-edit-name" id="recipe-name-input"
                                      name="recipeName"
                                      onChange={e => setRecipeName(e.target.value)}
                                      onKeyPress={e => checkForEnterKey(e, doUpdateRecipe)}
                                      onBlur={doUpdateRecipe}
                                      value={recipeName} />;

    const recipeNameInputHiddenDiv = <h3 onClick={() => setShowRecipeNameInput(true)}>{recipeName}</h3>;

    const recipeSourceDiv = <div className="form-group row">
               <div className="recipe-label">Source: </div>
               <div className="col-sm-10">
                 <input className="form-control" id="recipe-source-input"
                        name="recipeSource"
                        onChange={e => setRecipeSource(e.target.value)}
                        onKeyPress={e => checkForEnterKey(e, doUpdateRecipe)}
                        onBlur={doUpdateRecipe}
                        value={recipeSource} />
               </div>
             </div>;

    const recipeDescriptionDiv = <div className="form-group row">
                   <div className="recipe-label">Description: </div>
                                   <div className="col-sm-10">
                                     <textarea className="form-control" id="recipe-description-input"
                                               name="recipeDescription"
                                               onChange={e => setRecipeDescription(e.target.value)}
                                               onKeyPress={e => checkForEnterKey(e, doUpdateRecipe)}
                                               onBlur={doUpdateRecipe}
                                               value={recipeDescription} />
                                   </div>
                                 </div>;

    const addRecipeItemDiv = <div className="form-group row recipe-item">
                                                 <div className="col-sm-10">
                                                   <input className="form-control" id="recipe-item" placeholder="Add recipe item..."
                                                          name="recipeItemValue"
                                                          onChange={e => setRecipeItemValue(e.target.value)}
                                                          onKeyPress={e => checkForEnterKey(e, addRecipeItem)}
                                                          value={recipeItemValue} />
                                                 </div>
                               <button onClick={addRecipeItem} className="btn btn-primary mb-2">Add</button>
                             </div>;

    return (
        <div className="recipe-edit">
          <hr/>
          {showRecipeNameInput ? recipeNameInputDiv : recipeNameInputHiddenDiv}
          {recipeSourceDiv}
          {recipeDescriptionDiv}
          {addRecipeItemDiv}
          <div>
            <table className="table table-hover table-sm table-bordered">
              <tbody>
                {recipeItems.map(({recipeItemId, recipeItemValue}, index) =>
                    <tr key={index}>
                      {showRecipeItemInputId === recipeItemId ?
                       <td>
                         <input className="form-control recipe-edit-item" id="recipe-item-edit"
                                name="recipeItemEdit"
                                onKeyPress={e => checkForEnterKey(e, () => doUpdateRecipeItem(recipeItemId, e.target.value))}
                                onBlur={e => doUpdateRecipeItem(recipeItemId, e.target.value)}
                                defaultValue={recipeItemValue} />
                       </td>
                       :
                       <td onClick={() => setShowRecipeItemInputId(recipeItemId)}>{recipeItemValue}</td>
                      }
                      <td className="recipe-item-delete">
                        <button className="btn btn-warning" onClick={() => deleteItem(recipeItemId)}>Delete Item</button>
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
          <hr/>
          <button className="btn btn-info" onClick={() => props.showRecipeList()}>Back to recipe list</button>
        </div>
    );
}


/**
 * Main component for the Recipe page. Defaults to displaying a list
 * of all the user's recipes.
 */
function RecipeContainer() {
    const [{showList, recipeId}, setState] = useState({showList: true, recipeId: 0});
    const [recipes, setRecipes] = useState([]);
    const isLoggedIn = useContext(IsLoggedInContext);
    const { currentShoppingListId } = useContext(CurrentShoppingListIdContext);
    const currentShoppingListRecipesDispatch = useContext(CurrentShoppingListRecipesDispatchContext);

    useEffect(() => {
        (async () => {
            if (isLoggedIn) {
                const recipes = await loadRecipes();
                setRecipes(recipes);
            }
        })();
    }, [isLoggedIn]);

    /**
     * Function to switch from the recipe list view to the view for
     * editing a single recipe.
     */
    const editRecipe = (recipeId) => {
        setState({showList: false, recipeId});
    };

    /**
     * Adds all of the recipe's ingredients to the current shopping
     * list.
     */
    const addItemsToList = async (recipeId) => {
        addRecipeToShoppingList(recipeId, currentShoppingListId);
        const recipe = await getRecipe(recipeId);
        currentShoppingListRecipesDispatch({type: "add", recipe});
    };

    /**
     * Switches from the edit recipe view to the recipe list view.
     */
    const showRecipeList = () => {
        setState(prevState => ({...prevState, showList: true}));
    };

    /**
     * Creates a new recipe and switches to the edit recipe view.
     */
    const createNewRecipe = async () => {
        const recipeId = await createRecipe();
        editRecipe(recipeId);
    };

    if (!isLoggedIn) {
        return (<div><p>Please login to see your recipes.</p></div>);
    }
    if (showList) {
        return (
            <div>
              <h2>Recipes</h2>
              <hr/>
              <button className="btn btn-info" onClick={createNewRecipe}>Create New Recipe</button>
              <hr/>
              <ul>
                {recipes.map((recipe, index) => (
                    <RecipeRow key={index} recipe={recipe} editRecipe={() => editRecipe(recipe.recipeId)}  addItemsToList={() => addItemsToList(recipe.recipeId)}/>
                ))}
              </ul>
            </div>
        );
    }
    return (
        <EditRecipe recipeId={recipeId} showRecipeList={showRecipeList}/>
    );
};

export {RecipeContainer, RecipeRow, EditRecipe};

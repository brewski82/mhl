/**
These tests must be run with the jest option --runInBand so they run
sequentially, as most of the tests depend on state changes from prior
tests.
**/
const superagent = require('superagent');
const agent = superagent.agent();
const { Client } = require('pg');
const email = "test@example.com";
const webPort = process.env.MHL_WEB_PORT;
const apiUrl = 'http://localhost:' + webPort + '/api/';

async function query(text, params, callback) {
    const client = new Client(
        {
            database: "mhl",
            user: "postgres",
            host: "localhost",
            port: process.env.MHL_DB_PORT
        }
    );
    await client.connect();
    const result = await client.query(text, params, callback);
    await client.end();
    return result;
}

function fetchGet(url) {
    return agent.get(apiUrl + url);
}

function fetchDel(url, body) {
    return agent.delete(apiUrl + url).send(body);
}

function fetchPost(url, body) {
    return agent.post(apiUrl + url).send(body);
}

function fetchPut(url, body) {
    return agent.put(apiUrl + url).send(body);
}

test('/account/emails post requires authentication', async () => {
    await expect(fetchPost('account/emails')).rejects.toThrow('Unauthorized');
});

test('/account/emails del requires authentication', async () => {
    await expect(fetchDel('account/emails')).rejects.toThrow('Unauthorized');
});

test('/account/emails get requires authentication', async () => {
    await expect(fetchGet('account/emails')).rejects.toThrow('Unauthorized');
});

test('/account/session del does not requires authentication', async () => {
    let result = await fetchDel('account/session');
    expect(result.body.deactivated).toBeTruthy();
});

test('/account del requires authentication', async () => {
    await expect(fetchDel('account')).rejects.toThrow('Unauthorized');
});

test('/categories/id/:item does not requires authentication', async () => {
    let result = await fetchGet('categories/id/:item');
    expect(result.body).toHaveProperty('categoryId');
});

test('/categories/name/:categoryId does not requires authentication', async () => {
    let result = await fetchGet('categories/name/1');
    await expect(result.status).toEqual(200);
});

test('/categories does not require authentication', async () => {
    let result = await fetchGet('categories');
    await expect(result.status).toEqual(200);
});

test('/shopping-lists get requires authentication', async () => {
    await expect(fetchGet('shopping-lists')).rejects.toThrow('Unauthorized');
});

test('/shopping-lists/:shoppingListId put requires authentication', async () => {
    await expect(fetchPut('shopping-lists/1')).rejects.toThrow('Unauthorized');
});

test('/shopping-lists/:shoppingListId get requires authentication', async () => {
    await expect(fetchGet('shopping-lists/1')).rejects.toThrow('Unauthorized');
});

test('/shopping-lists/:shoppingListId/items post requires authentication', async () => {
    await expect(fetchPost('shopping-lists/1/items', {item: "milk"})).rejects.toThrow('Unauthorized');
});

test('/shopping-lists/:shoppingListId/items get requires authentication', async () => {
    await expect(fetchGet('shopping-lists/1/items')).rejects.toThrow('Unauthorized');
});

test('/shopping-lists/:shoppingListId/items/:itemId put requires authentication', async () => {
    await expect(fetchPut('shopping-lists/1/items/1')).rejects.toThrow('Unauthorized');
});

test('/shopping-lists/:shoppingListId/recipes post requires authentication', async () => {
    await expect(fetchPost('shopping-lists/1/recipes')).rejects.toThrow('Unauthorized');
});

test('/shopping-lists/:shoppingListId/recipes get requires authentication', async () => {
    await expect(fetchGet('shopping-lists/1/recipes')).rejects.toThrow('Unauthorized');
});

test('/recipes/:recipeId del requires authentication', async () => {
    await expect(fetchDel('recipes/1')).rejects.toThrow('Unauthorized');
});

test('/recipes/:recipeId put requires authentication', async () => {
    await expect(fetchPut('recipes/1')).rejects.toThrow('Unauthorized');
});
test('/recipes post requires authentication', async () => {
    await expect(fetchPost('recipes')).rejects.toThrow('Unauthorized');
});
test('/recipes get requires authentication', async () => {
    await expect(fetchGet('recipes')).rejects.toThrow('Unauthorized');
});
test('/recipes/:recipeId get requires authentication', async () => {
    await expect(fetchGet('recipes/1')).rejects.toThrow('Unauthorized');
});
test('/recipes/:recipeId/items get requires authentication', async () => {
    await expect(fetchGet('recipes/1/items')).rejects.toThrow('Unauthorized');
});
test('/recipes/:recipeId/items post requires authentication', async () => {
    await expect(fetchPost('recipes/1/items')).rejects.toThrow('Unauthorized');
});
test('/recipes/:recipeId/items/:itemId get requires authentication', async () => {
    await expect(fetchGet('recipes/1/items/1')).rejects.toThrow('Unauthorized');
});
test('/recipes/:recipeId/items/:itemId del requires authentication', async () => {
    await expect(fetchDel('recipes/1/items/1')).rejects.toThrow('Unauthorized');
});
test('/recipes/:recipeId/items/:itemId put requires authentication', async () => {
    await expect(fetchPut('recipes/1/items/1')).rejects.toThrow('Unauthorized');
});

test('/shopping-lists post requires authentication', async () => {
    await expect(fetchPost('shopping-lists')).rejects.toThrow('Unauthorized');
});

test('Login', async () => {
    expect.assertions(4);
    let result = await fetchGet('login-status');
    expect(result.body.isLoggedIn).toBeFalsy();
    result = await fetchPost('login', {email});
    expect(result.body.emailSent).toBeTruthy();
    result = await fetchGet('login-status');
    expect(result.body.isLoggedIn).toBeFalsy();
    result = await query('select uuid from login where email = $1 order by login_id desc limit 1',
                         [email]);
    result = await fetchGet('login/' + result.rows[0].uuid);
    result = await fetchGet('login-status');
    expect(result.body.isLoggedIn).toBeTruthy();
});

test('Is still logged in', async () => {
    expect.assertions(1);
    let result = await fetchGet('login-status');
    expect(result.body.isLoggedIn).toBeTruthy();
});

test('Get account emails', async () => {
    let result = await fetchGet('/account/emails');
    expect(result.body).toContainEqual({email});
    expect(result.body.length).toEqual(1);
});

test('Create new account email', async () => {
    let newEmail = "new@example.com";
    await fetchPost('account/emails', {email: newEmail});
    let result = await query('select uuid from login order by login_id desc limit 1');
    const uuid = result.rows[0].uuid;
    result = await query('select account_email_id as "accountEmailId" from account_email order by account_email_id desc limit 1');
    const accountEmailId = result.rows[0].accountEmailId;
    await fetchGet(`account/emails/${accountEmailId}/${uuid}`);
    result = await fetchGet('/account/emails');
    expect(result.body).toContainEqual({email});
    expect(result.body).toContainEqual({email: newEmail});
    expect(result.body.length).toEqual(2);
});

test('Delete account email', async () => {
    let newEmail = "new@example.com";
    await fetchDel('account/emails', {email: newEmail});
    let result = await fetchGet('/account/emails');
    expect(result.body).toContainEqual({email});
    expect(result.body.length).toEqual(1);
});

test('Create new shopping list', async () => {
    let result = await fetchPost('shopping-lists', {name: "my list"});
    expect(result.body).toHaveProperty('shoppingListId');
});

let shoppingListId = 0;
test('Create new shopping list with items', async () => {
    let result = await fetchPost('shopping-lists', {name: "my list", items: [{item: "milk", categoryId: 1}, {item: "cheese", categoryId: 2}]});
    expect(result.body).toHaveProperty('shoppingListId');
    shoppingListId = result.body.shoppingListId;
});

test('Get shopping lists', async () => {
    // At this point we should have two shopping lists, but sometimes
    // when developing tests we will have more. Thus, just check that
    // we have more than one shopping list.
    let result = await fetchGet('shopping-lists');
    expect(result.body.length > 1).toBeTruthy();
});

test('Update shopping list', async () => {
    let result = await fetchPut('shopping-lists/' + shoppingListId, {name: "new name"});
    expect(result.body).toEqual({shoppingListUpdated: true});
    result = await fetchGet('shopping-lists/' + shoppingListId);
    expect(result.body).toHaveProperty('shoppingListId', shoppingListId);
    expect(result.body).toHaveProperty('shoppingListName', "new name");
});

let shoppingListItemId = 0;
test('Create shopping list item', async () => {
    let result = await fetchPost(`shopping-lists/${shoppingListId}/items`, {item: "apples"});
    expect(result.body).toHaveProperty('shoppingListItemId');
    shoppingListItemId = result.body.shoppingListItemId;
});

test('Get all items for shopping list', async () => {
    // At this point our shopping list should have three items.
    let result = await fetchGet(`shopping-lists/${shoppingListId}/items`);
    expect(result.body.length).toBe(3);
});

test('Update a single shopping list item', async () => {
    let url = `shopping-lists/${shoppingListId}/items/${shoppingListItemId}`;
    let result = await fetchPut(url, {item: "oranges", categoryId: 1, isChecked: false});
    expect(result.body).toEqual({itemUpdated: true});
    result = await fetchGet(`shopping-lists/${shoppingListId}/items`);
    expect(result.body).toContainEqual({shoppingListItemValue: "oranges", categoryId: "1", shoppingListItemChecked: false, shoppingListId, shoppingListItemId});
});

let recipeId = 0;
test('Create recipe', async () => {
    let result = await fetchPost('recipes');
    expect(result.body).toHaveProperty('recipeId');
    recipeId = result.body.recipeId;
});

test('Update recipe', async () => {
        let result = await fetchPut('recipes/' + recipeId, {name: "my recipe", description: "", source: ""});
        expect(result.body).toEqual({recipeUpdated: true});
});

test('Get single recipe', async () => {
    let result = await fetchGet('recipes/' + recipeId);
    expect(result.body).toEqual({recipeId, recipeName: "my recipe", recipeDescription: "", recipeSource: ""});
});

test('Get all recipes', async () => {
    await fetchPost('recipes');
    let result = await fetchGet('recipes');
    // At this point we should have two recipes, but sometimes during
    // dev we do not reset state, so just check that we have at least
    // two recipes.
    expect(result.body.length > 1).toBeTruthy();
    let foundRecipe = false;
    result.body.map(({recipeName}) => {
        if (recipeName === "my recipe") {
            foundRecipe = true;
        }
    });
    expect(foundRecipe).toBeTruthy();

});

let recipeItemId = 0;
test('Create recipe item', async () => {
    let result = await fetchPost(`recipes/${recipeId}/items`, {item: "cheese"});
    expect(result.body).toHaveProperty('recipeItemId');
    recipeItemId = result.body.recipeItemId;
});

test('Get recipe items', async () => {
    let result = await fetchGet(`recipes/${recipeId}/items`);
    expect(result.body.length).toBe(1);
    expect(result.body[0].recipeItemValue).toEqual("cheese");
});

test('Get single recipe item', async () => {
    let result = await fetchGet(`recipes/${recipeId}/items/${recipeItemId}`);
    expect(result.body.recipeItemValue).toEqual("cheese");
});

test('Update recipe item', async () => {
    let result = await fetchPut(`recipes/${recipeId}/items/${recipeItemId}`, {item: "sugar"});
    expect(result.body).toEqual({itemUpdated: true});
    result = await fetchGet(`recipes/${recipeId}/items/${recipeItemId}`);
    expect(result.body.recipeItemValue).toEqual("sugar");
});

test('Delete recipe item', async () => {
    let result = await fetchDel(`recipes/${recipeId}/items/${recipeItemId}`);
    expect(result.body).toEqual({itemDeleted: true});
    result = await fetchGet(`recipes/${recipeId}/items`);
    expect(result.body.length).toBe(0);
});

test('Add recipe to shopping list', async () => {
    // First lets add an item to our recipe.
    await fetchPost(`recipes/${recipeId}/items`, {item: "butter"});
    let result = await fetchPost(`shopping-lists/${shoppingListId}/recipes`, {recipeId});
    expect(result.body).toEqual({copiedRecipeItems: true});
});

test('Get shopping list recipes', async () => {
    let result = await fetchGet(`shopping-lists/${shoppingListId}/recipes`);
    expect(result.body.length).toBe(1);
    expect(result.body[0].recipeId).toBe(recipeId);
    result = await fetchGet(`shopping-lists/${shoppingListId}/items`);
    let found = false;
    result.body.map(({shoppingListItemValue}) => {
        if (shoppingListItemValue === "butter") {
            found = true;
        }
    });
    expect(found).toBeTruthy();
});

test('Delete recipe', async () => {
    await fetchDel('recipes/' + recipeId);
    let result = await fetchGet('recipes');
    result.body.map(recipe => {
        expect(recipe.recipeId !== recipeId).toBeTruthy();
    });
});

test('Logout', async () => {
    let result = await fetchDel('account/session');
    expect(result.body).toEqual({deactivated: true});
    await expect(fetchPost('account/emails')).rejects.toThrow('Unauthorized');
});

test('Delete account', async () => {
    let result = await fetchGet('login-status');
    expect(result.body.isLoggedIn).toBeFalsy();
    result = await fetchPost('login', {email});
    expect(result.body.emailSent).toBeTruthy();
    result = await fetchGet('login-status');
    expect(result.body.isLoggedIn).toBeFalsy();
    result = await query('select uuid from login where email = $1 order by login_id desc limit 1',
                         [email]);
    let uuid = result.rows[0].uuid;
    result = await fetchGet('login/' + uuid);
    result = await fetchGet('login-status');
    expect(result.body.isLoggedIn).toBeTruthy();
    // Confirm we have shopping lists
    result = await fetchGet('shopping-lists');
    expect(result.body.length > 1).toBeTruthy();
    result = await fetchDel('account');
    expect(result.body).toEqual({deactivated: true});
    await expect(fetchPost('account/emails')).rejects.toThrow('Unauthorized');
    result = await fetchGet('login/' + uuid);
    result = await fetchGet('login-status');
    expect(result.body.isLoggedIn).toBeTruthy();
    // This should have created a new account. Confirm we do not have
    // shopping lists.
    result = await fetchGet('shopping-lists');
    expect(result.body.length > 1).toBeFalsy();
});

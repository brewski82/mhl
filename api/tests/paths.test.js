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

const request = require('supertest');
const errs = require('restify-errors');
const restify = require('restify');
const sessions = require("client-sessions");
const HandlerContainer = require('../handlers');
const config = require('config');
const db = {query: jest.fn()};
let emailTransporter = {sendMail: email => console.log('Sent email: ' + email) };
const handlerContainer = new HandlerContainer(db, errs, emailTransporter, config);
const server = restify.createServer();
const createPaths = require('../paths');

beforeAll(() => {
    server.use(sessions({
        cookieName: 'session',
        secret: 'test_secret',
        duration: 365 * 24 * 60 * 60 * 1000
    }));
    server.use(restify.plugins.bodyParser());
    createPaths(server, handlerContainer);
    server.listen(8081, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
});

afterAll(() => server.close());

beforeEach(() => {
    jest.resetAllMocks();
});

async function doLogin(agent) {
    db.query.mockResolvedValue({rows: [ {account_id: 1}]});
    const response = await agent.get('/login/uuid');
    return response;
}

test('Post email', async () => {
    expect.assertions(2);
    db.query.mockResolvedValue({rows: [ {uuid: "id"}]});
    const response = await request(server).post('/login').send({email: "a@example.com"});
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({emailSent: true});
});

test('Do login', async () => {
    expect.assertions(2);
    db.query.mockResolvedValue({rows: [ {account_id: 1}]});
    const response = await request(server).get('/login/uuid');
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.statusCode).toBe(302);
});

test('Verify new email address', async () => {
    expect.assertions(2);
    db.query.mockResolvedValue({rows: [ {account_id: 1}]});
    const response = await request(server).get('/account/emails/1/uuid');
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.statusCode).toBe(302);
});

test('Get shopping lists', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"}]});
    const response = await agent.get('/shopping-lists').send();
    expect(response.body).toEqual([{shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"}]);
});

test('Get shopping list', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"}]});
    const response = await agent.get('/shopping-lists/1').send();
    expect(response.body).toEqual({shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"});
});

test('Create shopping list', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [ {shopping_list_id: 1}]});
    const response = await agent.post('/shopping-lists').send({name: "name"});
    expect(response.body).toEqual({shoppingListId: 1});
});

test('Create shopping list with items', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [ {shopping_list_id: 1}]});
    const response = await agent.post('/shopping-lists').send({name: "name", items: [{item: "milk", category: "dairy"}]});
    expect(response.body).toEqual({shoppingListId: 1});
});

test('Create shopping list encounter error', async () => {
    expect.assertions(2);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockRejectedValue(new Error('db error')); // No shoppign list created.
    const response = await agent.post('/shopping-lists').send({name: "name", items: [{item: "milk", category: "dairy"}]});
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('code', 'InternalServer');
});

test('Update shopping list', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.put('/shopping-lists/1').send({name: "name"});
    expect(response.body).toEqual({shoppingListUpdated: true});
});

test('Get shopping list items', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{shoppingListItemId: 1, shoppingListId: 1, categoryId: 1, shoppingListItemValue: "milk", shoppingListItemChecked: "true"}]});
    const response = await agent.get('/shopping-lists/1/items').send();
    expect(response.body).toEqual([{shoppingListItemId: 1, shoppingListId: 1, categoryId: 1, shoppingListItemValue: "milk", shoppingListItemChecked: "true"}]);
});

test('Get shopping list recipes', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name"} ]});
    const response = await agent.get('/shopping-lists/1/recipes').send();
    expect(response.body).toEqual([{recipeId: 1, recipeName: "name"} ]);
});

test('Get recipes', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""} ]});
    const response = await agent.get('/recipes').send();
    expect(response.body).toEqual([{recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""} ]);
});

test('Get recipe', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""} ]});
    const response = await agent.get('/recipes/1').send();
    expect(response.body).toEqual({recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""});
});

test('Add account email', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{accountEmailId: 1, uuid: 'x'}]});
    const response = await agent.post('/account/emails').send({email: "y@y.com"});
    expect(response.body).toEqual({emailAdded: true});
});

test('Get emails', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{email: "x@x.com"}]});
    const response = await agent.get('/account/emails').send();
    expect(response.body).toEqual([{email: "x@x.com"}]);
});

test('Add account email encounter error', async () => {
    expect.assertions(2);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockRejectedValue(new Error('db error')); // No shoppign list created.
    const response = await agent.post('/account/emails').send({email: "y@y.com"});
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('code', 'InternalServer');
});

test('Get category id missing item', async () => {
    expect.assertions(2);
    const agent = request.agent(server);
    db.query.mockResolvedValue({rows: [{category_id: 1}]});
    const response = await agent.get('/categories/id/').send();
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('code', 'InvalidArgument');
});

test('Get category id no session', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    db.query.mockResolvedValue({rows: [{category_id: 1}]});
    const response = await agent.get('/categories/id/milk').send();
    expect(response.body).toEqual({categoryId: 1});
});

test('Get category id with session', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{category_id: 1}]});
    const response = await agent.get('/categories/id/sugar').send();
    expect(response.body).toEqual({categoryId: 1});
});

test('Get categories', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    db.query.mockResolvedValue({rows: [{categoryId: 1, cateogryName: "Default"}]});
    const response = await agent.get('/categories').send();
    expect(response.body).toEqual([{categoryId: 1, cateogryName: "Default"}]);
});

test('Get category id with space', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{category_id: 1}]});
    const response = await agent.get('/categories/id/ice cream').send();
    expect(response.body).toEqual({categoryId: 1});
});

test('Get category id with url encoded space', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{category_id: 1}]});
    const response = await agent.get('/categories/id/chocolate%20bars').send();
    expect(response.body).toEqual({categoryId: 1});
});

test('Get category name missing id', async () => {
    expect.assertions(2);
    const agent = request.agent(server);
    db.query.mockResolvedValue({rows: [{category_name: "cat"}]});
    const response = await agent.get('/categories/name/').send();
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('code', 'InvalidArgument');
});

test('Get category name bad id', async () => {
    expect.assertions(2);
    const agent = request.agent(server);
    db.query.mockResolvedValue({rows: [{category_name: "cat"}]});
    const response = await agent.get('/categories/name/badid').send();
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('code', 'InvalidArgument');
});

test('Get category name', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    db.query.mockResolvedValue({rows: [{category_name: "cat"}]});
    const response = await agent.get('/categories/name/1').send();
    expect(response.body).toEqual({categoryName: "cat"});
});

test('Post Copy Shopping List', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.post('/shopping-lists/1/items').send({archivedShoppingListId: 2});
    expect(response.body).toEqual({copiedItems: true});
});

test('Post Shopping List Id Bad Request', async () => {
    expect.assertions(2);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.post('/shopping-lists/1/items').send();
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('code', 'BadRequest');
});

test('Post Copy Recipe to Shopping List', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.post('/shopping-lists/1/recipes').send({recipeId: 2});
    expect(response.body).toEqual({copiedRecipeItems: true});
});

test('Post Recipe Id Bad Request', async () => {
    expect.assertions(2);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.post('/recipes/1/items').send();
    expect(response.statusCode).toBe(409);
    expect(response.body).toHaveProperty('code', 'InvalidArgument');
});

test('Post Recipe Id Add Item', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
    const response = await agent.post('/recipes/1/items').send({item: "cheese"});
    expect(response.body).toEqual({recipeItemId: 1});
});

test('Post Create Recipe', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{recipe_id: 1}]});
    const response = await agent.post('/recipes').send();
    expect(response.body).toEqual({recipeId: 1});
});

test('Delete Recipe', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.del('/recipes/1').send();
    expect(response.body).toEqual({recipeDeleted: true});
});

test('Update Recipe', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.put('/recipes/1').send({name: "n", description: "desc", source: "src"});
    expect(response.body).toEqual({recipeUpdated: true});
});

test('Delete Recipe Item', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.del('/recipes/1/items/1').send();
    expect(response.body).toEqual({itemDeleted: true});
});

test('Update Recipe Item', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.put('/recipes/1/items/1').send({item: "new"});
    expect(response.body).toEqual({itemUpdated: true});
});

test('Get Recipe Item', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeId: 1, recipeItemValue: "v"}]});
    const response = await agent.get('/recipes/1/items/1').send();
    expect(response.body).toEqual({recipeItemId: 1, recipeId: 1, recipeItemValue: "v"});
});

test('Create Shopping List Item', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{categoryId: 1, shoppingListItemValue: "milk"}]});
    const response = await agent.post('/shopping-lists/1/items').send({item: "milk"});
    expect(response.body).toEqual({shoppingListItemValue: "milk", categoryId: 1});
});

test('Update Shopping List Item', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.put('/shopping-lists/1/items/1').send({item: "milk", categoryId: 1, isChecked: "false"});
    expect(response.body).toEqual({itemUpdated: true});
});

test('Deactivate Account', async () => {
    expect.assertions(2);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.del('/account').send();
    expect(response.body).toEqual({deactivated: true});
    db.query.mockResolvedValue({rows: [{recipe_id: 1}]});
    const unauthorizedResponse = await agent.post('/recipes').send();
    expect(unauthorizedResponse.body).toEqual({code: "Unauthorized", message: ""});
});

test('Deactivate Email', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: []});
    const response = await agent.del('/account/emails').send({email: "x@x.com"});
    expect(response.body).toEqual({deactivatedEmail: true});
});

test('Get Recipe Items', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeItemValue: "milk"}]});
    const response = await agent.get('/recipes/1/items').send();
    expect(response.body).toEqual([{recipeItemId: 1, recipeItemValue: "milk"}]);
});

test('Get Logged In Status 1', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    await doLogin(agent);
    const response = await agent.get('/login-status').send();
    expect(response.body).toEqual({isLoggedIn: true});
});

test('Get Logged In Status 2', async () => {
    expect.assertions(1);
    const agent = request.agent(server);
    const response = await agent.get('/login-status').send();
    expect(response.body).toEqual({isLoggedIn: false});
});

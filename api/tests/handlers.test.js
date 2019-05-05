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

const errs = require('restify-errors');
const config = require('config');
jest.mock('restify-errors');
const HandlerContainer = require('../handlers');
const db = {query: jest.fn()};
let emailTransporter = {sendMail: email => console.log('Sent email: ' + email) };
const handlerContainer = new HandlerContainer(db, errs, emailTransporter, config);
const json = jest.fn();
const next = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();
});

describe('Create Login Route', () => {
    test('Valid email', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [ {uuid: "id"}]});
        await handlerContainer.createLogin({body: {email: "x@x.com"}}, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({emailSent: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Invalid email', async () => {
        expect.assertions(2);
        await handlerContainer.createLogin({params: {email: "123"}}, { json }, next);
        expect(next.mock.calls.length).toBe(1);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
    });
    test('Missing email', async () => {
        expect.assertions(2);
        await handlerContainer.createLogin({params: {emailmissing: "123"}}, { json }, next);
        expect(next.mock.calls.length).toBe(1);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
    });
});

describe('Get email', () => {
    test('Successfully get email', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [ {email: "x@x.com"}]});
        let req = {session: {accountId: 1}};
        await handlerContainer.getEmails(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual([{email: "x@x.com"}]);
        expect(next.mock.calls.length).toBe(1);
    });
    test('No session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ {email: "x@x.com"}]});
        let req = {};
        await handlerContainer.getEmails(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get Login Route', () => {
    test('Missing uuid', async () => {
        expect.assertions(2);
        await handlerContainer.getOrCreateAccount({params: {uuidMissing: "123"}}, { json }, next);
        expect(next.mock.calls.length).toBe(1);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
    });
    test('Expired login attempt', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ {account_id: 0}]});
        await handlerContainer.getOrCreateAccount({params: {uuid: "123"}}, { json }, next);
        expect(next.mock.calls.length).toBe(1);
        expect(errs.RequestExpiredError).toHaveBeenCalledTimes(1);
    });
    test('Successful login attempt', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ {account_id: 1}]});
        let req = {params: {uuid: "123"}, session: {}};
        const redirect = jest.fn();
        await handlerContainer.getOrCreateAccount(req, { redirect }, next);
        expect(redirect.mock.calls.length).toBe(1);
        expect(req.session.accountId).toEqual(1);
    });
});

describe('Verify email', () => {
    test('Missing account email id', async () => {
        expect.assertions(2);
        await handlerContainer.verifyEmail({params: {uuidMissing: "123"}}, { json }, next);
        expect(next.mock.calls.length).toBe(1);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
    });
    test('Missing uuid', async () => {
        expect.assertions(2);
        await handlerContainer.verifyEmail({params: {accountEmailId: 1, uuidMissing: "123"}}, { json }, next);
        expect(next.mock.calls.length).toBe(1);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
    });
    test('Successful email verification', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ {account_id: 1}]});
        let req = {params: {uuid: "123", accountEmailId: 1}, session: {}};
        const redirect = jest.fn();
        await handlerContainer.verifyEmail(req, { redirect }, next);
        expect(redirect.mock.calls.length).toBe(1);
        expect(req.session.accountId).toEqual(1);
    });
});

describe('Create Shopping List', () => {
    test('Create list no items', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [ {shopping_list_id: 1}]});
        let req = {body: {name: "list-name"}, session: {accountId: 1}};
        await handlerContainer.createShoppingList(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({shoppingListId: 1});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Create list with items', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [ {shopping_list_id: 1}]});
        let req = {body: {name: "list-name", items: [{item: "milk", category: "dairy"}]}, session: {accountId: 1}};
        await handlerContainer.createShoppingList(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({shoppingListId: 1});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Create list unauthorized', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ {shopping_list_id: 1}]});
        let req = {body: {name: "list-name", items: [{item: "milk", category: "dairy"}]}, session: {}};
        await handlerContainer.createShoppingList(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Create list missing name', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ {shopping_list_id: 1}]});
        let req = {body: {items: [{item: "milk", category: "dairy"}]}, session: {accountId: 1}};
        await handlerContainer.createShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Create list empty name', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ {shopping_list_id: 1}]});
        let req = {body: {name: "", items: [{item: "milk", category: "dairy"}]}, session: {accountId: 1}};
        await handlerContainer.createShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Create list blank name', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ {shopping_list_id: 1}]});
        let req = {body: {name: " ", items: [{item: "milk", category: "dairy"}]}, session: {accountId: 1}};
        await handlerContainer.createShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get Shopping Lists', () => {
    test('Successfully get shopping lists', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"}]});
        let req = {session: {accountId: 1}};
        await handlerContainer.getShoppingLists(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual([{shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"}]);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Get lists unauthorized', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"}]});
        let req = {};
        await handlerContainer.getShoppingLists(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get Shopping List', () => {
    test('Successfully get shopping list', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"}]});
        let req = {params: {shoppingListId: 1}, session: {accountId: 1}};
        await handlerContainer.getShoppingList(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad shopping list id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"}]});
        let req = {params: {shoppingListId: "x"}, session: {accountId: 1}};
        await handlerContainer.getShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Get list unauthorized', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{shoppingListId: 1, shoppingListName: "name", shoppingListCreated: "2020-01-01"}]});
        let req = {params: {shoppingListId: 1}};
        await handlerContainer.getShoppingList(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get Shopping List Items', () => {
    test('Successfully get shopping list items', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{shoppingListItemId: 1, shoppingListId: 1, categoryId: 1, shoppingListItemValue: "milk", shoppingListItemChecked: "true"}]});
        let req = {params: {shoppingListId: 1}, session: {accountId: 1}};
        await handlerContainer.getShoppingListItems(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual([{shoppingListItemId: 1, shoppingListId: 1, categoryId: 1, shoppingListItemValue: "milk", shoppingListItemChecked: "true"}]);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad shopping list id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{shoppingListItemId: 1, shoppingListId: 1, categoryId: 1, shoppingListItemValue: "milk", shoppingListItemChecked: "true"}]});
        let req = {params: {shoppingListId: "x"}, session: {accountId: 1}};
        await handlerContainer.getShoppingListItems(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Get list items unauthorized', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{shoppingListItemId: 1, shoppingListId: 1, categoryId: 1, shoppingListItemValue: "milk", shoppingListItemChecked: "true"}]});
        let req = {params: {shoppingListId: 1}};
        await handlerContainer.getShoppingListItems(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Add Account Email', () => {
    test('Add account unauthorized', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {body: {}, session: {}};
        await handlerContainer.createAccountEmail(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Add email missing email', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {body: {}, session: {accountId: 1}};
        await handlerContainer.createAccountEmail(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Add email blank email', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {body: {email: ""}, session: {accountId: 1}};
        await handlerContainer.createAccountEmail(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Add bad email', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {body: {email: "XXX"}, session: {accountId: 1}};
        await handlerContainer.createAccountEmail(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Add email', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{accountEmailId: 1, uuid: 'x'} ]});
        let req = {body: {email: "x@x.com"}, session: {accountId: 1}};
        await handlerContainer.createAccountEmail(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({emailAdded: true});
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get category id', () => {
    test('Get category no session', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{category_id: 1}]});
        let req = {params: {item: "ice cream"}};
        await handlerContainer.getCategoryId(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({categoryId: 1});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Get category with session', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{category_id: 1}]});
        let req = {params: {item: "ice cream"}, session: {accountId: 1}};
        await handlerContainer.getCategoryId(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({categoryId: 1});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Get category missing item', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{category_id: 1}]});
        let req = {params: {}};
        await handlerContainer.getCategoryId(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get category name', () => {
    test('Get category', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{category_name: "cat"}]});
        let req = {params: {categoryId: 1}};
        await handlerContainer.getCategoryName(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({categoryName: "cat"});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Get category missing id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{category_name: "cat"}]});
        let req = {params: {}};
        await handlerContainer.getCategoryName(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Get category bad id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{category_name: "cat"}]});
        let req = {params: {categoryId: "string"}};
        await handlerContainer.getCategoryName(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Copy Shopping List', () => {
    test('Successful Copy', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: 1}, body: {archivedShoppingListId: 2}, session: {accountId: 1}};
        await handlerContainer.copyShoppingListItems(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({copiedItems: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy no session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: 1}, body: {archivedShoppingListId: 2}};
        await handlerContainer.copyShoppingListItems(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy missing shoppingListId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {}, body: {archivedShoppingListId: 2}, session: {accountId: 1}};
        await handlerContainer.copyShoppingListItems(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy bad shoppingListId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: "x"}, body: {archivedShoppingListId: 2}, session: {accountId: 1}};
        await handlerContainer.copyShoppingListItems(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy missing archivedShoppingListId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: 1}, body: {}, session: {accountId: 1}};
        await handlerContainer.copyShoppingListItems(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy bad archivedShoppingListId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: 1}, body: {archivedShoppingListId: "x"}, session: {accountId: 1}};
        await handlerContainer.copyShoppingListItems(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy db error', async () => {
        expect.assertions(2);
        db.query.mockRejectedValue(new Error('db error'));
        let req = {params: {shoppingListId: 1}, body: {archivedShoppingListId: 2}, session: {accountId: 1}};
        await handlerContainer.copyShoppingListItems(req, { json }, next);
        expect(errs.InternalServerError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Copy Recipe to Shopping List', () => {
    test('Successful Copy', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: 1}, body: {recipeId: 2}, session: {accountId: 1}};
        await handlerContainer.addRecipeToShoppingList(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({copiedRecipeItems: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy no session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: 1}, body: {recipeId: 2}};
        await handlerContainer.addRecipeToShoppingList(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy missing shoppingListId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {}, body: {recipeId: 2}, session: {accountId: 1}};
        await handlerContainer.addRecipeToShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy bad shoppingListId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: "x"}, body: {recipeId: 2}, session: {accountId: 1}};
        await handlerContainer.addRecipeToShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy missing recipeId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: 1}, body: {}, session: {accountId: 1}};
        await handlerContainer.addRecipeToShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy bad recipeId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [ ]});
        let req = {params: {shoppingListId: 1}, body: {recipeId: "x"}, session: {accountId: 1}};
        await handlerContainer.addRecipeToShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Copy db error', async () => {
        expect.assertions(2);
        db.query.mockRejectedValue(new Error('db error'));
        let req = {params: {shoppingListId: 1}, body: {recipeId: 2}, session: {accountId: 1}};
        await handlerContainer.addRecipeToShoppingList(req, { json }, next);
        expect(errs.InternalServerError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get Shopping List Recipes', () => {
    test('Successful get recipes', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name"} ]});
        let req = {params: {shoppingListId: 1}, session: {accountId: 1}};
        await handlerContainer.getShoppingListRecipes(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual([{recipeId: 1, recipeName: "name"} ]);
        expect(next.mock.calls.length).toBe(1);
    });
    test('No session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name"} ]});
        let req = {params: {shoppingListId: 1}};
        await handlerContainer.getShoppingListRecipes(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad shoppingListId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name"} ]});
        let req = {params: {shoppingListId: "x"}, session: {accountId: 1}};
        await handlerContainer.getShoppingListRecipes(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get Recipes', () => {
    test('Successful get recipes', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""} ]});
        let req = {params: {}, session: {accountId: 1}};
        await handlerContainer.getRecipes(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual([{recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""} ]);
        expect(next.mock.calls.length).toBe(1);
    });
    test('No session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""} ]});
        let req = {params: {}};
        await handlerContainer.getRecipes(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get Recipe', () => {
    test('Successful get recipe', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""} ]});
        let req = {params: {recipeId: 1}, session: {accountId: 1}};
        await handlerContainer.getRecipe(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Not found', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: 1}, session: {accountId: 1}};
        await handlerContainer.getRecipe(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({});
        expect(next.mock.calls.length).toBe(1);
    });
    test('No session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeId: 1, recipeName: "name", recipeDescription: "descr", recipeSource: "src", recipeCreated: ""} ]});
        let req = {params: {recipeId: 1}};
        await handlerContainer.getRecipes(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Add item to recipe', () => {
    test('Successful recipe item creation', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1}, body: {item: "milk"}, session: {accountId: 1}};
        await handlerContainer.createRecipeItem(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({recipeItemId: 1});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Recipe item creation missing recipe id ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {}, body: {item: "milk"}, session: {accountId: 1}};
        await handlerContainer.createRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Recipe item creation bad recipe id ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: "x"}, body: {item: "milk"}, session: {accountId: 1}};
        await handlerContainer.createRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Recipe item creation missing item ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1}, body: {}, session: {accountId: 1}};
        await handlerContainer.createRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Recipe item creation bad item ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1}, body: {item: " "}, session: {accountId: 1}};
        await handlerContainer.createRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Recipe item creation no session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1}, body: {item: "milk"}};
        await handlerContainer.createRecipeItem(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Create Recipe', () => {
    test('Successfully create recipe', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{recipe_id: 1}]});
        let req = {session: {accountId: 1}};
        await handlerContainer.createRecipe(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({recipeId: 1});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Recipe item creation no session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_id: 1}]});
        let req = {};
        await handlerContainer.createRecipe(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });

});

describe('Create Shopping List Item', () => {
    test('Successfully create shopping list item', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{categoryId: 1, shoppingListItemValue: "milk"}]});
        let req = {params: {shoppingListId: 1}, body: {item: "milk"}, session: {accountId: 1}};
        await handlerContainer.createShoppingListItem(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({shoppingListItemValue: "milk", categoryId: 1});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing shopping list id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{categoryId: 1, shoppingListItemValue: "milk"}]});
        let req = {params: {}, body: {item: "milk"}, session: {accountId: 1}};
        await handlerContainer.createShoppingListItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad shopping list id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{categoryId: 1, shoppingListItemValue: "milk"}]});
        let req = {params: {shoppingListId: "x"}, body: {item: "milk"}, session: {accountId: 1}};
        await handlerContainer.createShoppingListItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing item', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{categoryId: 1, shoppingListItemValue: "milk"}]});
        let req = {params: {}, body: {}, session: {accountId: 1}};
        await handlerContainer.createShoppingListItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad item', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{categoryId: 1, shoppingListItemValue: "milk"}]});
        let req = {params: {shoppingListId: "x"}, body: {item: ""}, session: {accountId: 1}};
        await handlerContainer.createShoppingListItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('No session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{categoryId: 1, shoppingListItemValue: "milk"}]});
        let req = {params: {shoppingListId: 1}, body: {item: "milk"}};
        await handlerContainer.createShoppingListItem(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Deactivate Account', () => {
    test('Successfully deactivate account', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: []});
        let req = {session: {accountId: 1, reset: () => {}}};
        await handlerContainer.deactivateAccount(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({deactivated: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('No session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {};
        await handlerContainer.deactivateAccount(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Deactivate Email', () => {
    test('Successfully deactivate email', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: []});
        let req = {session: {accountId: 1}, body: {email: "x@x.com"}};
        await handlerContainer.deactivateEmail(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({deactivatedEmail: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing body', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {session: {accountId: 1}};
        await handlerContainer.deactivateEmail(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Blank email', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {session: {accountId: 1}, body: {email: " "}};
        await handlerContainer.deactivateEmail(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Empty email', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {session: {accountId: 1}, body: {email: ""}};
        await handlerContainer.deactivateEmail(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing email', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {session: {accountId: 1}, body: {}};
        await handlerContainer.deactivateEmail(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('No session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {};
        await handlerContainer.deactivateEmail(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Delete recipe item', () => {
    test('Successful delete recipe item', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: 1, itemId: 1}, session: {accountId: 1}};
        await handlerContainer.deleteRecipeItem(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({itemDeleted: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing recipe id ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {itemId: 1}, session: {accountId: 1}};
        await handlerContainer.deleteRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad recipe id ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: "x", itemId: 1}, session: {accountId: 1}};
        await handlerContainer.deleteRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing item ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1}, session: {accountId: 1}};
        await handlerContainer.deleteRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad item ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1, itemId: "x"}, session: {accountId: 1}};
        await handlerContainer.deleteRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Recipe item creation no session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1, itemId: 1}};
        await handlerContainer.deleteRecipeItem(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Update recipe item', () => {
    test('Successful update recipe item', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: 1, itemId: 1}, body: {item: "new"}, session: {accountId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({itemUpdated: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing recipe id ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {itemId: 1}, session: {accountId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad recipe id ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: "x", itemId: 1}, session: {accountId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing item id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1}, session: {accountId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad item id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1, itemId: "x"}, session: {accountId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing body', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1, itemId: 1}, session: {accountId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing item', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1, itemId: 1}, body: {}, session: {accountId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Empty item', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1, itemId: 1}, body: {item: ""}, session: {accountId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Blank item', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1, itemId: 1}, body: {item: " "}, session: {accountId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Recipe item update no session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipe_item_id: 1}]});
        let req = {params: {recipeId: 1, itemId: 1}};
        await handlerContainer.updateRecipeItem(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get recipe item', () => {
    test('Successful get recipe item', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeId: 1, recipeItemValue: "v"}]});
        let req = {params: {recipeId: 1, itemId: 1}, session: {accountId: 1}};
        await handlerContainer.getRecipeItem(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({recipeItemId: 1, recipeId: 1, recipeItemValue: "v"});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing recipe id ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeId: 1, recipeItemValue: "v"}]});
        let req = {params: {recipeId: "", itemId: 1}, session: {accountId: 1}};
        await handlerContainer.getRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad recipe id ', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeId: 1, recipeItemValue: "v"}]});
        let req = {params: {recipeId: "x", itemId: 1}, session: {accountId: 1}};
        await handlerContainer.getRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing item id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeId: 1, recipeItemValue: "v"}]});
        let req = {params: {recipeId: 1}, session: {accountId: 1}};
        await handlerContainer.getRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad item id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeId: 1, recipeItemValue: "v"}]});
        let req = {params: {recipeId: 1, itemId: "x"}, session: {accountId: 1}};
        await handlerContainer.getRecipeItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Recipe item update no session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeId: 1, recipeItemValue: "v"}]});
        let req = {params: {recipeId: 1, itemId: 1}};
        await handlerContainer.getRecipeItem(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Delete Recipe', () => {
    test('Successfully delete recipe', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: 1}, session: {accountId: 1}};
        await handlerContainer.deleteRecipe(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({recipeDeleted: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('No recipe', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {}, session: {accountId: 1}};
        await handlerContainer.deleteRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad recipe id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, session: {accountId: 1}};
        await handlerContainer.deleteRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('No session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: 1}};
        await handlerContainer.deleteRecipe(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Update Recipe', () => {
    test("Successfully update recipe", async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: 1}, body: {name: "new name", description: "descr", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({recipeUpdated: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test("Missing params", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {body: {name: "new name", description: "descr", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Missing missing recipe id", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {}, body: {name: "new name", description: "descr", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Empty recipe id", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: ""}, body: {name: "new name", description: "descr", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Blank recipe id", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: " "}, body: {name: "new name", description: "descr", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Bad recipe id", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: "new name", description: "descr", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Missing body", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: 1}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Missing name", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {description: "descr", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Missing description", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: "new name", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Missing source", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: "new name", description: "descr"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Empty name", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: "", description: "descr", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Empty description", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: "new name", description: "", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Empty source", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: "new name", description: "descr", source: ""}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Blank name", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: " ", description: "descr", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Blank description", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: "new name", description: " ", source: "book"}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("Blank source", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: "new name", description: "descr", source: " "}, session: {accountId: 1}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("No session", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {recipeId: "x"}, body: {name: "new name", description: "descr", source: "source"}};
        await handlerContainer.updateRecipe(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Update Shopping List Item', () => {
    test('Successfully update item', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 1, itemId: 1}, body: {item: "new item", categoryId: 1, isChecked: "true"}, session: {accountId: 1}};
        await handlerContainer.updateShoppingListItem(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({itemUpdated: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing shopping list id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {itemId: 1}, body: {item: "new item", categoryName: "dairy", isChecked: "true"}, session: {accountId: 1}};
        await handlerContainer.updateShoppingListItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing itemId', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 1}, body: {item: "new item", categoryName: "dairy", isChecked: "true"}, session: {accountId: 1}};
        await handlerContainer.updateShoppingListItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing item', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 1, itemId: 1}, body: {categoryName: "dairy", isChecked: "true"}, session: {accountId: 1}};
        await handlerContainer.updateShoppingListItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing category', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 1, itemId: 1}, body: {item: "new item", isChecked: "true"}, session: {accountId: 1}};
        await handlerContainer.updateShoppingListItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing isChecked', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 1, itemId: 1}, body: {item: "new item", categoryName: "dairy"}, session: {accountId: 1}};
        await handlerContainer.updateShoppingListItem(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("No session", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 1, itemId: 1}, body: {item: "new item", categoryName: "dairy", isChecked: "true"}};
        await handlerContainer.updateShoppingListItem(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Update Shopping List', () => {
    test('Successfully update shopping list', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 1}, body: {name: "name"}, session: {accountId: 1}};
        await handlerContainer.updateShoppingList(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({shoppingListUpdated: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing shopping list id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 0}, body: {name: "name"}, session: {accountId: 1}};
        await handlerContainer.updateShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Missing name', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 1}, body: {name: ""}, session: {accountId: 1}};
        await handlerContainer.updateShoppingList(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test("No session", async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: []});
        let req = {params: {shoppingListId: 1}, body: {name: "n"}};
        await handlerContainer.updateShoppingList(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Get Recipe Items', () => {
    test('Successful get recipes', async () => {
        expect.assertions(3);
        db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeItemValue: "milk"}]});
        let req = {params: {recipeId: 1}, session: {accountId: 1}};
        await handlerContainer.getRecipeItems(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual([{recipeItemId: 1, recipeItemValue: "milk"}]);
        expect(next.mock.calls.length).toBe(1);
    });
    test('Bad recipe id', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeItemValue: "milk"}]});
        let req = {params: {recipeId: "x"}, session: {accountId: 1}};
        await handlerContainer.getRecipeItems(req, { json }, next);
        expect(errs.InvalidArgumentError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
    test('No session', async () => {
        expect.assertions(2);
        db.query.mockResolvedValue({rows: [{recipeItemId: 1, recipeItemValue: "milk"}]});
        let req = {params: {recipeId: 1}};
        await handlerContainer.getRecipeItems(req, { json }, next);
        expect(errs.UnauthorizedError).toHaveBeenCalledTimes(1);
        expect(next.mock.calls.length).toBe(1);
    });
});

describe('Is Logged In', () => {
    test('Yes', async () => {
        expect.assertions(3);
        let req = {session: {accountId: 1}};
        await handlerContainer.getLoginStatus(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({isLoggedIn: true});
        expect(next.mock.calls.length).toBe(1);
    });
    test('No - no account is session', async () => {
        expect.assertions(3);
        let req = {session: {}};
        await handlerContainer.getLoginStatus(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({isLoggedIn: false});
        expect(next.mock.calls.length).toBe(1);
    });
    test('No - account = 0', async () => {
        expect.assertions(3);
        let req = {session: {accountId: 0}};
        await handlerContainer.getLoginStatus(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({isLoggedIn: false});
        expect(next.mock.calls.length).toBe(1);
    });
    test('No - no session', async () => {
        expect.assertions(3);
        let req = {};
        await handlerContainer.getLoginStatus(req, { json }, next);
        expect(json.mock.calls.length).toBe(1);
        expect(json.mock.calls[0][0]).toEqual({isLoggedIn: false});
        expect(next.mock.calls.length).toBe(1);
    });
});

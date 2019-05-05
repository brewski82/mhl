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

/**
 * Contains all methods for processing API requests.
 */
class HandlerContainer {
    constructor(db, errs, emailTransporter, config) {
        this.db = db;
        this.errs = errs;
        this.emailTransporter = emailTransporter;
        this.config = config;
    }

    /**
     * Helper function to get the account id from the session.
     */
    getAccountId(req) {
        if (req.session) {
            return req.session.accountId;
        }
        return null;
    }

    /**
     * Helper function for testing if an object does not contains a
     * key.
     */
    lacksKey(object, key) {
        if (typeof object !== 'object') {
            return true;
        }
        if (!object.hasOwnProperty(key)) {
            return true;
        }
        return false;
    }

    /**
     * Helper function to detect required string input.
     */
    isBlank(object, key) {
        if (this.lacksKey(object, key)) {
            return true;
        }
        const string = object[key];
        if (typeof string !== 'string') {
            return true;
        }
        if (!string || !string.trim()) {
            return true;
        }
        return false;
    }

    /**
     * Helper function to detect required positive number input.
     */
    isNotPositiveNumber(object, key) {
        if (typeof object !== 'object') {
            return true;
        }
        if (!object[key]) {
            return true;
        }
        const string = object[key];
        if (isNaN(string)) {
            return true;
        }
        const number = parseInt(string);
        if (typeof number !== 'number') {
            return true;
        }
        if (!number || number <= 0) {
            return true;
        }
        return false;
    }


    /**
     * Sends a email containing a login link.
     */
    async sendLoginEmail(email, uuid) {
        await this.emailTransporter.sendMail({
            from: this.config.get('emailFrom'),
            to: email,
            subject: "Your login link to My Honey's List!",
            text: "Please navigate to the following link to log into My Honey's List: \n\n" + this.config.get('emailLoginLink') + uuid + "\n\n- The My Honey's List team"
        });
    }

    /**
     * When provided a valid email address, sends an email to the recipent
     * that contains a link with a unique UUID used to login.
     */
    async createLogin(req, res, next) {
        try {
            if (this.isBlank(req.body, 'email')) {
                return next(new this.errs.InvalidArgumentError("Missing email address."));
            }
            const email = req.body.email;
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
                return next(new this.errs.InvalidArgumentError("Invalid email address."));
            } else {

                const result = await this.db.query('select create_login($1) as uuid;', [email]);
                const uuid = result.rows[0].uuid;
                await this.sendLoginEmail(email, uuid);
                res.json({ emailSent: true });
                return next();
            }
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }

    }

    /**
     * Given the UUID in the request, returns success if it finds the
     * UUID in the login table, else errors. Upon success, creates a
     * new session with the account id.
     */
    async getOrCreateAccount(req, res, next) {
        try {
            if (this.isBlank(req.params, 'uuid')) {
                return next(new this.errs.InvalidArgumentError("Missing uuid."));
            }
            const uuid = req.params.uuid;
            const result = await this.db.query('select get_or_create_account_from_login($1) as account_id;', [uuid]);
            const accountId = result.rows[0].account_id;
            if (accountId == 0) {
                return next(new this.errs.RequestExpiredError('Link expired.'));
            }
            req.session.accountId = accountId;
            return res.redirect('/', next);
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Returns the user's login status.
     */
    async getLoginStatus(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            res.json({isLoggedIn: (accountId > 0)});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }


    /**
     * Deactivates the user account and logs the user out.
     */
    async deactivateAccount(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            await this.db.query('select deactivate_account($1);', [accountId]);
            req.session.reset();
            res.json({deactivated: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Log the user out by clearing the cookies.
     */
    async deactivateSession(req, res, next) {
        try {
            req.session.reset();
            res.json({deactivated: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Deactivates the email for the user. The db function will fail
     * if the user has less than two active emails prior to call this
     * function.
     */
    async deactivateEmail(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isBlank(req.body, 'email')) {
                return next(new this.errs.InvalidArgumentError("Missing email."));
            }
            const {email} = req.body;
            await this.db.query('select deactivate_email_safe($1, $2);', [accountId, email]);
            res.json({deactivatedEmail: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Get the account's emails.
     */
    async getEmails(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            const result = await this.db.query('select email from account_email where account_id = $1 and email_active;', [accountId]);
            res.json(result.rows);
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Creates a new shopping list and returns its id. The name of the
     * shopping list is required. Items is a json array of objects of
     * {item category} and only contains elements if the user started
     * adding items to a shoppign list prior to logging in.
     */
    async createShoppingList(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isBlank(req.body, 'name')) {
                return next(new this.errs.InvalidArgumentError("Missing name."));
            }
            const {name, items = []} = req.body;
            const result = await this.db.query('select create_shopping_list($1, $2, $3) as shopping_list_id;', [accountId, name, JSON.stringify(items)]);
            const shoppingListId = result.rows[0].shopping_list_id;
            res.json({shoppingListId});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Returns all shopping lists.
     */
    async getShoppingLists(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            const result = await this.db.query('select shopping_list_id as "shoppingListId", shopping_list_name as \
"shoppingListName", shopping_list_created as "shoppingListCreated" from \
shopping_list where account_id = $1 order by \
shopping_list_created desc;', [accountId]);
            res.json(result.rows);
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Returns the shopping list for the provided id.
     */
    async getShoppingList(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'shoppingListId')) {
                return next(new this.errs.InvalidArgumentError("Missing shoppingListId."));
            }
            const {shoppingListId} = req.params;
            const result = await this.db.query('select shopping_list_id as "shoppingListId", shopping_list_name as \
"shoppingListName", shopping_list_created as "shoppingListCreated" from \
shopping_list where account_id = $1 and shopping_list_id = $2;', [accountId, shoppingListId]);
            if (result.rows && result.rows[0]) {
                res.json(result.rows[0]);
            }
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Updates the shopping list. Currently only the name can be updated.
     */
    async updateShoppingList(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isBlank(req.body, 'name')) {
                return next(new this.errs.InvalidArgumentError("Missing name."));
            }
            if (this.isNotPositiveNumber(req.params, 'shoppingListId')) {
                return next(new this.errs.InvalidArgumentError("Missing shoppingListId."));
            }
            const {name} = req.body;
            const {shoppingListId} = req.params;
            await this.db.query('select update_shopping_list_name($1, $2, $3) as shopping_list_id;', [accountId, shoppingListId, name]);
            res.json({shoppingListUpdated: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Creates a new item for the shopping list. The new item should
     * appear in the body of the request.
     */
    async createShoppingListItem(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'shoppingListId')) {
                return next(new this.errs.InvalidArgumentError("Missing shoppingListId."));
            }
            if (this.isBlank(req.body, 'item')) {
                return next(new this.errs.InvalidArgumentError("Missing item."));
            }
            const {shoppingListId} = req.params;
            const {item} = req.body;
            const result = await this.db.query(
                'with x as (select * from create_shopping_list_item($1, $2, $3)) \
select x.shopping_list_item_id as "shoppingListItemId" \
, x.shopping_list_item_value as "shoppingListItemValue" \
, x.category_id as "categoryId" \
, x.shopping_list_item_checked as "shoppingListItemChecked" \
from x;', [accountId, shoppingListId, item]);
            res.json(result.rows[0]);
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Gets the shopping list items
     */
    async getShoppingListItems(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'shoppingListId')) {
                return next(new this.errs.InvalidArgumentError("Missing shoppingListId."));
            }
            const {shoppingListId} = req.params;
            const result = await this.db.query('select shopping_list_item_id as "shoppingListItemId", shopping_list_id \
as "shoppingListId", category_id as "categoryId", shopping_list_item_value \
as "shoppingListItemValue", shopping_list_item_checked as \
"shoppingListItemChecked" from shopping_list_item join shopping_list \
using (shopping_list_id) where account_id = $1 and shopping_list_id = \
$2;', [accountId, shoppingListId]);
            res.json(result.rows);
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }


    /**
     * Updates the shopping list item.
     */
    async updateShoppingListItem(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'shoppingListId') || this.isNotPositiveNumber(req.params, 'itemId')) {
                return next(new this.errs.InvalidArgumentError("Missing shoppingListId or itemId."));
            }
            if (this.isBlank(req.body, 'item') || this.isNotPositiveNumber(req.body, 'categoryId')) {
                return next(new this.errs.InvalidArgumentError("Missing item, category id, or isChecked."));
            }
            const {shoppingListId, itemId} = req.params;
            const {item, categoryId, isChecked = false} = req.body;
            await this.db.query('select update_shopping_list_item($1, $2, $3, $4, $5, $6);', [accountId, shoppingListId, itemId, categoryId, item, isChecked]);
            res.json({itemUpdated: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Adds a new email for the account.
     */
    async createAccountEmail(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isBlank(req.body, 'email')) {
                return next(new this.errs.InvalidArgumentError("Missing email."));
            }
            const {email} = req.body;
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
                return next(new this.errs.InvalidArgumentError("Invalid email address."));
            }
            const result = await this.db.query('select account_email_id as "accountEmailId", uuid from create_account_email($1, $2, false);', [accountId, email]);
            const {accountEmailId, uuid} = result.rows[0];
            await this.emailTransporter.sendMail({
                from: this.config.get('emailFrom'),
                to: email,
                subject: "Please verify your email added to My Honey's List!",
                text: "Please navigate to the following link to verify this email address: \n\n" + this.config.get('emailVerifyLink') + accountEmailId + '/' + uuid + "\n\n- The My Honey's List team"
            });
            res.json({emailAdded: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Verify an email address.
     */
    async verifyEmail(req, res, next) {
        try {
            if (this.isNotPositiveNumber(req.params, 'accountEmailId')) {
                return next(new this.errs.InvalidArgumentError("Missing account email id."));
            }
            if (this.isBlank(req.params, 'uuid')) {
                return next(new this.errs.InvalidArgumentError("Missing uuid id."));
            }
            const {accountEmailId, uuid} = req.params;
            const result = await this.db.query('select verify_email($1::bigint, $2::uuid) as account_id;', [accountEmailId, uuid]);
            const accountId = result.rows[0].account_id;
            if (accountId == 0) {
                return next(new this.errs.RequestExpiredError('Link expired.'));
            }
            req.session.accountId = accountId;
            return res.redirect('/', next);
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Gets the category id for the provided item. The user does not
     * have to be logged in to call this function.
     */
    async getCategoryId(req, res, next) {
        try {
            let accountId = this.getAccountId(req);
            if (!accountId) {
                accountId = 0;
            }
            if (this.isBlank(req.params, 'item')) {
                return next(new this.errs.InvalidArgumentError("Missing item."));
            }
            const {item} = req.params;
            const result = await this.db.query('select calculate_category($1, $2) as category_id;', [accountId, item]);
            const categoryId = result.rows[0].category_id;
            res.json({categoryId});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Get all categories.
     */
    async getCategories(req, res, next) {
        try {
            const result = await this.db.query('select category_id as "categoryId", category_name as "categoryName" from category order by category_order;');
            res.json(result.rows);
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Gets the category name for the provided item. The user does not
     * have to be logged in to call this function.
     */
    async getCategoryName(req, res, next) {
        try {
            if (this.isNotPositiveNumber(req.params, 'categoryId')) {
                return next(new this.errs.InvalidArgumentError("Missing categoryId."));
            }
            const {categoryId} = req.params;
            const result = await this.db.query('select (get_category($1::bigint)).category_name as category_name;', [categoryId]);
            const categoryName = result.rows[0].category_name;
            res.json({categoryName});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Dispatches to the appropriate handler based on the body of the request.
     */
    dispatchShoppingListId(req, res, next) {
        try {
            if (req.body && req.body.archivedShoppingListId) {
                return this.copyShoppingListItems(req, res, next);
            }
            if (req.body && req.body.item) {
                return this.createShoppingListItem(req, res, next);
            }
            return next(new this.errs.BadRequestError());
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Copies items from one shopping list to the other.
     */
    async copyShoppingListItems(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'shoppingListId') || this.isNotPositiveNumber(req.body, 'archivedShoppingListId')) {
                return next(new this.errs.InvalidArgumentError("Missing shoppingListId or archivedShoppingListId."));
            }
            const {shoppingListId} = req.params;
            const {archivedShoppingListId} = req.body;
            await this.db.query('select add_items_to_current_shopping_list($1, $2, $3);', [accountId, shoppingListId, archivedShoppingListId]);
            res.json({copiedItems: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Copies items from a recipe to the shopping list.
     */
    async addRecipeToShoppingList(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'shoppingListId') || this.isNotPositiveNumber(req.body, 'recipeId')) {
                return next(new this.errs.InvalidArgumentError("Missing shoppingListId or recipeId."));
            }
            const {shoppingListId} = req.params;
            const {recipeId} = req.body;
            await this.db.query('select add_recipe_to_shopping_list($1, $2, $3);', [accountId, shoppingListId, recipeId]);
            res.json({copiedRecipeItems: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Gets the recipes added to the shopping list.
     */
    async getShoppingListRecipes(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'shoppingListId')) {
                return next(new this.errs.InvalidArgumentError("Missing shoppingListId."));
            }
            const {shoppingListId} = req.params;
            const result = await this.db.query('select recipe_id as "recipeId", recipe_name as "recipeName" \
from shopping_list_recipe join recipe using (recipe_id) \
where account_id = $1 and shopping_list_id = $2 \
order by recipe_name;', [accountId, shoppingListId]);
            res.json(result.rows);
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Adds a new item to a recipe.
     */
    async createRecipeItem(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'recipeId') || this.isBlank(req.body, 'item')) {
                return next(new this.errs.InvalidArgumentError("Missing recipeId or item."));
            }
            const {recipeId} = req.params;
            const {item} = req.body;
            const result = await this.db.query('select create_recipe_item($1, $2, $3) as recipe_item_id;', [accountId, recipeId, item]);
            const recipeItemId = result.rows[0].recipe_item_id;
            res.json({recipeItemId});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Get recipes
     */
    async getRecipes(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            const result = await this.db.query
            (
                'select recipe_id as "recipeId", recipe_name as "recipeName", \
recipe_description as "recipeDescription", recipe_source as "recipeSource", \
recipe_created as recipeCreated \
from recipe \
where account_id = $1 \
order by recipe_name;'
                , [accountId]
            );
            res.json(result.rows);
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Get a single recipe
     */
    async getRecipe(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'recipeId')) {
                return next(new this.errs.InvalidArgumentError("Bad recipeId."));
            }
            const {recipeId} = req.params;
            const result = await this.db.query
            (
                'select recipe_id as "recipeId", recipe_name as "recipeName", recipe_description as "recipeDescription", recipe_source as "recipeSource" from recipe where account_id = $1 and recipe_id = $2;'
                , [accountId, recipeId]
            );
            if (result.rows[0]) {
                res.json(result.rows[0]);
            } else {
                res.json({});
            }

            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }


    /**
     * Get recipe items
     */
    async getRecipeItems(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'recipeId')) {
                return next(new this.errs.InvalidArgumentError("Bad recipeId."));
            }
            const {recipeId} = req.params;
            const result = await this.db.query
            (
                'select recipe_item_id as "recipeItemId", recipe_item_value as \
"recipeItemValue" from recipe_item join recipe using (recipe_id) where \
account_id = $1 and recipe_id = $2;'
                , [accountId, recipeId]
            );
            res.json(result.rows);
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Creates a new recipe.
     */
    async createRecipe(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            const result = await this.db.query('select create_recipe($1) as recipe_id;', [accountId]);
            const recipeId = result.rows[0].recipe_id;
            res.json({recipeId});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Deletes a recipe.
     */
    async deleteRecipe(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'recipeId')) {
                return next(new this.errs.InvalidArgumentError("Missing recipeId."));
            }
            const {recipeId} = req.params;
            await this.db.query('select delete_recipe($1, $2);', [accountId, recipeId]);
            res.json({recipeDeleted: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Deletes a recipe item
     */
    async deleteRecipeItem(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'recipeId') || this.isNotPositiveNumber(req.params, 'itemId')) {
                return next(new this.errs.InvalidArgumentError("Missing recipeId or itemId."));
            }
            const {recipeId, itemId} = req.params;
            await this.db.query('select delete_recipe_item($1, $2, $3);', [accountId, recipeId, itemId]);
            res.json({itemDeleted: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Updates a recipe item.
     */
    async updateRecipeItem(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'recipeId') || this.isNotPositiveNumber(req.params, 'itemId')) {
                return next(new this.errs.InvalidArgumentError("Missing recipeId or itemId."));
            }
            if (this.isBlank(req.body, 'item')) {
                return next(new this.errs.InvalidArgumentError("Missing item."));
            }
            const {recipeId, itemId} = req.params;
            const {item} = req.body;
            await this.db.query('select update_recipe_item($1, $2, $3, $4);', [accountId, recipeId, itemId, item]);
            res.json({itemUpdated: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Gets a recipe item.
     */
    async getRecipeItem(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'recipeId') || this.isNotPositiveNumber(req.params, 'itemId')) {
                return next(new this.errs.InvalidArgumentError("Missing recipeId or itemId."));
            }
            const {recipeId, itemId} = req.params;
            const result = await this.db.query(
                'select recipe_item_id as "recipeItemId", recipe_id as "recipeId", recipe_item_value as "recipeItemValue" \
from recipe_item join recipe using (recipe_id) \
where account_id = $1 and recipe_id = $2 and recipe_item_id = $3;', [accountId, recipeId, itemId]);
            if (result.rows[0]) {
                res.json(result.rows[0]);
            } else {
                res.json({});
            }
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }

    /**
     * Updates a recipe.
     */
    async updateRecipe(req, res, next) {
        try {
            const accountId = this.getAccountId(req);
            if (!accountId) {
                return next(new this.errs.UnauthorizedError());
            }
            if (this.isNotPositiveNumber(req.params, 'recipeId')) {
                return next(new this.errs.InvalidArgumentError("Missing recipeId."));
            }
            if (this.isBlank(req.body, 'name') || this.lacksKey(req.body, 'description') || this.lacksKey(req.body, 'source')) {
                return next(new this.errs.InvalidArgumentError("Missing name, description, or source."));
            }
            const {recipeId} = req.params;
            const {name, description, source} = req.body;
            await this.db.query('select update_recipe($1, $2, $3, $4, $5);', [accountId, recipeId, name, description, source]);
            res.json({recipeUpdated: true});
            return next();
        } catch (err) {
            console.error(err);
            return next(new this.errs.InternalServerError());
        }
    }
}

module.exports = HandlerContainer;

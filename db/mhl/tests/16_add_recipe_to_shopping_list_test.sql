\set VERBOSITY terse

select create_account('recipetest@example.com');

select create_recipe
(
  (select max(account_id) from account)
);

select create_recipe_item
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , 'salsa'
);

select create_recipe_item
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , 'flour'
);

select create_recipe_item
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , 'cheese'
);

select create_shopping_list
(
  (select max(account_id) from account)
  , 'New List'
);

select add_recipe_to_shopping_list
(
  null
  , null
  , null
);

select add_recipe_to_shopping_list
(
  (select max(account_id) from account)
  , null
  , null
);

select add_recipe_to_shopping_list
(
  (select min(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , null
);

select add_recipe_to_shopping_list
(
  (select max(account_id) from account)
  , (select min(shopping_list_id) from shopping_list)
  , null
);

select add_recipe_to_shopping_list
(
  (select max(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , (select max(recipe_id) from recipe)
);

select count(*) from shopping_list_recipe;

select add_recipe_to_shopping_list
(
  (select max(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , (select max(recipe_id) from recipe)
);

select count(*) from shopping_list_recipe;

select
  shopping_list_item_value
from shopping_list_item
where shopping_list_id = (select max(shopping_list_id) from shopping_list)
order by shopping_list_item_value;

select create_shopping_list
(
  (select min(account_id) from account)
  , 'New List for orginal account'
);

select add_recipe_to_shopping_list
(
  (select min(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , (select max(recipe_id) from recipe)
);


select
  shopping_list_item_value
from shopping_list_item
where shopping_list_id = (select max(shopping_list_id) from shopping_list)
order by shopping_list_item_value;

select count(*) from shopping_list_recipe;

\set VERBOSITY terse

select create_recipe((select max(account_id) from account));

select create_recipe_item
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , 'Cheese'
);

-- These should fail.
select update_recipe_item
(
  null
  , null
  , null
  , null
);

select update_recipe_item
(
  1000
  , null
  , null
  , null
);

select update_recipe_item
(
  null
  , 1000
  , null
  , null
);

select update_recipe_item
(
  (select min(account_id) from account)
  , (select max(recipe_id) from recipe)
  , null
  , null
);

select update_recipe_item
(
  (select max(account_id) from account)
  , (select min(recipe_id) from recipe)
  , null
  , null
);

select update_recipe_item
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , 1000
  , null
);

select update_recipe_item
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , (select max(recipe_item_id) from recipe_item)
  , null
);

select update_recipe_item
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , (select max(recipe_item_id) from recipe_item)
  , ''
);

select update_recipe_item
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , (select max(recipe_item_id) from recipe_item)
  , ' '
);

-- These should succeed.

select count(*) from recipe_item where recipe_item_value = 'Cheese';
select count(*) from recipe_item where recipe_item_value = 'String Cheese';

select update_recipe_item
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , (select max(recipe_item_id) from recipe_item)
  , 'String Cheese'
);

select count(*) from recipe_item where recipe_item_value = 'Cheese';
select count(*) from recipe_item where recipe_item_value = 'String Cheese';

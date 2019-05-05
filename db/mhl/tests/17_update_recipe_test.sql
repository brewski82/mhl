\set VERBOSITY terse

-- Next statements should error due to invalid args.

select update_recipe
(
  null
  , null
  , null
  , null
  , null
)
;

select update_recipe
(
  (select max(account_id) from account)
  , null
  , null
  , null
  , null
)
;

select update_recipe
(
  null
  , (select max(recipe_id) from recipe)
  , null
  , null
  , null
)
;

select update_recipe
(
  (select min(account_id) from account)
  , (select max(recipe_id) from recipe)
  , null
  , null
  , null
)
;

select update_recipe
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , null
  , null
  , null
)
;

select update_recipe
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , ''
  , null
  , null
)
;

select update_recipe
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , ' '
  , null
  , null
)
;

-- These statements should work.
select update_recipe
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , 'Updated name'
  , null
  , null
)
;

select recipe_name, recipe_description, recipe_source
from recipe
where
  recipe_id = (select max(recipe_id) from recipe)
;

select update_recipe
(
  (select max(account_id) from account)
  , (select max(recipe_id) from recipe)
  , 'Updated name'
  , 'Descr'
  , 'Source'
)
;

select recipe_name, recipe_description, recipe_source
from recipe
where
  recipe_id = (select max(recipe_id) from recipe)
;

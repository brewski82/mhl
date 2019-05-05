\set VERBOSITY terse

-- Bad account / recipe id / items.
select create_recipe_item(null, null, null);
select create_recipe_item(1, null, null);
select create_recipe_item(null, 3, null);
select create_recipe_item(1, 3, null);
select create_recipe_item(1, 3, '');
select create_recipe_item(1, 3, ' ');
select create_recipe_item(1, 3000, 'sugar');
select create_recipe_item(1000, 3, 'sugar');

select create_recipe_item(1, 3, 'sugar');

select recipe_id, recipe_item_value from recipe_item;

\set VERBOSITY terse

select delete_recipe_item(null, null, null);
select delete_recipe_item(null, null, 4);
select delete_recipe_item(1, null, null);
select delete_recipe_item(null, 3, null);
select delete_recipe_item(null, 3, 4);
select delete_recipe_item(1, null, 4);
select delete_recipe_item(1, 3, null);
select delete_recipe_item(10000, 3, 4);
select delete_recipe_item(1, 30000, 4);
select delete_recipe_item(1, 3, 100000);
select delete_recipe_item(10000, 30000, 4);
select delete_recipe_item(1, 300000, 40000);
select delete_recipe_item(1000, 3, 40000);

select delete_recipe_item(1, 3, 4);
select delete_recipe_item(1, 3, 4);

\set VERBOSITY terse

select delete_recipe(null, null);
select delete_recipe(1, null);
select delete_recipe(null, 3);
select delete_recipe(1, 3);
select delete_recipe(1, 3);

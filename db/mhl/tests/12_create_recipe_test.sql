\set VERBOSITY terse

-- Bad account ids
select create_recipe(null);
select create_recipe(0);

-- Should succeed.
select create_recipe(1);

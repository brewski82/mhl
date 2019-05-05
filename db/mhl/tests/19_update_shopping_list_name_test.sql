\set VERBOSITY terse

-- Create a new shopping list to test with.
select create_shopping_list
(
  (select max(account_id) from account)
  , 'Name 1'
);

select count(*) from shopping_list where shopping_list_name = 'Name 1';

-- These should error.
select update_shopping_list_name
(
  null
  , (select min(shopping_list_id) from shopping_list)
  , 'Name 2'
);
select update_shopping_list_name
(
  (select max(account_id) from account)
  , null
  , 'Name 2'
);
select update_shopping_list_name
(
  (select max(account_id) from account)
  , (select min(shopping_list_id) from shopping_list)
  , 'Name 2'
);

select update_shopping_list_name
(
  (select min(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , 'Name 2'
);

select update_shopping_list_name
(
  (select max(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , null
);

select update_shopping_list_name
(
  (select max(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , ''
);

select update_shopping_list_name
(
  (select max(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , ' '
);

-- Do the proper update.
select update_shopping_list_name
(
  (select max(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , 'Name 2'
);

select count(*) from shopping_list where shopping_list_name = 'Name 1';
select count(*) from shopping_list where shopping_list_name = 'Name 2';

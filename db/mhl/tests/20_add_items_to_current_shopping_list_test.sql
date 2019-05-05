\set VERBOSITY terse

-- Create lists and items to test.
select create_shopping_list
(
  (select max(account_id) from account)
  , 'Archived List'
  , '[{"item": "Clams", "categoryId": 1}, {"item": "Shampoo", "categoryId": 2}]'
);

select create_shopping_list
(
  (select max(account_id) from account)
  , 'Current List'
);

select
  shopping_list_name
  , shopping_list_item_value
from shopping_list
join shopping_list_item using (shopping_list_id)
where
  shopping_list.account_id = (select max(account_id) from account)
order by
  shopping_list_name
  , shopping_list_item_value
;

-- Error checking
select add_items_to_current_shopping_list
(
  null
  , null
  , null
);

select add_items_to_current_shopping_list
(
  (select max(account_id) from account)
  , null
  , null
);

select add_items_to_current_shopping_list
(
  (select max(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , null
);

select add_items_to_current_shopping_list
(
  (select max(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , (select max(shopping_list_id) from shopping_list)
);

select add_items_to_current_shopping_list
(
  (select max(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , (select min(shopping_list_id) from shopping_list)
);

select add_items_to_current_shopping_list
(
  (select min(account_id) from account)
  , (select max(shopping_list_id) from shopping_list)
  , (select max(shopping_list_id) from shopping_list)
);

select add_items_to_current_shopping_list
(
  (select min(account_id) from account)
  , (
      select max(shopping_list_id) from shopping_list
      where shopping_list_id !=
        (select max(shopping_list_id) from shopping_list)
    )
  , (select max(shopping_list_id) from shopping_list)
);

select add_items_to_current_shopping_list
(
  null
  , (
      select max(shopping_list_id) from shopping_list
      where shopping_list_id !=
        (select max(shopping_list_id) from shopping_list)
    )
  , (select max(shopping_list_id) from shopping_list)
);

-- Do the proper copy
select add_items_to_current_shopping_list
(
  (select max(account_id) from account)
  , (
      select max(shopping_list_id) from shopping_list
      where shopping_list_id !=
        (select max(shopping_list_id) from shopping_list)
    )
  , (select max(shopping_list_id) from shopping_list)
);

select
  shopping_list_name
  , shopping_list_item_value
from shopping_list
join shopping_list_item using (shopping_list_id)
where
  shopping_list.account_id = (select max(account_id) from account)
order by
  shopping_list_name
  , shopping_list_item_value
;

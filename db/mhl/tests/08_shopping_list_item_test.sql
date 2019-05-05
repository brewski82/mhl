select shopping_list_id, account_id from shopping_list order by shopping_list_id, account_id;

-- Should error.
select create_shopping_list_item(0, 0, '');

select create_shopping_list_item(0, 0, '');

select create_shopping_list_item(1, 3, '');

-- Should succeed
select 'test' from create_shopping_list_item(1, 1, 'Chips and Salsa') x;

select distinct shopping_list_id, shopping_list_item_value from shopping_list_item where shopping_list_item_value = 'Chips and Salsa';

select category_name from category where category_id = calculate_category(null, null);

select category_name from category where category_id = calculate_category(1, null);

select category_name from category where category_id = calculate_category(1, 'Dog food');

select category_name from category where category_id = calculate_category(1, 'non existent item');

select category_name from category where category_id = calculate_category(1, 'Horseradish');

insert into account_item_category (account_id, category_id, account_item_category_value) values
(1, (get_category('Pets')).category_id, normalize_item('Dog food'))
, (1, (get_category('Seafood')).category_id, normalize_item('non existent item'))
, (1, (get_category('Condiments')).category_id, normalize_item('Horseradish'))
;

select category_name from category where category_id = calculate_category(1, 'Dog food');

select category_name from category where category_id = calculate_category(1, 'non existent item');

select category_name from category where category_id = calculate_category(1, 'Horseradish');

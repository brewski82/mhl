\set VERBOSITY terse

-- null should throw an error.
select tally_category(1, null, 1);

-- Support empty strings?
select tally_category(1, '', 1);

select tally_category(1, ' ', 1);

-- Bad account id
select tally_category(1000000, 'Cheese', 1);

-- Bad category id
select tally_category(1, 'Cheese', 1000000);

-- Insert new records
select tally_category(1, 'Cheese', 1);
select tally_category(1, 'Soup', 1);
select tally_category(1, 'Cheese', 2);

-- Update existing records
select tally_category(1, 'Cheese', 1);

-- Different account
select tally_category(3, 'Cheese', 2);
select tally_category(3, 'Cheese', 2);

select account_id, category_id, account_item_category_value, account_item_category_count
from account_item_category
order by account_id, category_id, account_item_category_value, account_item_category_count;

select category_id, item_category_value, item_category_count
from item_category
where item_category_value in ('cheese', 'soup')
order by category_id, item_category_value, item_category_count;

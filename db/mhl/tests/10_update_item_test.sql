select distinct shopping_list_item_id, shopping_list_id, shopping_list_item_value from shopping_list_item
where
  shopping_list_id = 1;

-- Update with ids should fail.
select update_shopping_list_item
(
  10000 -- p_account_id bigint
  , 1 -- p_shopping_list_id bigint
  , 1 -- p_shopping_list_item_id bigint
  , 1 -- p_cateogry_id bigint
  , 'Chips and Hot Salsa' -- p_item text
  , false -- p_is_item_checked boolean
);

select update_shopping_list_item
(
  1 -- p_account_id bigint
  , 10000 -- p_shopping_list_id bigint
  , 1 -- p_shopping_list_item_id bigint
  , 1 -- p_cateogry_id bigint
  , 'Chips and Hot Salsa' -- p_item text
  , false -- p_is_item_checked boolean
);

select update_shopping_list_item
(
  1 -- p_account_id bigint
  , 1 -- p_shopping_list_id bigint
  , 10000 -- p_shopping_list_item_id bigint
  , 1 -- p_cateogry_id bigint
  , 'Chips and Hot Salsa' -- p_item text
  , false -- p_is_item_checked boolean
);

select 'succeeded'
from
(
  select update_shopping_list_item
  (
    1 -- p_account_id bigint
    , 1 -- p_shopping_list_id bigint
    , (select max(shopping_list_item_id) from shopping_list_item where shopping_list_id = 1) -- p_shopping_list_item_id bigint
    , 1 -- p_cateogry_id bigint
    , 'Chips and Hot Salsa' -- p_item text
    , true -- p_is_item_checked boolean
  )
) x;

select distinct
  shopping_list_item_value
  , shopping_list_item_checked
  , category_id
from shopping_list_item
where
  shopping_list_id = 1;

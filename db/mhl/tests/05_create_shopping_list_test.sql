\set VERBOSITY terse

-- Test creating multiple shopping lists.
select create_shopping_list(1, 'one');
select create_shopping_list(1, 'two');

-- Name should be required.
select create_shopping_list(1, '');
select create_shopping_list(1, null);

-- Test with items
select create_shopping_list(1, 'three'
                               , '[{"item": "butter", "categoryId": 1 }, {"item": "lettuce", "categoryId": 2 }, {"item": "fish", "categoryId": 3 }]'::jsonb);

-- Reject if we have a bad category.
select create_shopping_list(1, 'four'
                               , '[{"item": "butter", "categoryId": 1}, {"item": "lettuce", "categoryId": 2}, {"item": "fish", "categoryId": "Bad Cat"}]'::jsonb);

-- Reject if we have a bad category.
select create_shopping_list(1, 'four'
                               , '[{"item": "butter", "categoryId": 1}, {"item": "lettuce", "categoryId": 2}, {"item": "fish", "categoryId": ""}]'::jsonb);

-- Reject if we have a bad category.
select create_shopping_list(1, 'four'
                               , '[{"item": "butter", "categoryId": 1}, {"item": "lettuce", "categoryId": 2}, {"item": "fish", "categoryId": null}]'::jsonb);

-- Reject if we have a bad category.
select create_shopping_list(1, 'four'
                               , '[{"item": "butter", "categoryId": 1}, {"item": "lettuce", "categoryId": 2}, {"item": "fish", "categoryId": " "}]'::jsonb);

-- Reject if we have a bad category.
select create_shopping_list(1, 'four'
                               , '[{"item": "butter", "categoryId": 1}, {"item": "lettuce", "categoryId": 2}, {"item": "fish", "categoryId": 10000000}]'::jsonb);

-- Reject if we have a bad item.
select create_shopping_list(1, 'four'
                               , '[{"item": "", "categoryId": 1}, {"item": "lettuce", "categoryId": 2}, {"item": "fish", "categoryId": "Bad Cat"}]'::jsonb);

-- Reject if we have a bad item.
select create_shopping_list(1, 'four'
                               , '[{"item": "  ", "categoryId": 1}, {"item": "lettuce", "categoryId": 2}, {"item": "fish", "categoryId": "Bad Cat"}]'::jsonb);

-- Reject if we have a bad item.
select create_shopping_list(1, 'four'
                               , '[{"item": null, "categoryId": 1}, {"item": "lettuce", "categoryId": 2}, {"item": "fish", "categoryId": "Bad Cat"}]'::jsonb);

-- Allow lists with the same name.
select create_shopping_list(1, 'two');

select shopping_list_id, category_id, shopping_list_item_value from shopping_list_item order by shopping_list_id, category_id, shopping_list_item_value;

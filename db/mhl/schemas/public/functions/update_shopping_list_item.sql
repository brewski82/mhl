/*
  Copyright 2019 William R. Bruschi

  This file is part of My Honey's List.

  My Honey's List is free software: you can redistribute it and/or
  modify it under the terms of the GNU Affero General Public License
  as published by the Free Software Foundation, either version 3 of
  the License, or (at your option) any later version.

  My Honey's List is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License along with My Honey's List.  If not, see
  <https://www.gnu.org/licenses/>.

  Additional Terms:

  Per section 7.b and 7.c of the GNU Affero General Public License
  version 3, you must preserve the copyright notice and a link to
  https://github.com/brewski82/mhl in the footer of the user
  interface.

*/

create or replace function public.update_shopping_list_item
(
  p_account_id bigint
  , p_shopping_list_id bigint
  , p_shopping_list_item_id bigint
  , p_cateogry_id bigint
  , p_item text
  , p_is_item_checked boolean
)
returns shopping_list_item
language plpgsql
as $$
declare
  l_shopping_list_item shopping_list_item%rowtype;
  l_category category%rowtype;
begin

  -- Ensure the shopping list exists and is owned by the provided
  -- account before proceeding.
  if not exists (select * from shopping_list where account_id = p_account_id and shopping_list_id = p_shopping_list_id) then
    raise exception 'Shopping list % for account % not found!', p_shopping_list_id, p_account_id;
  end if;

  -- If we changed categoires, record the category change.
  select * into strict l_shopping_list_item
  from shopping_list_item
  where
    shopping_list_item_id = p_shopping_list_item_id
    and shopping_list_id = p_shopping_list_id;

  l_category = get_category(p_cateogry_id);

  if l_category is null then
    raise exception 'Invalid category %', p_cateogry_id;
  end if;

  if l_category.category_id != l_shopping_list_item.category_id then
    perform tally_category(p_account_id, p_item, l_category.category_id);
  end if;

  -- Do the update.
  update shopping_list_item set
    category_id = l_category.category_id
    , shopping_list_item_value = p_item
    , shopping_list_item_checked = p_is_item_checked
  where
    shopping_list_item_id = p_shopping_list_item_id
  returning * into l_shopping_list_item;

  return l_shopping_list_item;

end$$;

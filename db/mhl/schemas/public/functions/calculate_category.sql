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

create or replace function public.calculate_category
(
  p_account_id bigint
  , p_item text
)
returns bigint
language plpgsql
as $$
declare
  l_category_id bigint;
  l_normalized_item text;
begin

  l_normalized_item = normalize_item(p_item);

  select category_id into l_category_id
  from account_item_category
  where
    account_id = p_account_id
    and account_item_category_value = l_normalized_item
  order by account_item_category_count desc
  limit 1;

  if l_category_id is not null then return l_category_id; end if;

  select category_id into l_category_id
  from item_category
  where
    item_category_value = l_normalized_item
  order by item_category_count desc
  limit 1;

  if l_category_id is not null then return l_category_id; end if;

  select category_id into l_category_id from category where category_name = get_default_category();

  return l_category_id;

end$$;

comment on function public.calculate_category is 'Maps items to categories. First looks in the user''s own category list. Then looks to see what other user''s assigned the item to. Falls back to looking at the default.';

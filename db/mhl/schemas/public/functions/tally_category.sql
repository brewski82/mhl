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

create or replace function public.tally_category(p_account_id bigint, p_item text, p_category_id bigint)
returns void
language plpgsql
as $$
declare
  l_normalized_item text;
begin

  l_normalized_item = normalize_item(p_item);

  insert into item_category
  (
    category_id
    , item_category_value
    , item_category_count
  )
  values
  (
    p_category_id
    , l_normalized_item
    , 1
  )
  on conflict (category_id, item_category_value)
  do update set item_category_count = item_category.item_category_count + 1;

  insert into account_item_category
  (
    account_id
    , category_id
    , account_item_category_value
    , account_item_category_count
  )
  values
  (
    p_account_id
    , p_category_id
    , l_normalized_item
    , 1
  )
  on conflict (account_id, category_id, account_item_category_value)
  do update set account_item_category_count = account_item_category.account_item_category_count + 1;

end$$;

comment on function public.tally_category is 'Records the category tally for the provided item.';

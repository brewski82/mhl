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

create or replace function public.create_shopping_list
(
  p_account_id bigint
  , p_name text
  , p_items jsonb default null
)
returns bigint
language plpgsql
as $$
declare
  l_shopping_list_id bigint;
  l_json jsonb;
  l_item text;
  l_category_id bigint;
begin

  insert into shopping_list (account_id, shopping_list_name)
  values (p_account_id, p_name)
  returning shopping_list_id into l_shopping_list_id;

  if p_items is not null then
    for l_json in select * from jsonb_array_elements(p_items) loop

      l_item = l_json->>'item';
      l_category_id = l_json->>'categoryId';

      insert into shopping_list_item
      (
        shopping_list_id
        , category_id
        , shopping_list_item_value
      )
      values
      (
        l_shopping_list_id
        , l_category_id
        , l_item
      );

    end loop;
  end if;

  return l_shopping_list_id;

end$$;

comment on function public.create_shopping_list is 'Creates a new shopping list. p_items is optional, and only used when a user starts a new list prior to logging in. It is an json array of objects with keys of ''item'' and ''categoryId''.';

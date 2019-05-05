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

create or replace function public.create_recipe_item
(
  p_account_id bigint
  , p_recipe_id bigint
  , p_item text
)
returns bigint
language plpgsql
as $$
declare l_recipe_item_id bigint;
begin

  -- Ensure the recipe belongs to the account prior to inserting.
  if not exists
  (
    select * from recipe
    where
      account_id = p_account_id
      and recipe_id = p_recipe_id
  )
  then
    raise exception 'Recipe % for account % not found!', p_recipe_id, p_account_id;
  end if;

  insert into recipe_item (recipe_id, recipe_item_value)
  values (p_recipe_id, p_item)
  returning recipe_item_id into l_recipe_item_id;

  return l_recipe_item_id;

end$$;

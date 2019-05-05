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

create or replace function public.update_recipe_item
(
  p_account_id bigint
  , p_recipe_id bigint
  , p_recipe_item_id bigint
  , p_recipe_item text
)
returns void
language plpgsql
as $$
begin

  -- Ensure the recipe is owned by the provided account id.
  if not exists
  (
    select * from recipe where account_id = p_account_id and recipe_id = p_recipe_id
  )
  then
    raise exception 'Recipe % for account % not found!', p_recipe_id, p_account_id;
  end if;

  if not exists
  (
    select * from recipe_item
    where
      recipe_id = p_recipe_id
      and recipe_item_id = p_recipe_item_id
  )
  then
    raise exception 'Recipe item % for recipe % not found!', p_recipe_item_id, p_recipe_id;
  end if;

  update recipe_item set
    recipe_item_value = p_recipe_item
  where
    recipe_id = p_recipe_id
    and recipe_item_id = p_recipe_item_id;

end$$;

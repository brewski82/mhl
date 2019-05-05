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

create or replace function public.delete_recipe
(
  p_account_id bigint
  , p_recipe_id bigint
)
returns void
language plpgsql
as $$
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

  delete from shopping_list_recipe where recipe_id = p_recipe_id;
  delete from recipe_item where recipe_id = p_recipe_id;
  delete from recipe where recipe_id = p_recipe_id;

end$$;

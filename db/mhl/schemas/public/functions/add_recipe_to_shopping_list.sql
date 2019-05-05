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

create or replace function public.add_recipe_to_shopping_list
(
  p_account_id bigint
  , p_shopping_list_id bigint
  , p_recipe_id bigint
)
returns void
language plpgsql
as $$
declare
  l_recipe_item_value text;
begin


  -- Ensure the shopping list is owned by the account. Perhaps in the
  -- future we will support sharing recipes, thus do not enforce that
  -- the recipe be owned by the account.
  if not exists
  (
    select * from shopping_list where account_id = p_account_id and shopping_list_id = p_shopping_list_id
  )
  then
    raise exception 'Shopping list % for account % not found!', p_shopping_list_id, p_account_id;
  end if;

  for l_recipe_item_value in
  (
    select recipe_item_value
    from recipe_item
    where
      recipe_id = p_recipe_id
  )
  loop

    insert into shopping_list_item
    (
      shopping_list_id
      , category_id
      , shopping_list_item_value
    ) values
    (
      p_shopping_list_id
      , calculate_category(p_account_id, l_recipe_item_value)
      , l_recipe_item_value
    );

  end loop;

  insert into shopping_list_recipe (shopping_list_id, recipe_id)
  values (p_shopping_list_id, p_recipe_id)
  on conflict do nothing; -- Allow adding the same recipe twice.

end$$;

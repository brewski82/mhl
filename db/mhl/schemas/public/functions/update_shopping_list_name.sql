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

create or replace function public.update_shopping_list_name
(
  p_account_id bigint
  , p_shopping_list_id bigint
  , p_shopping_list_name text
)
returns void
language plpgsql
as $$
begin

  -- Ensure the shopping list is owned by the account
  if not exists
  (
    select * from shopping_list
    where account_id = p_account_id and shopping_list_id = p_shopping_list_id
  )
  then
    raise exception 'Shopping list % for account % not found!', p_shopping_list_id, p_account_id;
  end if;

  update shopping_list set
    shopping_list_name = p_shopping_list_name
  where
    shopping_list_id = p_shopping_list_id;

end$$;

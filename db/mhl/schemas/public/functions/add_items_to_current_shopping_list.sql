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

create or replace function public.add_items_to_current_shopping_list
(
  p_account_id bigint
  , p_archived_shopping_list_id bigint
  , p_current_shopping_list_id bigint
)
returns void
language plpgsql
as $$
declare
  l_shopping_list_item shopping_list_item%rowtype;
begin

  -- Ensure both shopping lists are owned by the account.
  if not exists
  (
    select * from shopping_list where account_id = p_account_id and shopping_list_id = p_archived_shopping_list_id
  )
  then
    raise exception 'Archived shopping list % for account % not found!', p_archived_shopping_list_id, p_account_id;
  end if;

  if not exists
  (
    select * from shopping_list where account_id = p_account_id and shopping_list_id = p_current_shopping_list_id
  )
  then
    raise exception 'Current shopping list % for account % not found!', p_current_shopping_list_id, p_account_id;
  end if;

  if p_archived_shopping_list_id = p_current_shopping_list_id then
    raise exception 'You cannot copy items into the same list!';
  end if;

  for l_shopping_list_item in
  (
    select *
    from shopping_list_item
    where
      shopping_list_id = p_archived_shopping_list_id
  )
  loop

    insert into shopping_list_item
    (
      shopping_list_id
      , category_id
      , shopping_list_item_value
    ) values
    (
      p_current_shopping_list_id
      , l_shopping_list_item.category_id
      , l_shopping_list_item.shopping_list_item_value
    );

  end loop;

end$$;

comment on function public.add_items_to_current_shopping_list is 'Copies all items from an archived shopping list to the current shopping list.';

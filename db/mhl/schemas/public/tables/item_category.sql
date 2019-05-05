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

create table if not exists public.item_category (
  item_category_id bigserial primary key
  , category_id bigint references public.category (category_id)
  , item_category_value text not null
  , item_category_count bigint not null check (item_category_count >= 0) default 0
  , item_category_created timestamp with time zone not null default current_timestamp
  , unique (category_id, item_category_value)
);

create index if not exists item_category_item_category_value_index on public.item_category (item_category_value);

create index if not exists item_category_category_id on public.item_category (category_id);

comment on table public.item_category is 'Tracks the number of times any user assigns an item to a category. Use this table to calculate default categories for newly added items.';

comment on column public.item_category.item_category_value is 'The normalized value of the item. See the function normalize_shopping_list_item.';

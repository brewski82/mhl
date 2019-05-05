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

create or replace function public.get_category
(
  p_category_name text
)
returns category
language sql
stable
returns null on null input
parallel safe
as $$

  select * from category where category_name = p_category_name;

$$;

create or replace function public.get_category
(
  p_category_id bigint
)
returns category
language sql
stable
returns null on null input
parallel safe
as $$

  select * from category where category_id = p_category_id;

$$;

comment on function public.get_category(text) is 'Returns the cateogry record for the provided category name.';

comment on function public.get_category(bigint) is 'Returns the cateogry record for the provided category id.';

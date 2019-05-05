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

create or replace function public.normalize_item
(
  p_item text
)
returns text
language plpgsql
as $$
declare
  l_result text;
  l_original text;
begin

  if p_item is null then
    return null;
  end if;

  l_result = trim(lower(p_item));

  if l_result = '' then
    return null;
  end if;

  -- Keep the original around in case we remove enough substrings that
  -- we are left with the empty string, in which case we will return
  -- the original.
  l_original = l_result;

  -- Numbers
  l_result = regexp_replace(l_result, '^one\s+|\s+one\s+|\s+one$', '', 'g');
  l_result = regexp_replace(l_result, '^two\s+|\s+two\s+|\s+two$', '', 'g');
  l_result = regexp_replace(l_result, '^three\s+|\s+three\s+|\s+three$', '', 'g');
  l_result = regexp_replace(l_result, '^four\s+|\s+four\s+|\s+four$', '', 'g');
  l_result = regexp_replace(l_result, '^five\s+|\s+five\s+|\s+five$', '', 'g');
  l_result = regexp_replace(l_result, '^six\s+|\s+six\s+|\s+six$', '', 'g');
  l_result = regexp_replace(l_result, '^seven\s+|\s+seven\s+|\s+seven$', '', 'g');
  l_result = regexp_replace(l_result, '^eight\s+|\s+eight\s+|\s+eight$', '', 'g');
  l_result = regexp_replace(l_result, '^nine\s+|\s+nine\s+|\s+nine$', '', 'g');
  l_result = regexp_replace(l_result, '^ten\s+|\s+ten\s+|\s+ten$', '', 'g');

  -- Measurments
  l_result = regexp_replace(l_result, '^cup\s+|\s+cup\s+|\s+cup$', '', 'g');
  l_result = regexp_replace(l_result, '^cups\s+|\s+cups\s+|\s+cups$', '', 'g');
  l_result = regexp_replace(l_result, '^tbsp\s+|\s+tbsp\s+|\s+tbsp$', '', 'g');
  l_result = regexp_replace(l_result, '^tsp\s+|\s+tsp\s+|\s+tsp$', '', 'g');
  l_result = regexp_replace(l_result, '^ounce\s+|\s+ounce\s+|\s+ounce$', '', 'g');
  l_result = regexp_replace(l_result, '^ounces\s+|\s+ounces\s+|\s+ounces$', '', 'g');

  -- Strip all non alpha characters
  l_result = regexp_replace(l_result, '[^a-zA-Z]', '', 'g');

  if l_result = '' then
    return l_original;
  end if;

  return l_result;

end$$;

comment on function public.normalize_item is '"normalizes" a shopping list item for use in assigning a category.';

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

create or replace function public.get_or_create_account_from_login
(
  p_uuid uuid
)
returns bigint
language plpgsql
as $$
declare
  l_account_id bigint;
  l_email text;
begin

  select email into l_email from login
  where
    uuid = p_uuid
    and current_timestamp <= login_exipred;

  if l_email is null then return 0; end if;

  select account_id into l_account_id
  from account_email
  where
    email = l_email
    and email_active;

  if l_account_id is null then
    return create_account(l_email);
  end if;

  return l_account_id;

end$$;

comment on function public.get_or_create_account_from_login is 'Given a UUID, looks up the associated email in the login table. If not found or the associated record has expired, returns 0. Else looks up the account associated with the email, creating an account if not such email exists.';

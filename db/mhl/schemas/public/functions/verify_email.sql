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

create or replace function public.verify_email
(
  p_account_email_id bigint,
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

  update account_email set email_active = true
  where
    account_email_id = p_account_email_id
    and email = l_email;

  select account_id into l_account_id
  from account_email
  where
    email = l_email
    and account_email_id = p_account_email_id
    and email_active;

  if l_account_id is null then
    return 0;
  end if;

  return l_account_id;

end$$;

comment on function public.create_login is 'Adds a record to the login table and returns a random uuid. The uuid is sent to the users email to prove they own the email address.';

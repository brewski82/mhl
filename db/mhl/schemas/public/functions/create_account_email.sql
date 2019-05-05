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

create or replace function public.create_account_email
(
  p_account_id bigint
  , p_email text
  , p_email_active boolean
)
returns table(account_email_id bigint, uuid uuid)
language plpgsql
as $$
declare
  l_account_email_id bigint;
begin

  insert into account_email (account_id, email, email_active) values (p_account_id, p_email, p_email_active)
  returning account_email.account_email_id into l_account_email_id;

  if not p_email_active then
    return query select l_account_email_id, create_login(p_email);
  else
    return query select l_account_email_id, null::uuid;
  end if;
end$$;

-- comment on function public.create_account_email is 'Adds a new email to the account. If adding a non-active email, the user must verify the email, therefore insert a record into the login table and returns the uuid. Else returns null.';

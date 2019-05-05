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

create or replace function public.deactivate_email_safe
(
  p_account_id bigint
  , p_email text
)
returns void
language plpgsql
as $$
declare l_active_email_count bigint;
begin

  select count(*) into l_active_email_count
  from account_email
  where
    account_email.account_id = p_account_id
    and account_email.email_active
  ;

  if l_active_email_count is null or l_active_email_count < 2 then
    raise exception 'You must have at least one active email.';
  end if;

  perform deactivate_email(p_account_id, p_email);

end$$;


comment on function public.deactivate_email_safe is 'Ensures the user will have at least one active email after deactiving the email.';

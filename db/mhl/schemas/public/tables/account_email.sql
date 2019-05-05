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

create table if not exists public.account_email (
  account_email_id bigserial primary key
  , account_id bigint not null references public.account (account_id)
  , email text not null
  , email_active boolean not null default true
  , account_email_created timestamp with time zone not null default current_timestamp
  , exclude (email with =) where (email_active)
);

create index if not exists account_email_account_id_index on public.account_email(account_id);

comment on table public.account_email is 'Stores emails associated with each account. Accounts may have more than one active email address at a time. An account is considered permenantly deleted if all associated emails are deactivated.';

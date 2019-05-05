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

create table if not exists public.login (
  login_id bigserial primary key
  , uuid uuid not null default gen_random_uuid() unique
  , email text not null
  , email_sent boolean not null default false
  , login_created timestamp with time zone not null default current_timestamp
  , login_exipred timestamp with time zone not null default current_timestamp + interval '1 hour'
);

create index if not exists login_uuid_index on public.login (uuid);

comment on table public.login is 'Records login attempts. When users enter email, the uuid is sent to their email to validate the address.';

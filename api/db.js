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
const { Pool } = require('pg');
const config = require('config');
const pool = new Pool({database: config.get('dbName'), user: config.get('dbUser'), host: config.get('dbHost'), port: config.get('dbPort'), password: config.get('dbPassword')});

/**
 * Simple wrapper function for querying the backend PostgreSQL db.
 */
function query(text, params, callback) {
    return pool.query(text, params, callback);
}

module.exports = { query };

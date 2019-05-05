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

import apiDev from './api-dev';
import apiProd from './api-prod';

var api;
if (!process.env.REACT_APP_API) {
    throw new Error('Please set environment variable REACT_APP_API.');
}

if (process.env.REACT_APP_API === "dev") {
    api = apiDev;
    // { callApi }  = require('./api-dev');
} else if (process.env.REACT_APP_API === "prod")  {
    api = apiProd;
} else {
    throw new Error('Invalid REACT_APP_API: ' + process.env.REACT_APP_API);
}

export {api};
// export { callApi };

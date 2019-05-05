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

/**
* Components with state can use this function to track when users
* alter the state via input elements, check boxes, etc. Ensure the
* element has a "name" attribute the same as the state attribute.
*/
export function handleInputChange(event, callback) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
        [name]: value
    });
    if (callback) {
        callback();
    }
}

/**
* Pass this function an event and callback function, and it will call
* the callback if the event is an Enter key press.
*/
export function checkForEnterKey(event, handleEnterFn) {
    if (event.key === 'Enter') {
        handleEnterFn();
    }
}

/**
* Sleep the specified number of milliseconds. Call like:
* await sleep(3000);
*/
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

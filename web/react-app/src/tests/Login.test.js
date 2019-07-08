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

import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { Login } from '../Login';
import {IsLoggedInContext} from '../App';
import {setSpinnerFunction} from '../api/actions';;
const fn = jest.fn();
setSpinnerFunction(fn);

it('Login renders without crashing', () => {
    render(<Login/>);
});

test('Good email', async () => {
    const testEmail = "test@example.com";
    const { getByPlaceholderText, getByRole, findByText } = render(<IsLoggedInContext.Provider value={false}><Login/></IsLoggedInContext.Provider>);
    const button = getByRole('button', {name: "Submit"});
    const emailInput = getByPlaceholderText('Enter email...');
    fireEvent.change(emailInput, { target: { value: testEmail } });
    fireEvent.click(button);
    await waitFor(() => findByText(`Please check your email for ${testEmail} and open the link in this browser!`));
});

test('Bad email', async () => {
    const { getByPlaceholderText, getByRole, getByText } = render(<IsLoggedInContext.Provider value={false}><Login/></IsLoggedInContext.Provider>);
    const button = getByRole('button', {name: "Submit"});
    const emailInput = getByPlaceholderText('Enter email...');
    fireEvent.change(emailInput, { target: { value: "testbademail" } });
    fireEvent.click(button);
    await waitFor(() => getByText('Invalid email!'));
});

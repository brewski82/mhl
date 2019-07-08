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

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Account } from '../Account';
import {IsLoggedInContext} from '../App';
import {setSpinnerFunction} from '../api/actions';;
const fn = jest.fn();
setSpinnerFunction(fn);

test('Renders', () => {
    render(<Account/>);
});

test('Good email', async () => {
    const { getByPlaceholderText, getByText } = render(<IsLoggedInContext.Provider value={true}><Account/></IsLoggedInContext.Provider>);
    const button = getByText('Add');
    const emailInput = getByPlaceholderText('Add email...');
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(button);
    await waitFor(() => screen.getByRole('alert'));
    expect(screen.getByRole('alert')).toHaveTextContent('Please check you mail to verify your new email address.');
});

test('Bad email', async () => {
    const { getByPlaceholderText, getByText } = render(<IsLoggedInContext.Provider value={true}><Account/></IsLoggedInContext.Provider>);
    const button = getByText('Add');
    const emailInput = getByPlaceholderText('Add email...');
    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    fireEvent.click(button);
    expect(emailInput).toHaveClass("is-invalid");
});

test('Logout', async () => {
    const { getByRole } = render(<IsLoggedInContext.Provider value={true}><Account/></IsLoggedInContext.Provider>);
    const logoutButton = getByRole('button', {name: "Log Out"});
    fireEvent.click(logoutButton);
    expect(screen.findAllByText('Please login to manage your account.')).toBeTruthy();
});

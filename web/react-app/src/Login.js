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

import React, { useState } from 'react';
import { checkForEnterKey } from './Utils';
import { createLogin } from './api/actions';

function Login() {
    const [{showInput, isValid, email}, setState] = useState({showInput: true, isValid: true, email: ''});

    async function handleSubmit() {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            setState({showInput, email, isValid: false});
        } else {
            await createLogin(email);
            setState({isValid: true, showInput: false, email});
        }
    }

    const className = isValid ? "form-control" : "form-control is-invalid";

    return (
            <div>
              {showInput ? (
                  <div className="form-group row">
                    <div className="col-sm-10">
                      Enter a valid email address to receive a message with a login link.
                    </div>
                    <hr/>
                    <div className="col-sm-10">
                      <input className={className} id="enter-email" placeholder="Enter email..."
                             name="email"
                             onChange={e => setState({isValid, showInput, email: e.target.value})}
                             onKeyPress={e => checkForEnterKey(e, handleSubmit)}
                             value={email}
                             type="email" />
                    </div>
                    <button onClick={handleSubmit} className="btn btn-primary mb-2">Submit</button>
                    {!isValid && (<div className="col-sm-10">Invalid email!</div>)}
                  </div>

              ) : (
                  <div>
                    Please check your email for {email} and open the link in this browser!
                  </div>
              )}

            </div>
    );
}

export { Login };

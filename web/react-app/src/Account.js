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

import React, { useState, useEffect, useContext } from 'react';
import { loadEmails, createAccountEmail, doLogout, deactivateAccount } from './api/actions';
import { checkForEnterKey } from './Utils';
import {IsLoggedInContext} from './App';

function Account() {
    const [{addEmailInput, isValid, addedEmail}, setState] = useState({addEmailInput: '', isValid: true, addedEmail: ''});
    const [emails, setEmails] = useState([]);
    const isLoggedIn = useContext(IsLoggedInContext);

    function handleAddEmail() {
        if (addEmailInput && addEmailInput.trim().length > 0) {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(addEmailInput)) {
                setState({isValid: false, addEmailInput, addedEmail});
            } else {
                createAccountEmail(addEmailInput.trim());
                setState((state) => ({
                    isValid: true,
                    addedEmail: "Added email " + state.addEmailInput + " to your account. Please check you mail to verify your new email address.",
                    addEmailInput: ""
                }));
            }
        }
    };

    function handleDeleteAccount() {
        const answer = window.confirm('Are you sure you want to delete your account? You cannot undo this action!');
        if (answer) {
            deactivateAccount();
        }
    }

    useEffect(() => {
        (async () => {
            const e = await loadEmails();
            setEmails(e);
        })();
    }, []);


    if (!isLoggedIn) {
        return (<div><p>Please login to manage your account.</p></div>);
    }
    let className = isValid ? "form-control" : "form-control is-invalid";
    return (
        <div>
          <div className="row">
            <h1>Manage Account</h1>
          </div>
          <div className="row">
            <h3>Emails</h3>
            <p>You can link your account to more than one email. Fill out and submit the following form to add additional emails to your account. You will need to verify any additional email addresses.</p>
            <h5>Current emails:</h5>
            <ul>
              {emails && emails.map(({email}, index) => <li key={index}>{email}</li>)}
            </ul>
          </div>
          <div className="form-group row">
            <div className="col-sm-10">
              <input className={className} id="email" placeholder="Add email..."
                     name="addEmailInput"
                     onChange={e => setState({isValid, addedEmail, addEmailInput: e.target.value})}
                     onKeyPress={e => checkForEnterKey(e, handleAddEmail)}
                     value={addEmailInput}
                     type="email"/>
            </div>
            <button id="add-email-input-button" onClick={handleAddEmail} className="btn btn-primary mb-2">Add</button>
          </div>
          {addedEmail && <div className="alert alert-primary" role="alert">{addedEmail}</div>}
          <div className="row">
            <h3>Log Out</h3>
          </div>
          <div className="row">
            <p>Click the following button to log out of My Honey's List on this device.</p>
          </div>
          <div className="row">
            <button className="btn btn-dark mb-2" onClick={doLogout}>Log Out</button>
          </div>
          <div className="row">
            <h3>Delete Account</h3>
          </div>
          <div className="row">
            <p>Click the button below to delete your account. This action cannot be undone! You will forever loose all your shopping lists!</p>
          </div>
          <div className="row">
            <button className="btn btn-danger mb-2" onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
    );
};

export {Account};

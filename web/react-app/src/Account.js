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
import { loadEmails, createAccountEmail, doLogout, deactivateAccount } from './redux/actions';
import { connect } from "react-redux";
import { handleInputChange, checkForEnterKey } from './Utils';

class AccountComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = { addEmailInput: "", isValid: true, addedEmail: ""};
        this.handleInputChange = handleInputChange.bind(this);
    }

    handleAddEmail = () => {
        if (this.state.addEmailInput && this.state.addEmailInput.trim().length > 0) {
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.state.addEmailInput)) {
                this.setState({isValid: false});
            } else {
                this.props.createAccountEmail(this.state.addEmailInput.trim());
                this.setState((state, props) => ({
                    isValid: true,
                    addedEmail: "Added email " + state.addEmailInput + " to your account. Please check you mail to verify your new email address.",
                    addEmailInput: ""
                }));
            }
        }
    };

    handleDeleteAccount = () => {
        const answer = window.confirm('Are you sure you want to delete your account? You cannot undo this action!');
        if (answer) {
            this.props.deactivateAccount();
        }
    }

    componentDidMount() {
        this.props.loadEmails();
    }

    render() {
        if (!this.props.isLoggedIn) {
            return (<div><p>Please login to manage your account.</p></div>);
        }
        let className = this.state.isValid ? "form-control" : "form-control is-invalid";
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
                  {this.props.emails && this.props.emails.map(({email}, index) => <li key={index}>{email}</li>)}
                </ul>
              </div>
              <div className="form-group row">
                <div className="col-sm-10">
                  <input className={className} id="email" placeholder="Add email..."
                         name="addEmailInput"
                         onChange={this.handleInputChange}
                         onKeyPress={e => checkForEnterKey(e, this.handleAddEmail)}
                         value={this.state.addEmailInput}
                         type="email"/>
                </div>
                <button onClick={this.handleAddEmail} className="btn btn-primary mb-2">Add</button>
              </div>
              {this.state.addedEmail && <div className="alert alert-primary" role="alert">{this.state.addedEmail}</div>}
              <div className="row">
                <h3>Log Out</h3>
              </div>
              <div className="row">
                <p>Click the following button to log out of My Honey's List on this device.</p>
              </div>
              <div className="row">
                <button className="btn btn-dark mb-2" onClick={this.props.doLogout}>Log Out</button>
              </div>
              <div className="row">
                <h3>Delete Account</h3>
              </div>
              <div className="row">
                <p>Click the button below to delete your account. This action cannot be undone! You will forever loose all your shopping lists!</p>
              </div>
              <div className="row">
                <button className="btn btn-danger mb-2" onClick={this.handleDeleteAccount}>Delete Account</button>
              </div>
            </div>
        );
    }
};

const Account = connect((state) => ({isLoggedIn: state.isLoggedIn, emails: state.emails}), {loadEmails, createAccountEmail, doLogout, deactivateAccount})(AccountComponent);

export {Account, AccountComponent};

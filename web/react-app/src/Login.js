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
import { handleInputChange, checkForEnterKey } from './Utils';
import { createLogin } from './redux/actions';
import { connect } from "react-redux";

class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showInput: true, isValid: true, email: ""};
        this.handleInputChange = handleInputChange.bind(this);
    }

    handleSubmit = async () => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(this.state.email)) {
            this.setState({isValid: false});
        } else {
            await this.props.createLogin(this.state.email);
            this.setState({isValid: true});
            this.setState({showInput: false});
        }
    }

    render() {
        let className = this.state.isValid ? "form-control" : "form-control is-invalid";
        return (
            <div>
              {this.state.showInput ? (
                  <div className="form-group row">
                    <div className="col-sm-10">
                      Enter a valid email address to receive a message with a login link.
                    </div>
                    <hr/>
                    <div className="col-sm-10">
                      <input className={className} id="enter-email" placeholder="Enter email..."
                             name="email"
                             onChange={this.handleInputChange}
                             onKeyPress={e => checkForEnterKey(e, this.handleSubmit)}
                             value={this.state.email}
                             type="email" />
                    </div>
                    <button onClick={this.handleSubmit} className="btn btn-primary mb-2">Submit</button>
                    {!this.state.isValid && (<div className="col-sm-10">Invalid email!</div>)}
                  </div>

              ) : (
                  <div>
                    Please check your email for {this.state.email} and open the link in this browser!
                  </div>
              )}

            </div>
        );
    }
}

const Login = connect(null, {createLogin})(LoginComponent);

export { Login };

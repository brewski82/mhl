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
import { connect } from "react-redux";

class SpinnerComponent extends React.Component {
    defaultRender = <div/>;
    savingSpinner = <div className="fixed-bottom d-flex justify-content-end align-items-center text-success">Saving...
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="sr-only">
                          Loading...
                        </span>
                      </div>
                    </div>;
    loadingSpinner = <div className="fixed-bottom d-flex justify-content-end align-items-center text-info">Loading...
                       <div className="spinner-border spinner-border-sm" role="status">
                         <span className="sr-only">
                           Loading...
                         </span>
                       </div>
                     </div>;
    savedSpinner = <div className="fixed-bottom d-flex justify-content-end align-items-center text-success">Saved!</div>;
    errorSpinner = <div className="fixed-bottom d-flex justify-content-end align-items-center text-danger">An error occurred. Please refresh and try again.</div>;

    render() {
        switch (this.props.spinnerState) {
        case "saving": return this.savingSpinner;
        case "saved": return this.savedSpinner;
        case "error": return this.errorSpinner;
        case "loading": return this.loadingSpinner;
        default: return this.defaultRender;
        }
    }
}

const Spinner = connect(state => ({spinnerState: state.spinnerState}), null)(SpinnerComponent);

export class Footer extends React.Component {
    render() {
        return <footer className="footer navbar fixed-bottom">
                 <div className="container">
                   <p><span className="text-muted">Copyright 2019 William R. Bruschi - This application is licensed under the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">AGPL</a> license and the <a href="https://github.com/brewski82/mhl">source</a> is available.</span></p>
                 </div>
                 <Spinner/>
               </footer>;
    }
}

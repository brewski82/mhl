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

const restify = require('restify');
const errs = require('restify-errors');
const sessions = require("client-sessions");
const config = require('config');
const db = require('./db');
const HandlerContainer = require('./handlers');
const server = restify.createServer();
const nodemailer = require("nodemailer");
const emailHost = config.get('emailHost');

// If we do not have an email host, assume dev mode and create a fake
// transport object.
let emailTransporter = null;
if (emailHost.length < 1) {
    emailTransporter = {sendMail: email => console.log('Sent email: ' + email) };
} else {
    emailTransporter = nodemailer.createTransport({
        host: config.get('emailHost'),
        port: config.get('emailPort'),
        secure: true,
        auth: {
            user: config.get('emailUser'),
            pass: config.get('emailPassword')
        }
    });
}

const handlerContainer = new HandlerContainer(db, errs, emailTransporter, config);
const createPaths = require('./paths');

// This encrypted cookie will hold the user's account id.
server.use(sessions({
    cookieName: 'session',
    secret: config.get('sessionSecret'),
    duration: 365 * 24 * 60 * 60 * 1000
}));

// Parse bodies for post and put requests.
server.use(restify.plugins.bodyParser());

// Setup the paths.
createPaths(server, handlerContainer);

// Start accepting connections.
server.listen(config.get('serverPort'), function() {
  console.log('%s listening at %s', server.name, server.url);
});

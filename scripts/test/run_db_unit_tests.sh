#!/bin/bash

################################################################################
# Copyright 2019 William R. Bruschi

# This file is part of My Honey's List.

# My Honey's List is free software: you can redistribute it and/or
# modify it under the terms of the GNU Affero General Public License
# as published by the Free Software Foundation, either version 3 of
# the License, or (at your option) any later version.

# My Honey's List is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Affero General Public License for more details.

# You should have received a copy of the GNU Affero General Public
# License along with My Honey's List.  If not, see
# <https://www.gnu.org/licenses/>.

# Additional Terms:

# Per section 7.b and 7.c of the GNU Affero General Public License
# version 3, you must preserve the copyright notice and a link to
# https://github.com/brewski82/mhl in the footer of the user
# interface.
################################################################################

################################################################################
#
# run_db_unit_tests.sh
#
# Uses pghops to run the database unit tests.
#
# Arguments
#  db_port: Defaults to 5656. The db port to launch the PostgreSQL
#           docker container and run the tests on.
#
################################################################################

set -e
set -u

file_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
script_dir="$file_dir/.."
base_dir="$script_dir/.."
db_dir="$base_dir/db"
source "$script_dir/utils.sh"

db_port="${1:-5656}"

log_message "Run database migration using port $db_port."
pghops_test --cluster-directory="$db_dir" \
            --psql-base-args="--port=$db_port --host=localhost --username=postgres --echo-all --no-psqlrc --set=SHOW_CONTEXT=never" \
            --docker-port=$db_port \
            --psql-base-migration-args="--port=$db_port --host=localhost --username=postgres --echo-all --no-psqlrc --set ON_ERROR_STOP=1" \
            run
log_message "DB tests passed!"

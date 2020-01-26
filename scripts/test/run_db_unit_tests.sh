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
# Environment variables:
#
#  MHL_DB_PORT: Defaults to 5656. The db port to launch the PostgreSQL
#  docker container and run the tests on.
#
#  MHL_CONTAINER_RUNTIME: The type of container runtime to use
#  (docker, podman, etc.) Defaults to docker.
#
################################################################################

set -e
set -u

file_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
script_dir="$file_dir/.."
base_dir="$script_dir/.."
db_dir="$base_dir/db"
source "$script_dir/utils.sh"

MHL_DB_PORT="${MHL_DB_PORT:-5656}"
MHL_CONTAINER_RUNTIME="${MHL_CONTAINER_RUNTIME:-docker}"

log_message "Run database migration using port $MHL_DB_PORT and container runtime $MHL_CONTAINER_RUNTIME."
cd /home/wbruschi/dev/pghops
python3 -m pghops.main.test --cluster-directory="$db_dir" \
            --psql-base-args="--port=$MHL_DB_PORT --host=localhost --username=postgres --echo-all --no-psqlrc --set=SHOW_CONTEXT=never" \
            --container-port="$MHL_DB_PORT" \
            --container-runtime="$MHL_CONTAINER_RUNTIME" \
            --psql-base-migration-args="--port=$MHL_DB_PORT --host=localhost --username=postgres --echo-all --no-psqlrc --set ON_ERROR_STOP=1" \
            run
log_message "DB tests passed!"

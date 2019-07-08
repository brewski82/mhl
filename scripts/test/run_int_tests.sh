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
# run_int_tests.sh
#
# Runs integration tests using docker.
#
# Arguments:
#  skip-setup: If you already created the docker containers using the
#              launch_int_env.sh script, you can pass Y as the first
#              argument to skip this step. You typically only need to
#              do this if you need to create an env with non-default
#              settings.
#
# Env variables:
#   MHL_DB_PORT: The port the container PostgreSQL runs on. Defaults to 5656.
#
################################################################################

set -e
set -u

file_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
script_dir="$file_dir/.."
source "$script_dir/utils.sh"

skip_setup="${1:-N}"
container_runtime="${MHL_CONTAINER_RUNTIME:-docker}"

if [ "$skip_setup" != "Y" ]; then
    pushd "$file_dir" > /dev/null
    ./launch_int_env.sh --build-api f --build-web f --container-runtime $container_runtime
    popd > /dev/null
fi

log_message "Start int tests."

pushd "$file_dir/int-test-src" > /dev/null
MHL_WEB_PORT="${MHL_WEB_PORT:-8080}" MHL_DB_PORT="${MHL_DB_PORT:-5656}" npm run test
log_message "INT tests passed!"
log_message "Shutting down containers."
cd ..
./docker-compose-down.sh --container-runtime $container_runtime
popd > /dev/null
log_message "Done INT tests."

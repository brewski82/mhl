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
# launch_int_env.sh
#
# Launches containers to setup the environment for int testing.
#
################################################################################

set -e
set -u

file_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
script_dir="$file_dir/.."
base_dir="$script_dir/.."
db_dir="$base_dir/db"
source "$script_dir/utils.sh"

# Defaults for arguments:
build_api="t"
build_web="t"
db_port="${MHL_DB_PORT:-5656}"
postgres_image="postgres:11"
api_port=8888
web_port="${MHL_WEB_PORT:-8080}"
container_runtime="${MHL_CONTAINER_RUNTIME:-docker}"

positional=()
while [[ $# -gt 0 ]]
do
    key="$1"

    case $key in
        --build-api)
            build_api="$2"
            shift
            shift
            ;;
        --build-web)
            build_web="$2"
            shift
            shift
            ;;
        --db-port)
            db_port="$2"
            shift
            shift
            ;;
        --api-port)
            api_port="$2"
            shift
            shift
            ;;
        --postgres-image)
            postgres_image="$2"
            shift
            shift
            ;;
        --container-runtime)
            container_runtime="$2"
            shift
            shift
            ;;
        --web-port)
            web_port="$2"
            shift
            shift
            ;;
        *)
            positional+=("$1")
            shift
            ;;
    esac
done
set -- "${positional[@]}"

if [ "$build_api" == "t" ]; then
    "$script_dir/build/build_api.sh"
fi

if [ "$build_web" == "t" ]; then
    "$script_dir/build/build_web.sh"
fi

log_message "Get images tags."
export MHL_WEB_TAG=$(extract_npm_tag "$base_dir/web/react-app")
export MHL_API_TAG=$(extract_npm_tag "$base_dir/api")
export MHL_API_CONFIG="$file_dir/config/default.json"
export MHL_WEB_CONFIG="$file_dir/config/default.conf"
export MHL_DB_TAG="$postgres_image"
export MHL_DB_PORT="$db_port"
export MHL_API_PORT="$api_port"
export MHL_CONTAINER_RUNTIME="$container_runtime"
export MHL_WEB_PORT="$web_port"
log_message "Env variables for compose file:"
log_message "MHL_API_TAG = $MHL_API_TAG"
log_message "MHL_WEB_TAG = $MHL_WEB_TAG"
log_message "MHL_API_CONFIG = $MHL_API_CONFIG"
log_message "MHL_WEB_CONFIG = $MHL_WEB_CONFIG"
log_message "MHL_DB_TAG = $MHL_DB_TAG"
log_message "MHL_DB_PORT = $MHL_DB_PORT"
log_message "MHL_API_PORT = $MHL_API_PORT"
log_message "MHL_CONTAINER_RUNTIME = $MHL_CONTAINER_RUNTIME"
log_message "MHL_WEB_PORT = $MHL_WEB_PORT"

compose_command=docker-compose
if [ "$MHL_CONTAINER_RUNTIME" == "podman" ]; then
    compose_command=podman-compose
fi

log_message "Launch containers."
$compose_command --file "$file_dir/docker-compose.yml" --project-name "mhl" up --detach

log_message "Wait for PostgreSQL server."

function ping_server() {
    attempts=1
    while [ "$attempts" -le 12 ]; do
	log_message "Ping attempt $attempts"
	if psql -p $MHL_DB_PORT -h localhost -U postgres -c "select 1;" > /dev/null 2>&1; then
	    return
	fi
	attempts=$(expr $attempts + 1)
	sleep 2s
    done
    log_message "Unable to reach PostgreSQL server."
    return 1
}

ping_server

log_message "Run database migration."
pghops "$db_dir" --psql-args="-h localhost -p $MHL_DB_PORT -U postgres" --verbosity=terse

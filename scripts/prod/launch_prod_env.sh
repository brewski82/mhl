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
# launch_prod_env.sh
#
# Launches docker containers to run a production environment.
#
# Arguments:
#
# --build-api: When t, the default, build the api docker image.
# --build-web: When t, the default, building web docker image.
# --db-port: The PostgreSQL db port for connecting. Defaults to
#            MHL_DB_PORT.
# --postgres-image: The name of the PostgreSQL docker image to
#                   use. Defaults to MHL_DB_TAG.
# --web-config-path: Path to a directory containing nginx
#                    configuration files. See
#                    https://github.com/wmnnd/nginx-certbot for more
#                    info, as this value represents "./data/" in that
#                    example. Defaults to MHL_WEB_CONFIG.
# --api-config-path: Path to a nodejs default.json file. Defaults to
#                    MHL_API_CONFIG.
# --db-vol-path: Path to a directory where PostgreSQL stores its
#                data. Defaults to MHL_DB_VOL.
# --cert-conf: Path to cert conf directory. Defaults to MHL_WEB_CERT_CONF.
# --cert-www: Path to cert www directory. Defaults to MHL_WEB_CERT_WWW
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
            MHL_DB_PORT="$2"
            shift
            shift
            ;;
        --postgres-image)
            MHL_DB_TAG="$2"
            shift
            shift
            ;;
        --web-config-path)
            MHL_WEB_CONFIG="$2"
            shift
            shift
            ;;
        --api-config-path)
            MHL_API_CONFIG="$2"
            shift
            shift
            ;;
        --db-vol-path)
            MHL_DB_VOL="$2"
            shift
            shift
            ;;
    esac
done

if [ "$build_api" == "t" ]; then
    "$script_dir/build/build_api.sh"
fi

if [ "$build_web" == "t" ]; then
    "$script_dir/build/build_web.sh"
fi

log_message "Get docker tags."
export MHL_WEB_TAG=$(extract_npm_tag "$base_dir/web/react-app")
export MHL_API_TAG=$(extract_npm_tag "$base_dir/api")
export MHL_API_CONFIG
export MHL_WEB_CONFIG
export MHL_DB_TAG
export MHL_DB_PORT
export MHL_API_PORT
export MHL_DB_VOL
log_message "Env variables for docker compose file:"
log_message "MHL_API_TAG = $MHL_API_TAG"
log_message "MHL_WEB_TAG = $MHL_WEB_TAG"
log_message "MHL_API_CONFIG = $MHL_API_CONFIG"
log_message "MHL_WEB_CONFIG = $MHL_WEB_CONFIG"
log_message "MHL_DB_TAG = $MHL_DB_TAG"
log_message "MHL_DB_PORT = $MHL_DB_PORT"

log_message "Launch containers."
docker-compose --file "$file_dir/docker-compose.yml" --project-name "mhl" up --detach

log_message "Wait for PostgreSQL server."

function ping_server() {
    attempts=1
    while [ "$attempts" -le 30 ]; do
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

log_message "Done launching!"

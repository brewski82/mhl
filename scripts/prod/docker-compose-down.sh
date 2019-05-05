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
# docker-compose-down.sh
#
# Convienence functiont to call docker-compose down with env variables
# set.
#
################################################################################

set -e
set -u

file_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
script_dir="$file_dir/.."
base_dir="$script_dir/.."
source "$script_dir/utils.sh"

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

log_message "Shut down containers."
docker-compose --file "$file_dir/docker-compose.yml" --project-name "mhl" down

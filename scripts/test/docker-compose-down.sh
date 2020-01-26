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

# Defaults for arguments:
db_port=5656
api_port=8888
postgres_image="postgres:11"
web_port="${MHL_WEB_PORT:-8080}"
container_runtime="${MHL_CONTAINER_RUNTIME:-docker}"

positional=()
while [[ $# -gt 0 ]]
do
    key="$1"

    case $key in
        --db_port)
            db_port="$2"
            shift
            shift
            ;;
        --postgres_image)
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

log_message "Get docker tags."
export MHL_WEB_TAG=$(extract_npm_tag "$base_dir/web/react-app")
export MHL_API_TAG=$(extract_npm_tag "$base_dir/api")
export MHL_API_CONFIG="$file_dir/config/default.json"
export MHL_WEB_CONFIG="$file_dir/config/default.conf"
export MHL_DB_TAG="$postgres_image"
export MHL_DB_PORT="$db_port"
export MHL_API_PORT="$api_port"
export MHL_CONTAINER_RUNTIME="$container_runtime"
export MHL_WEB_PORT="$web_port"
log_message "Env variables for docker compose file:"
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
log_message "Shut down containers."
$compose_command --file "$file_dir/docker-compose.yml" --project-name "mhl" down

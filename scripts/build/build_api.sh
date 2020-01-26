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
# build_api.sh
#
# Builds and containerizes the nodejs api server. Be sure the
# package.json file in the api directory has a new version, as the
# docker tag is based off the version and will error if the docker tag
# already exists.
#
################################################################################

set -e
set -u

file_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
build_dir="$file_dir/docker/api/src"
src_dir="$file_dir/../../api"
source "$file_dir/../utils.sh"
container_runtime="${MHL_CONTAINER_RUNTIME:-docker}"

function do_build() {
    log_message "Building api image."
    tag=$(extract_npm_tag "$src_dir")
    log_message "Tag = $tag"
    log_message "Copy files in $src_dir to $build_dir ."
    rm -rf "$build_dir"
    mkdir "$build_dir"
    cp -r "$src_dir/"* "$build_dir/"
    pushd "$file_dir/docker/api" > /dev/null
    if [ "$(does_tag_exist $tag)" == "Y" ]; then
        log_message "Halting build as it appears the image tag $tag already exists."
        log_message "Please either delete the tag or adjust the api version in package.json"
        return 2
    fi
    log_message "Building image."
    $container_runtime build -t "$tag" .
    popd > /dev/null
    log_message "Done building $tag."
}

do_build

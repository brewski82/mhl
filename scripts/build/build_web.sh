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
# build_web.sh
#
# Builds the react web application and creates an nginx docker image
# from the result. Be sure the package.json file for the web app has a
# new version, as the image tag is based off the version and will
# error if the image tag already exists.
#
################################################################################

set -e
set -u

file_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
build_dir="$file_dir/docker/web/src"
src_dir="$file_dir/../../web/react-app"
source "$file_dir/../utils.sh"
container_runtime="${MHL_CONTAINER_RUNTIME:-docker}"

function do_build() {
    log_message "Build static web app for $src_dir."
    pushd "$src_dir" > /dev/null
    $container_runtime run -it --rm --name mhl-node-build \
                       -v "$PWD":/usr/src/app:z \
                       -w /usr/src/app \
                       -e REACT_APP_API="prod" \
                       node:11 npm run build
    tag=$(extract_npm_tag "$src_dir")
    log_message "Tag = $tag"
    src_build_dir="$src_dir/build"
    log_message "Copy files in $src_build_dir to $build_dir ."
    rm -rf "$build_dir"
    mkdir "$build_dir"
    cp -r "$src_build_dir/"* "$build_dir/"
    pushd "$file_dir/docker/web" > /dev/null
    if [ "$(does_tag_exist $tag)" == "Y" ]; then
        log_message "Halting build as it appears the image tag $tag already exists."
        log_message "Please either delete the tag or adjust the web version in package.json"
        return 2
    fi
    log_message "Building image"
    $container_runtime build -t "$tag" .
    popd > /dev/null
    popd > /dev/null
    log_message "Done building $tag."
}

do_build

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
# utils.sh
#
# Various utilities shared by shell scripts.
#
################################################################################


################################################################################
# Returns the name and version of npm package. Primarily used for
# docker image tags.
#
# Args:
#   package_file_dir: Path to the package's package.json directory.
#
# Returns: The name and version of the package in the format
#          name:version.
################################################################################
function extract_npm_tag() {
    package_file_dir="$1"
    pushd "$package_file_dir" > /dev/null
    npm ls | head -n 1 | cut -d ' ' -f 1 | sed s/@/:/g
    popd > /dev/null
}

################################################################################
# Determines if the provided docker tag already exists.
#
# Args:
#   tag: The docker tag to check for.
#
# Returns: Outputs Y if the tag exists, N otherwise.
#
################################################################################
function does_tag_exist() {
    tag="$1"
    tag_count=$(docker images "$tag" | wc -l)
    if [ "$tag_count" -ne "1" ]; then
        echo "Y"
    else
        echo "N"
    fi
}

################################################################################
# Outputs the provided message to standard out in a consistent format.
#
# Args:
#   message: The message to output.
#
################################################################################
function log_message() {
    message="$1"
    echo "$(date +%Y%m%d-%H%M%S): $message"
}

#!/bin/bash
LC_ALL=C
random_string=$(openssl rand -base64 875 | tr -d '\n' | cut -c 1-700)
working_directory=$(pwd)

case "$(uname -sr)" in

   Darwin*)
    echo 'Mac OS X'
    mkdir mongoconf
    echo "$random_string" > "$working_directory"/mongoconf/keyfile.txt
    ;;

   Linux*Microsoft*)
    echo 'WSL'  
    mkdir mongoconf
    echo "$random_string" > "$working_directory"/mongoconf/keyfile.txt
    ;;

   Linux*)
    echo 'Linux'
    mkdir mongoconf
    echo "$random_string" > "$working_directory"/mongoconf/keyfile.txt
    ;;

   CYGWIN*|MINGW*|MINGW32*|MSYS*)
    echo 'MS Windows'
    echo "Error: please enter how to generate the keyfile for your system. look at $(pwd)/scripts/gen-sk.sh for examples"
    exit 1
    ;;

   *)
    echo 'Other OS' 
    echo "Error: please enter how to generate the keyfile for your system. look at $(pwd)/scripts/gen-sk.sh for examples"
    exit 1
    ;;
esac
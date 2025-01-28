#!/bin/bash
command="docker-compose up -d"
setup=0

while [ $# -gt 0 ]; do
    case "$1" in
    "--setup")
            echo "setup"
            setup=1
            ;;
    "-b")
            echo "build"
            command+=" --build"
            ;;
    *)
        echo "Error: '$1' is not a valid argument."
        exit 1
        ;;
    esac
    shift  # Remove the processed argument
done

if [ $setup -eq 1 ]
then
    "$(pwd)"/scripts/gen-sk.sh
    sleep 2
fi

$command

if [ $setup -eq 1 ]
then
    sleep 5
    
    docker exec mongodbmain bash -c /etc/init_mongo_repl.sh
fi

docker-compose logs --tail=0 --follow
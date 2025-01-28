#!/bin/bash
command="docker-compose down"
reset_state=0

while [ $# -gt 0 ]; do
    case "$1" in
    "--resetState")
            reset_state=1
            ;;
    *)
        echo "Error: '$1' is not a valid argument."
        exit 1
        ;;
    esac
    shift  # Remove the processed argument
done

echo "CLOSING DOCKER CONTAINER"
$command

if [ $reset_state -eq 1 ]
then
    echo "DELETING DB FOLDER"
    rm -r db
    rm -r mongoconf
fi
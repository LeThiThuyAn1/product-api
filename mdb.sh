#!/bin/bash
# Dùng: bash mdb.sh              -> vào shell tương tác
#       bash mdb.sh "lệnh JS"    -> chạy một lệnh rồi thoát
if [ -z "$1" ]; then
  docker exec -it nammongodb sh -c 'mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin productdb'
else
  docker exec nammongodb sh -c 'mongosh -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin productdb --quiet --eval "$0"' "$1"
fi
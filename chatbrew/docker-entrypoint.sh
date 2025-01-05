#!/bin/sh
. .env

until nc -z -v -w30 $CB_DB_HOST $CB_DB_PORT
do
  echo "Waiting for database connection..."
  # wait for 5 seconds before check again
  sleep 5
done

if [ $TARGET = dev ]; then
  echo "Running development server"
  yarn develop
elif [ $TARGET = prod ]; then
  echo "Running production server"
  NODE_ENV=production yarn start
else
  echo "Please specify TARGET"
  exit 1
fi

#!/bin/sh
. .env

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

#!/bin/sh

APPNAME=$2
STEROIDSCMD=$1

EXAMPLES="accelerometer animation audio compass device geolocation modal notification preload storage"
TUTORIALS="begin"


echo "running $STEROIDSCMD create $APPNAME"

$STEROIDSCMD create $APPNAME
if [ "$?" != "0" ]; then
  echo "error"
  exit 1
fi

cd $APPNAME
STEROIDSCMD="../$STEROIDSCMD"

for EXAMPLE in $EXAMPLES; do
  $STEROIDSCMD generate example $EXAMPLE
done

for TUTORIAL in $TUTORIALS; do
  $STEROIDSCMD generate tutorial $TUTORIAL
done


#!/bin/sh

head -n 20 CHANGELOG.md

echo "Is changelog ok?"
read

git status

echo "Git status ok?"

read

echo "Versioning the npm, now it's a good time to CTRL+C if you don't want to patch?"

read

DEFAULTSEVERITY=patch
SEVERITY=${1:-$DEFAULTSEVERITY}

npm version $SEVERITY || exit 1

git push && git push --tags && npm publish ./

echo "DONE, remember that clients will check from updates.appgyver.com"


echo "Next up: generating a new project with this for testing?"
read

cd test

CURRENTVERSION=$(./getversion.js)

./generate.sh ../bin/steroids v$CURRENTVERSION || exit 1

cd ..

git add test
git commit -m "generated with $CURRENTVERSION"

echo "done, push pls"

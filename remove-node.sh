#!/bin/sh

sudo npm cache clean
sudo rm -rf /usr/local/lib/node
sudo rm -rf /usr/local/lib/node_modules

sudo rm /usr/local/bin/node
sudo rm /usr/local/bin/npm
sudo rm /usr/local/bin/node-gyp
sudo rm /usr/local/bin/node-waf

sudo rm -rf $HOME/.npm
sudo rm -rf $HOME/.node-gyp

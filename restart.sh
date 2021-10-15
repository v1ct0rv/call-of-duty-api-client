#!/bin/sh
forever restart index.js && forever restart server.js && forever list

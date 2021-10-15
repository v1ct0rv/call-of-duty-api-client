#!/bin/sh
forever start index.js && forever start server.js && forever list

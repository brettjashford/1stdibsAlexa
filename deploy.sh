#!/bin/bash
rm 1stdibsAlexa.zip 
zip -X -r 1stdibsAlexa.zip ./*
aws lambda update-function-code --function-name 1stdibsAlexa --zip-file fileb://1stdibsAlexa.zip

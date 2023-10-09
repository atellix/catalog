#!/bin/bash

tsc generate_interfaces.ts && node generate_interfaces.js > interfaces/index.ts
tsc export_interfaces.ts && node export_interfaces.js > interfaces/object_schema.json

#!/bin/bash

# Create the config.js from template
cp js/config.template.js js/config.js

# Replace the placeholders with environment variables
sed -i "s/SHEET_ID_PLACEHOLDER/$GOOGLE_SHEETS_ID/g" config.js
sed -i "s/API_KEY_PLACEHOLDER/$GOOGLE_SHEETS_API_KEY/g" config.js
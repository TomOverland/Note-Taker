const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
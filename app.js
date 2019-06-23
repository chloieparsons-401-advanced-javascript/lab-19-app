'use strict';

const fs = require('fs');
const promisify = require('util');

const Q = require('@nmq/q/client');

const readFile = typeof fs.readFile === 'function' ? promisify(fs.readFile) : async function () {
  throw new Error('Invalid operation.');};

const writeFile = typeof fs.writeFile === 'function' ? promisify(fs.writeFile) : async function () {
  throw new Error('Invalid operation.');};

let read = (file) => {return readFile(file);};
let write = (file, buffer) => {return writeFile(file, buffer);};
let upperCase = (buffer) => {Buffer.from(buffer.toString().trim().toUpperCase());};

let alterFile = (file) => {
  read(file) 
    .then(upperCase)
    .then(buffer =>write(file, buffer))
    .then(() => Q.publish('file-save', file))
    .catch(error => Q.publish('file-error', error));
};

let file = process.argv.slice(2).shift();
alterFile(file);

module.exports= {alterFile, file};

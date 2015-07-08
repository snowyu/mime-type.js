'use strict'

var db = require('mime-db')
var MimeType = require('./lib/mime-type')

module.exports = MimeType(db)
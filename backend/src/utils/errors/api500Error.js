const httpStatusCodes = require('./httpStatusCode')
const BaseError = require('./baseError')

class Api404Error extends BaseError {
 constructor (
    message,
 statusCode = httpStatusCodes.INTERNAL_SERVER,
 description = 'Error Internal Server.',
 isOperational = true
 ) {
 super(message, statusCode, isOperational, description)
 }
}

module.exports = Api404Error
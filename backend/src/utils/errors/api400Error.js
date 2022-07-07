const httpStatusCodes = require('./httpStatusCode')
const BaseError = require('./baseError')

class Api404Error extends BaseError {
 constructor (
    message,
 statusCode = httpStatusCodes.BAD_REQUEST,
 description = 'Bad Request.',
 isOperational = true
 ) {
 super(message, statusCode, isOperational, description)
 }
}

module.exports = Api404Error
/**
 * A common service error object. This represents any error that occurs
 * in any of the service classes.
 */
export default class ServiceError extends Error {
    constructor(name, message) {
        super();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        this.name = name;
        this.message = message;
    }
}
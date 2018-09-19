module.exports = {
    BaseError: (status, message, debugInfo) => {
        Error.call(this, message);
        this.message = message;
        this.status = status;
        if (debugInfo) this.debugInfo = debugInfo;
      }
}
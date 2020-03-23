class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super();
      this.statusCode = statusCode;
      this.message = message;
    }
  }
  const handleError = (err, res) => {

    console.log("handleError",err)
    const { statusCode, message } = err;
    res.send(statusCode).json({
      status: "error",
      statusCode,
      message
    });
  };

  module.exports = {
    ErrorHandler,
    handleError
  }
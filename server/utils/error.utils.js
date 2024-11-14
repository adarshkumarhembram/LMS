class AppError extends Error {
    constructor(message, ststuscode){
        super(message);


        this.ststuscode = ststuscode;

        Error.captureStackTrace(this, this.contructor);
    }
}

export default AppError;
const errorMiddleware = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;
    err.messege = err.messege || "Something went wrong!";

    res.status(err.statusCode).json({
        success: false,
        messege: err.messege,
        stack: err.stack
    })
}

export default errorMiddleware;
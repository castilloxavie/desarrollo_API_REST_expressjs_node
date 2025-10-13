const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "ocurrio un error en el proceso"

    //registrar el error en consola para depurar
    console.error(`[ERROR] ${new Date().toISOString()} - ${statusCode} - ${message}`)

    //mas informacion del error
    if(err.stack){
        console.error(err.stack)
    }

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && {stack: err.stack})
    })
}

module.exports =errorHandler
const loggerMiddlewares = (req, res, next) => {
    const fecha = new Date().toISOString()
    console.log(`[${fecha} ${req.method} ${req.url} IP: ${req.ip}]`);
    const tiempo  =  Date.now()
    res.on("finish", () => {
        const duracion = Date.now() - tiempo
        console.log(`[${fecha} response: ${res.statusCode} - ${duracion}ms]`);
        
    })

    next();
    
}
module.exports = loggerMiddlewares
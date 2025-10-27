const {createTimeBlockService, listReservationsService} = require("../services/adminService");

const createTimeBlock = async (req, res) => {
    try {
        if(req.user.role !== "ADMIN") {
            return res.status(403).json({error: "Acceso denegado"});
        }

        const {startTime, endTime} = req.body;

        try {
            const newTimeBlock = await createTimeBlockService({startTime, endTime});
            res.status(201).json(newTimeBlock);
        } catch (error) {
            res.status(500).json({error: "Error al crear el bloque de tiempo"});
        }

    } catch (error) {
        res.status(500).json({error:" Error del servidor"});
    }
}

const listReservations = async (req, res) => {
    try {
        if(req.user.role !== "ADMIN") {
            return res.status(403).json({error: "Acceso denegado"});
        }

        const reservations = await listReservationsService();
        res.json(reservations);

    } catch (error) {
        res.status(500).json({error: "Error del servidor, para obtener las reservas"});
    }
}

module.exports = {
    createTimeBlock,
    listReservations
}
const Historial = require('../models/m_historial_uso_vehiculo');
const Vehicle = require('../models/m_vehiculo');
const Description = require('./c_descripcion_uso_vehiculo');

class historial_vehiculo_controller {
    constructor() {

    }


    /*
    Inserta un registro en la tabla de transacciones
     */
    async Create(vehicle, user_session, new_mileage, details = '', codeDes = '1') {
        try {
            if (vehicle.CodigoActivoFijo) {
                if (!details) {
                    details = await Description.getNameByCode(codeDes);
                }
                var new_record = await Historial.create({
                    FechaHoraUso: new Date(),
                    CodigoActivoFijo_Vehiculo: vehicle.CodigoActivoFijo,
                    CodigoDescripcionUso: codeDes,
                    NuevoKilometraje: new_mileage,
                    DetalleUso: details,
                    ResponsableRegistro: user_session.CodigoUsuario
                });
                await Vehicle.update({
                    KilometrajeActual: new_mileage
                }, {
                    where: {
                        CodigoActivoFijo: vehicle.CodigoActivoFijo
                    }
                });
                var registry = JSON.stringify(new_record)
                console.log(registry);
                return registry;
            } else {
                throw "Vehículo no definido";
            }
        } catch (error) {
            console.log(error)
        }
    }


};

module.exports = new historial_vehiculo_controller();
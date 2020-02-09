const Vehicle = require('./m_vehiculo');
const Historial = require('./m_historial_uso_vehiculo');
const Description = require('./m_descripcion_uso_vehiculo');
const Direccion = require('./m_direccion');
/*
const Frequent_Place = require('./m_lugares_frecuentes');
const Route = require('./m_route');
const Voucher = require('./m_voucher');
const Voucher_procu_assign = require('./m_voucher_procu_assign');
const Voucher_folo6_assign = require('./m_voucher_folo6_assign');
const Folo6 = require('./m_folo6');
const Employee = require('./m_employee');
const Unit = require('./m_unit');
const Places_container = require('./m_places_container');
const Folo6_Approve_State = require('./m_folo6_approve_state');
const Route_conditions = require('../models/m_route_conditions'); */
const User = require('./m_usuario');
const Rol = require('./m_perfil');
const UserRol = require('./m_usuario_por_perfil');
const Reporte = require('./m_reporte');
const ReportePorPerfil = require('./m_reporte_por_perfil');
/* const ProcurementBill = require('./m_bill');
const CosumedBill = require('./m_bill_close');
const Mision = require('../models/m_mision');
const Driver = require('./m_driver');
const Driver_assign = require('./m_driver_assign');
const Vehicle_folo6_assign = require('../models/m_vehicle_folo6_assign'); */

class Migration {
    constructor() {
        /* 
        Driver.sync({
            alter: false
        });
        Mision.sync({
            alter: false
        });
        
        Procuraduria.sync({
            alter: false
        }); */
        /* Vehicle.sync({
            alter: false
        });
        Description.sync({
            alter: false
        });
        Historial.sync({
            alter: false
        }); */
        /* Direccion.sync({
            alter: true
        }); */
        /* Frequent_Place.sync({
            alter: false
        });
        Voucher.sync({
            alter: false
        });
        Unit.sync({
            alter: false
        });
        Employee.sync({
            alter: false
        });
        Folo6.sync({
            alter: false
        });
        Places_container.sync({
            alter: false
        });
        Voucher_procu_assign.sync({
            alter: false
        });
        Voucher_folo6_assign.sync({
            alter: false
        });
        Folo6_Approve_State.sync({
            alter: false
        });
        Route.sync({
            alter: false
        });
        Route_conditions.sync({
            alter: false
        }); */
        /* User.sync({
            alter: false
        });
        UserRol.sync({
            alter: false
        });
        Rol.sync({
            alter: false
        });
        Reporte.sync({
            alter: false
        });
        ReportePorPerfil.sync({
            alter: false
        }); */
        /* Vehicle_folo6_assign.sync({
            alter: false
        });
        ProcurementBill.sync({
            alter: false
        });
        CosumedBill.sync({
            alter: false
        });
        Driver_assign.sync({
            alter: false
        }); */
    };
};

module.exports = Migration;
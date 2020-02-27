/*
21062019_DD
Controlador del modelo Vehicle
*/

const Vehicle = require('../models/m_vehiculo');
const TipoVehiculo = require('../models/m_tipo_vehiculo');
const CodigoEstado = require('../models/m_estado_vehiculo');
const OficinaResponsableVehiculo = require('../models/m_oficina_responsable_vehiculo');
const TipoVehiculoController = require('./c_tipo_vehiculo');
const EstadoVehiculoController = require('./c_estado_vehiculo');
const OficinasResponsableController = require('./c_oficina_responsable');
const HistorialDeUsoController = require('./c_historial_vehiculo');
const DescripcionUsoController = require('./c_descripcion_uso_vehiculo');
const Authorize = require('./c_auth');
const Sequelize = require('sequelize');
const querystring = require('querystring');
const pdfPrinter = require('pdfmake/src/printer');
const {
    validationResult
} = require('express-validator');

//Clase controller que contiene todos los metodos necesarios para la gestion
//de vehiculos
class Vehicle_controller {
    constructor() {

    }

    //Genera el arreglo de los tipos de combustible
    //25012020_DD
    getFuels() {
        var fuels = [];
        let fuel = new Object()
        fuel.TipoCombustibleCodigo = 'G';
        fuel.TipoCombustible = 'Gasolina';
        fuels.push(fuel);
        fuel = new Object();
        fuel.TipoCombustibleCodigo = 'D';
        fuel.TipoCombustible = 'Diesel';
        fuels.push(fuel);
        return fuels;
    }

    //Encuntra un registro por el id
    //Parametro: _id Llave primaria de la tabla
    async findById(_id) {
        let vehicle = await Vehicle.findByPk(_id);
        return vehicle;
    }

    //Encuentra el registro y devuelve true si existe
    //Parametro: _id Llave primaria de la tabla
    async existById(_id) {
        let vehicle = await Vehicle.findByPk(_id);
        let exist = (vehicle) ? true : false;
        return exist;
    }

    //Encuntra un registro por el placa
    //Parametro: _plate Campo único en la tabla
    async findByPlate(_plate) {
        let vehicle = await Vehicle.findOne({
            where: {
                NumeroPlacaVehiculo: _plate
            }
        })
        return vehicle;
    }

    //Encuentra el registro y devuelve true si existe
    //Parametro: _plate Campo único en la tabla
    async existByPlate(_plate) {
        let vehicle = await Vehicle.count({
            where: {
                NumeroPlacaVehiculo: _plate
            }
        });
        console.log(vehicle);
        let is_registered = (vehicle >= 1) ? true : false;
        console.log(is_registered);
        return is_registered;
    }

    //Encuentra el registro y devuelve true si existe
    //Parametro: _engine Campo único en la tabla
    async existByEngine(_engine) {
        let vehicle = await Vehicle.count({
            where: {
                NumeroMotorVehiculo: _engine
            }
        });
        console.log(vehicle);
        let is_registered = (vehicle >= 1) ? true : false;
        console.log(is_registered);
        return is_registered;
    }

    //Encuentra el registro y devuelve true si existe
    //Parametro: _chasis Campo único en la tabla
    async existByChassis(_chasis) {
        let vehicle = await Vehicle.count({
            where: {
                NumeroChasisVehiculo: _chasis
            }
        });
        console.log(vehicle);
        let is_registered = (vehicle >= 1) ? true : false;
        console.log(is_registered);
        return is_registered;
    }

    //Encuentra el registro y devuelve true si existe
    //Parametro: _code Campo único y llave primaria en la tabla
    async existByCode(_code) {
        let vehicle = await Vehicle.count({
            where: {
                CodigoActivoFijo: _code
            }
        });
        console.log(vehicle);
        let is_registered = (vehicle >= 1) ? true : false;
        console.log(is_registered);
        return is_registered;
    }

    //Valida la existencia de un vehiculo por su placa y envia una respuesta
    //Parametro: _plate (matircula)
    async existsResponse(_plate, req, res) {
        try {
            if (!await this.existByPlate(_plate)) {
                res.send({
                    type: 0,
                    message: "El número de matrícula: " + _plate + " es valido"
                });
            } else {
                console.log('Error. Ya existe la placa: ' + _plate);
                res.send({
                    type: 1,
                    message: "El número de matrícula: " + _plate + " ya está asociada a un vehículo."
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Obtiene todos los reguistros almacenados en la tabla
    async getList(req, res) {
        try {
            var vehicles = [];
            var vehiculos = await Vehicle.findAll({
                attributes: ['CodigoActivoFijo', 'NumeroPlacaVehiculo',
                    'MarcaVehiculo', 'ModeloVehiculo',
                    'CodigoTipoVehiculo', 'CapacidadPersonaVehiculo',
                    'KilometrajeActual', 'CodigoEstado'
                ],
                include: [{
                    model: TipoVehiculo,
                    raw: true,
                    required: false
                }, {
                    model: CodigoEstado,
                    raw: true,
                    required: false
                }],
                order: Sequelize.literal('CodigoActivoFijo ASC')
            });
            //console.log(vehiculos);
            vehiculos.forEach((record) => {
                var v = new Object();
                v.codigo = record.CodigoActivoFijo;
                v.matricula = record.NumeroPlacaVehiculo;
                v.descripcion = record.TRA_TipoVehiculo.TipoVehiculo + ": " + record.MarcaVehiculo + " - " + record.ModeloVehiculo;
                v.capacidad = record.CapacidadPersonaVehiculo;
                v.estado = record.TRA_EstadoVehiculo.EstadoVehiculo;
                v.kilometraje = record.KilometrajeActual;
                vehicles.push(v);
            })
            return res.render('../views/vehicle/list.html', {
                vehicles
            });
        } catch (Error) {
            console.log(Error)
        }
    }

    //Renderiza el formulario de ingreso de vehiculo
    //Para editar o ingresar un nuevo vehiculo
    async getCreate(req, res) {
        try {
            const states = await EstadoVehiculoController.getList();
            const offices = await OficinasResponsableController.getList();
            const types = await TipoVehiculoController.getList();
            const reasons = await DescripcionUsoController.getList();
            const fuels = this.getFuels();
            console.log("Estados: " + states);
            console.log("Oficinas: " + offices);
            console.log("Tipos: " + types);
            console.log("Tipos: " + reasons);
            var plate = req.query.matricula;
            var vehicle;
            console.log("La placa que recibo: " + plate);
            if (plate) {
                vehicle = await this.findByPlate(plate);
                console.log("El vehiculo que encontre: " + vehicle);
            }
            return res.render('../views/vehicle/create.html', {
                states,
                types,
                offices,
                reasons,
                vehicle,
                fuels
            })
        } catch (error) {
            console.log("Error en getCreate" + error)
        }
    }

    //Metodo que inserta el nuevo vehiculo. Post gestionar
    //Recibe los parametros request y response, respectivamente
    async create(req, res) {
        console.log('DATOS DE BODY', req.body)
        try {
            var errs = validationResult(req);
            var errors = [];
            errors = errs.array();
            let {
                brand,
                chassis,
                model,
                engine,
                plate,
                state,
                seats,
                code,
                vin,
                type,
                year,
                color,
                office,
                mileage,
                observations,
                fuel,
                motive_dropdown,
                km_input,
                vehicle_id,
                details
            } = req.body;
            var exist_by_plate = await this.existByPlate(plate);
            var exist_by_engine = await this.existByEngine(engine);
            var exist_by_chassis = await this.existByChassis(chassis);
            var exist_by_code = await this.existByCode(code);
            console.log("Existencia por placa: " + exist_by_plate);
            console.log(brand,
                chassis,
                model,
                engine,
                plate,
                state,
                seats,
                code,
                vin,
                type,
                year,
                color,
                fuel,
                office,
                mileage,
                observations, km_input, motive_dropdown, vehicle_id, details);
            if (errs.isEmpty() && !exist_by_plate && !exist_by_engine && !exist_by_chassis && !exist_by_code) {
                const user_session = Authorize.decode_token(req.cookies.token);
                console.dir("Usuario en sesion: " + user_session);
                var recernt_vehicle = await Vehicle.create({
                    MarcaVehiculo: brand,
                    NumeroChasisVehiculo: chassis,
                    ModeloVehiculo: model,
                    NumeroMotorVehiculo: engine,
                    NumeroPlacaVehiculo: plate,
                    CodigoEstado: state,
                    CapacidadPersonaVehiculo: seats,
                    CodigoActivoFijo: code,
                    NumeroVINVehiculo: vin,
                    CodigoTipoVehiculo: type,
                    TipoCombustibleVehiculo: fuel,
                    AnnoVehiculo: year,
                    ColorVehiculo: color,
                    CodigoOficinaResponsableVehiculo: office,
                    KilometrajeActual: mileage,
                    ObservacionesVehiculo: observations
                });
                var new_vehicle = JSON.parse(JSON.stringify(recernt_vehicle));
                console.dir("Antes de crear el historico: " + new_vehicle);
                HistorialDeUsoController.Create(new_vehicle, user_session.user, new_vehicle.KilometrajeActual); //1 corresponde a valores iniciales
                const query = querystring.stringify({
                    title: "Guardado exitoso",
                    message: "Vehiculo registrado",
                    class: "success"
                });
                res.send({
                    redirect: "/vehiculos?&" + query,
                    status: 200
                });
            } else {
                if (exist_by_plate) {
                    errors.push({
                        msg: "La matrícula ya existe en la base de datos"
                    });
                }
                if (exist_by_chassis) {
                    errors.push({
                        msg: "El número de chassis ya existe en la base de datos"
                    });
                }
                if (exist_by_engine) {
                    errors.push({
                        msg: "El número de motor ya existe en la base de datos"
                    });
                }
                if (exist_by_code) {
                    errors.push({
                        msg: "El codigo de activo fijo ya ha existe en la base"
                    });
                }
                res.send({
                    title: "Error en la información",
                    errors: errors
                })
            }
        } catch (error) {
            console.log(error);
            res.send({
                title: "Error al guardar",
                message: "El vehículo no pudo ser guardado. " + error,
            });
        }
    }

    //Metodo que actualiza el nuevo vehiculo. Post gestionar
    //Recibe los parametros request y response, respectivamente
    async update(req, res) {
        try {
            var errs = validationResult(req);
            var errors = [];
            errors = errs.array();
            let {
                brand,
                chassis,
                model,
                engine,
                plate,
                state,
                seats,
                code,
                vin,
                type,
                year,
                color,
                office,
                mileage,
                observations,
                fuel,
                motive_dropdown,
                km_input,
                vehicle_id,
                details
            } = req.body;
            console.log(brand,
                chassis,
                model,
                engine,
                plate,
                state,
                seats,
                code,
                vin,
                type,
                year,
                color,
                fuel,
                office,
                mileage,
                observations, km_input, motive_dropdown, vehicle_id, details);
            if (errs.isEmpty()) {
                const user_session = Authorize.decode_token(req.cookies.token);
                console.dir("Usuario en sesion: " + user_session);
                await Vehicle.update({
                    MarcaVehiculo: brand,
                    NumeroChasisVehiculo: chassis,
                    ModeloVehiculo: model,
                    NumeroMotorVehiculo: engine,
                    NumeroPlacaVehiculo: plate,
                    CodigoEstado: state,
                    CapacidadPersonaVehiculo: seats,
                    CodigoActivoFijo: code,
                    NumeroVINVehiculo: vin,
                    CodigoTipoVehiculo: type,
                    TipoCombustibleVehiculo: fuel,
                    AnnoVehiculo: year,
                    ColorVehiculo: color,
                    CodigoOficinaResponsableVehiculo: office,
                    ObservacionesVehiculo: observations
                }, {
                    where: {
                        CodigoActivoFijo: vehicle_id
                    }
                });
                if (km_input && motive_dropdown) {
                    var recernt_vehicle = await this.findById(code);
                    console.dir("Antes de crear el historico: " + recernt_vehicle);
                    HistorialDeUsoController.Create(recernt_vehicle, user_session.user, km_input, details, motive_dropdown);
                }
                const query = querystring.stringify({
                    title: "Guardado exitoso",
                    message: "Vehiculo actualizado",
                    class: "success"
                });
                res.send({
                    redirect: "/vehiculos?&" + query,
                    status: 200
                });
            } else {
                res.send({
                    title: "Error en la información",
                    errors: errors
                })
            }
        } catch (error) {
            console.log(error);
            res.send({
                type: 1,
                title: "Error al actualizar",
                message: "El vehículo no pudo ser guardado. " + error,
            });
        }
    };

    async reporteLoteVehicular(req, res) {
        try {
            const fonts = {
                Roboto: {
                    normal: 'public/fonts/Roboto-Regular.ttf',
                    bold: 'public/fonts/Roboto-Medium.ttf',
                    italics: 'public/fonts/Roboto-Italic.ttf',
                    bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                }
            };
            const printer = new pdfPrinter(fonts);
            var today = new Date();
            var month = today.getMonth() + 1;
            //Nombre del archivo PDF a descargar.
            var fileName = 'Reporte_lote_de_vehículos_' + today.getDate() + '/' + month + '/' + today.getFullYear() + '.pdf';
            console.log(fileName);
            const token = Authorize.decode_token(req.cookies.token);
            var columns = [{
                text: 'Código activo fijo',
                bold: true
            },{
                text: 'Marca',
                bold: true
            }, {
                text: 'Modelo',
                bold: true
            }, {
                text: 'Color',
                bold: true
            }, {
                text: 'Año',
                bold: true
            }, {
                text: 'Número de motor',
                bold: true
            }, {
                text: 'Número de chasis',
                bold: true
            }, {
                text: 'Kilometraje',
                bold: true
            }, {
                text: 'Número de placa',
                bold: true
            }, {
                text: 'Tipo de vehículo',
                bold: true
            }, {
                text: 'Procuraduría/Unidad asignada',
                bold: true
            }];
            var bodyData = [];
            bodyData.push(columns);
            var vehiculos = await Vehicle.findAll({
                attributes: ['CodigoActivoFijo', 'NumeroPlacaVehiculo', 'NumeroChasisVehiculo',
                    'MarcaVehiculo', 'ModeloVehiculo', 'ColorVehiculo', 'AnnoVehiculo',
                    'NumeroMotorVehiculo', 'KilometrajeActual'
                ],
                include: [{
                    model: TipoVehiculo,
                    raw: true,
                    required: false
                }, {
                    model: OficinaResponsableVehiculo,
                    raw: true,
                    required: false
                }],
                order: Sequelize.literal('CodigoActivoFijo ASC')
            });
            //console.log(vehiculos);
            vehiculos.forEach(v => {
                var bodyRow = [];
                bodyRow.push(v.CodigoActivoFijo.trim());
                bodyRow.push(v.MarcaVehiculo.trim());
                bodyRow.push(v.ModeloVehiculo.trim());
                bodyRow.push(v.ColorVehiculo.trim());
                bodyRow.push(v.AnnoVehiculo.trim());
                bodyRow.push(v.NumeroMotorVehiculo.trim());
                bodyRow.push(v.NumeroChasisVehiculo.trim());
                bodyRow.push(v.KilometrajeActual.trim());
                bodyRow.push(v.NumeroPlacaVehiculo.trim());
                bodyRow.push(v.TRA_TipoVehiculo.TipoVehiculo.trim());
                bodyRow.push(v.TRA_OficinasResponsablesDeVehiculo.DescripcionOficinaResponsableVehiculo.trim());
                bodyData.push(bodyRow);
            });

            // CUERPO DEL DOCUMENTO. NO TOCAR. >:V
            var docDefinition = {
                info: {
                    //Nombre interno del documento.
                    title: 'Reporte lote de vehículos ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                },
                pageSize: 'A4',
                pageOrientation: 'landscape',
                pageMargins: [35, 85, 30, 45],
                footer: function (currentPage, pageCount) {
                    return [{
                            text: 'Fecha de impresión: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                            alignment: 'right',
                            fontSize: '9',
                            italics: true,
                            margin: [20, 0]
                        },
                        {
                            text: 'Generado por: ' + token.user.NombresUsuario + ' ' + token.user.ApellidosUsuario,
                            alignment: 'right',
                            fontSize: '9',
                            italics: true,
                            margin: [20, 0]
                        },
                        {
                            text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                            alignment: 'right',
                            fontSize: '9',
                            italics: true,
                            margin: [20, 0]
                        }
                    ];
                },
                header: function () {
                   return [{
                        image: 'public/images/logopgr1.png',
                        fit: [60, 60],
                        absolutePosition: {
                            x: 55,
                            y: 10
                        },
                    },
                    {
                        text: 'Procuraduría General de la República - Unidad de Transporte\n\n\n\n\n',
                        alignment: 'center',
                        fontSize: '12',
                        absolutePosition: {
                            x: 0,
                            y: 35
                        },
                    }]
                },
                content: [
                    {
                        table: {
                            headerRows: 1,
                            dontBreakRows: true,
                            widths: [80, 50, 55, 58, 'auto', 80, 80, 'auto', 'auto', 'auto', 'auto'],
                            body: bodyData,
                        },
                    }
                ],
            };

            const doc = printer.createPdfKitDocument(docDefinition);

            let chunks = [];
            let result;
            doc.on('data', (chunk) => {
                chunks.push(chunk);
            });

            doc.on('end', () => {
                result = Buffer.concat(chunks);
                /*Para visualizar el PDF sin descargarlo directamente, descomentar la siguiente línea de código.
                Mozilla Firefox: Al descargar el PDF con el botón Descargar del visor, 
                se descarga como 'document.pdf'. Si se descarga dando clic derecho en el documento y
                luego clic en "Guardar como", se descarga con el nombre de la ruta relativa (reporteLoteVehicular.pdf).
                Google Chrome: El PDF se descarga con el nombre de la ruta relativa de ambas formas.*/

                /* res.setHeader('content-type', 'application/pdf'); */

                /*Para descargar el PDF directamente sin visualización en navegador.
                Esta forma permite asignar nombre al documento a descargar de manera dinámica.*/
                res.setHeader('content-type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                res.send(result);
            });

            doc.end();
        } catch (err) {
            console.log(err)
        };
    };

    async reporteIndividual(req, res) {
        try {
            const fonts = {
                Roboto: {
                    normal: 'public/fonts/Roboto-Regular.ttf',
                    bold: 'public/fonts/Roboto-Medium.ttf',
                    italics: 'public/fonts/Roboto-Italic.ttf',
                    bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                }
            };
            const printer = new pdfPrinter(fonts);
            var today = new Date();
            var month = today.getMonth() + 1;
            const token = Authorize.decode_token(req.cookies.token);
            let CodigoActivoFijo = req.query.codigo;

            var vehiculo = await Vehicle.findOne({
                where: {
                    CodigoActivoFijo: CodigoActivoFijo,
                },
                include: [{
                    model: TipoVehiculo,
                    raw: true,
                    required: false
                }, {
                    model: OficinaResponsableVehiculo,
                    raw: true,
                    required: false
                }, {
                    model: CodigoEstado,
                    raw: true,
                    required: false
                }],
                order: Sequelize.literal('CodigoActivoFijo ASC')
            });

            //Nombre del archivo PDF a descargar.
            var fileName = 'Reporte_vehiculo_' + vehiculo.NumeroPlacaVehiculo.trim() + '_' +
                today.getDate() + '/' + month + '/' + today.getFullYear() + '.pdf';
            let TipoCombustible = vehiculo.TipoCombustibleVehiculo;
            switch (TipoCombustible) {
                case 'D':
                    TipoCombustible = 'Diesel';
                    break;
                case 'G':
                    TipoCombustible = 'Gasolina';
                    break;
            };

            // CUERPO DEL DOCUMENTO. NO TOCAR. >:V
            var docDefinition = {
                info: {
                    //Nombre interno del documento.
                    title: 'Reporte lote de vehículos ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                },
                pageSize: 'LETTER',
                footer: [{
                        text: 'Fecha de generación: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                        alignment: 'right',
                        fontSize: '9',
                        italics: true,
                        margin: [15, 0]
                    },
                    {
                        text: 'Generado por: ' + token.user.NombresUsuario + ' ' + token.user.ApellidosUsuario,
                        alignment: 'right',
                        fontSize: '9',
                        italics: true,
                        margin: [15, 0]
                    },
                ],
                content: [{
                        image: 'public/images/logopgr1.png',
                        fit: [60, 60],
                        absolutePosition: {
                            x: 50,
                            y: 20
                        },
                        writable: true,
                    },
                    {
                        text: 'Procuraduría General de la República - Unidad de Transporte\n\n\n',
                        alignment: 'center',
                        fontSize: '12'
                    },
                    {
                        text: 'Inventario de vehículo ' + vehiculo.CodigoActivoFijo + '\n\n\n',
                        alignment: 'center',
                        fontSize: '12'
                    },
                    {
                        table: {
                            headerRows: 0,
                            widths: ['*', '*'],
                            body: [
                                [{
                                    text: 'Marca',
                                    bold: true
                                }, vehiculo.MarcaVehiculo],
                                [{
                                    text: 'Modelo',
                                    bold: true
                                }, vehiculo.ModeloVehiculo],
                                [{
                                    text: 'Color',
                                    bold: true
                                }, vehiculo.ColorVehiculo],
                                [{
                                    text: 'Año',
                                    bold: true
                                }, vehiculo.AnnoVehiculo],
                                [{
                                    text: 'Número de motor',
                                    bold: true
                                }, vehiculo.NumeroMotorVehiculo],
                                [{
                                    text: 'Número de chasis',
                                    bold: true
                                }, vehiculo.NumeroChasisVehiculo],
                                [{
                                    text: 'Kilometraje',
                                    bold: true
                                }, vehiculo.KilometrajeActual],
                                [{
                                    text: 'Número de placa',
                                    bold: true
                                }, vehiculo.NumeroPlacaVehiculo],
                                [{
                                    text: 'Cantidad de pasajeros',
                                    bold: true
                                }, vehiculo.CapacidadPersonaVehiculo],
                                [{
                                    text: 'Estado del vehículo',
                                    bold: true
                                }, vehiculo.TRA_EstadoVehiculo.EstadoVehiculo],
                                [{
                                    text: 'Tipo de vehículo',
                                    bold: true
                                }, vehiculo.TRA_TipoVehiculo.TipoVehiculo],
                                [{
                                    text: 'Tipo de combustible',
                                    bold: true
                                }, TipoCombustible],
                                [{
                                    text: 'Observaciones',
                                    bold: true
                                }, vehiculo.ObservacionesVehiculo],
                                [{
                                    text: 'Procuraduría/Unidad asignada',
                                    bold: true
                                }, vehiculo.TRA_OficinasResponsablesDeVehiculo.DescripcionOficinaResponsableVehiculo],
                                [{
                                    text: 'Id de solicitudes Folo-06 atendidas',
                                    bold: true
                                }, 'N/A']
                            ]
                        },
                    }
                ],
            };

            const doc = printer.createPdfKitDocument(docDefinition);

            let chunks = [];
            let result;
            doc.on('data', (chunk) => {
                chunks.push(chunk);
            });

            doc.on('end', () => {
                result = Buffer.concat(chunks);
                /*Para visualizar el PDF sin descargarlo directamente, descomentar la siguiente línea de código.
                Mozilla Firefox: Al descargar el PDF con el botón Descargar del visor, 
                se descarga como 'document.pdf'. Si se descarga dando clic derecho en el documento y
                luego clic en "Guardar como", se descarga con el nombre de la ruta relativa (reporteLoteVehicular.pdf).
                Google Chrome: El PDF se descarga con el nombre de la ruta relativa de ambas formas.*/

                /* res.setHeader('content-type', 'application/pdf'); */

                /*Para descargar el PDF directamente sin visualización en navegador.
                Esta forma permite asignar nombre al documento a descargar de manera dinámica.*/
                res.setHeader('content-type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                res.send(result);
            });

            doc.end();
        } catch (err) {
            console.log(err)
        };
    }
};

module.exports = new Vehicle_controller();
const Sequelize = require('sequelize');
const Folo6 = require('../models/m_folo6');
const LugaresContenedor = require('../models/m_lugares_contenedor');
const FPlace = require('../models/m_lugares_frecuentes');
const Address = require('../models/m_direccion');
//const Apanel = require('../models/m_folo6_approve_state');
//const Driver = require('../models/m_Driver');
//const Driver_assign = require('../models/m_driver_assign');
const Op = Sequelize.Op;
const querystring = require('querystring');
const auth_controller = require('../controllers/c_auth');
const UbicacionesGeograficas = require('../models/m_ubicaciones_geograficas');
const Mision = require('../models/m_mision');
const mision_controller = require('../controllers/c_misiones');
//Manejo de fechas
var moment = require('moment');
moment.locale("Es-SV")

//Para manejar el área de direcciones y lugares frecuentes
const direcciones_controller = require('../controllers/c_direccion');
const pdfPrinter = require('pdfmake/src/printer'); //Copiar esto
const employee_controller = require('../controllers/c_employee');
/* const Migration = require('../models/migrations');
 */
const {
    body,
    check,
    validationResult
} = require('express-validator');

class folo6_controllers {
    constructor() {
        //var migrate = new Migration();
    }
    //Gets Departments List
    async getDepartmentList(req, res) {
        try {
            let Departamentos = await UbicacionesGeograficas.findAll({
                attributes: ['CodigoUbicacionGeografica', 'NombreUbicacionGeografica'],
                where: {
                    CodigoUbicacionGeograficaSuperior: 'ES'
                }
            });

            let misiones = await Mision.findAll({
                attributes: ['IDMision', 'NombreMision'],
                where: {
                    MisionActiva: '1'
                }
            })
            return res.render('./folo6/folo6.html', {
                Departamentos,
                misiones
            });
        } catch (error) {
            console.log(error);
        }
    };

    //Mostrar PDF de los folos ya guardados
    async showAndcreatePDF(req, res) {
        /* Se especifican 4 casos para creación del PDF:
        1. Sí quiere motorista y hay más de una dirección.
        2. No quiere motorista y hay más de una dirección.
        3. Sí quiere motorista y hay una sola dirección (caso ideal).
        4. No quiere motorista y hay una sola dirección. */
        try {
            let folo = await this.foloInfo(req);
            console.dir("EN SHOW RECIBI ESTO" + JSON.stringify(folo));
            var fechaSolicitud = folo.FechaCreacion;
            var unidadSolicitante = folo.emp.unit;
            var personaSolicitante = folo.emp.NombresUsuario + ', ' + folo.emp.ApellidosUsuario;
            var fechaSalida = folo.FechaSalida;
            var f1 = moment(folo.FechaSalida, "DD/MM/YYYY"); //Para determinar con moment JS qué día de la semana es
            var horaSalida = folo.HoraSalida;
            var horaRetorno = folo.HoraRetorno;
            var motorista = folo.ConMotorista ? "Sí" : "No";
            var cantidadPasajeros = folo.CantidadDePasajeros;
            var personaConducir = folo.PersonaQueConducira;
            var tipoLicencia = folo.TipoDeLicencia;
            //B es un contador definido por la cantidad de direcciones que posee una solicitud
            var b = folo.b
            var direccion;
            var bodyData = [];
            var columns = [{
                text: 'Nombre del destino',
                bold: true
            }, {
                text: 'Detalle de dirección',
                bold: true
            }, {
                text: 'Departamento',
                bold: true
            }, {
                text: 'Municipio',
                bold: true
            }];
            bodyData.push(columns);
            console.log("cantidad de direcciones: " + b + " Y MOTORISTA: " + motorista);
            if (b === 1) {
                //Si existe lugar frecuente; si no, lo ingresado es una dirección
                if (folo.fplaces.length) {
                    if (folo.fplaces[0].DetalleLugarFrecuente.trim().length == 0) {
                        direccion = folo.fplaces[0].NombreLugarFrecuente.trim() + ", " + folo.fplaces[0].Municipio.trim() + ", " + folo.fplaces[0].Departamento.trim();
                    } else {
                        direccion = folo.fplaces[0].NombreLugarFrecuente.trim() + ", " + folo.fplaces[0].DetalleLugarFrecuente.trim() + ", " + folo.fplaces[0].Municipio.trim() + ", " + folo.fplaces[0].Departamento.trim();
                    }
                    
                } else {
                    //Para verificar que address no está vacío
                    if (folo.address.length)
                        direccion = folo.address[0].Nombre.trim() + ", " + folo.address[0].Detalle.trim() + ", " + folo.address[0].Municipio.trim() + ", " + folo.address[0].Departamento.trim();
                }
            } else {
                //Si existe más de una ruta o de un lugar frecuente
                direccion = "Ver listado de direcciones en página anexo"
                if (folo.fplaces.length) {
                    folo.fplaces.forEach(ele => {
                        var direcciones = [];
                        direcciones.push(ele.NombreLugarFrecuente.trim());
                        if (ele.DetalleLugarFrecuente.trim().length == 0) {
                            ele.DetalleLugarFrecuente = 'No especificado';
                            direcciones.push(ele.DetalleLugarFrecuente);
                        } else {
                            direcciones.push(ele.DetalleLugarFrecuente.trim());
                        };
                        direcciones.push(ele.Municipio.trim());
                        direcciones.push(ele.Departamento.trim());
                        bodyData.push(direcciones);
                    });
                };
                if (folo.address.length) {
                    folo.address.forEach(ele => {
                        var direcciones = [];
                        direcciones.push(ele.Nombre.trim());
                        direcciones.push(ele.Detalle.trim());
                        direcciones.push(ele.Municipio.trim());
                        direcciones.push(ele.Departamento.trim());
                        bodyData.push(direcciones);
                    });
                };
            };
            console.log(typeof (b) + " cantidad " + b)
            var mision = folo.Mision.NombreMision;
            var observaciones = folo.Observacion;
            var horasNoHabiles = ['12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
                '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM',
                '7:00 AM', '7:30 AM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
                '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM',
                '11:00 PM', '11:30 PM'
            ]; //Para verificar si las horas de salida o retorno son NO hábiles.
            var crearFOLO13; //Variable a enviar a la vista en el response.
            var diaSemana = f1.weekday(); //Método para obtener qué día de la semana es de la fecha provista.
            console.log(diaSemana);
            //0 = Lunes, 6 = Domingo. Si la fecha es sábado o domingo, se genera FOLO-13.
            if (diaSemana == 5 || diaSemana == 6) {
                crearFOLO13 = "Sí";
            } else {
                /*Horas de salida y retorno serán tratadas como hábiles hasta que sea encontrada en el arreglo 
                de 'horasNoHabiles'. De encontrarse se rompe el ciclo.*/
                for (var ele of horasNoHabiles) {
                    //Condicionales separadas por cada hora para más claridad.
                    if (ele == horaSalida) {
                        crearFOLO13 = "Sí";
                        break;
                    } else {
                        crearFOLO13 = "No";
                    };

                    if (ele == horaRetorno) {
                        crearFOLO13 = "Sí";
                        break;
                    } else {
                        crearFOLO13 = "No";
                    };
                };
                console.log('¿Se creará FOLO-13? ' + crearFOLO13);
            };
            console.log(horaSalida);
            console.log(horaRetorno);
            const token = auth_controller.decode_token(req.cookies.token);
            var today = new Date();
            var fileName = 'Solicitud_de_transporte_FOLO-06_' + today.getDate() + '/' + month + '/' + today.getFullYear() + '.pdf';
            //Sí quiere motorista y hay más de una dirección.
            if (motorista == "Sí" && b > 1) {
                console.log("CON MOTORISTA Y MÁS UNA DIRECCION");
                //Definición de fuentes a usar en el documento.
                const fonts = {
                    Roboto: {
                        normal: 'public/fonts/Roboto-Regular.ttf',
                        bold: 'public/fonts/Roboto-Medium.ttf',
                        italics: 'public/fonts/Roboto-Italic.ttf',
                        bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                    }
                };
                //'printer' se encarga de escribir en el lienzo.
                const printer = new pdfPrinter(fonts);
                var month = today.getMonth() + 1;
                // CUERPO DEL DOCUMENTO. NO TOCAR. >:V
                var docDefinition = {
                    info: {
                        //Nombre interno del documento.
                        title: 'Solicitud de transporte FOLO-06 ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    footer: function (currentPage, pageCount) {
                        return [{
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
                            {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                                alignment: 'right',
                                fontSize: '9',
                                italics: true,
                                margin: [15, 0]
                            }
                        ];
                    },
                    content: [{
                            image: 'public/images/logopgr1.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'PROCURADURÍA GENERAL DE LA REPÚBLICA',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nFOLO-06',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nUnidad solicitante: ',
                                bold: true
                            }, '' + unidadSolicitante],
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nMotorista: ',
                                    bold: true
                                }, '' + motorista,
                                {
                                    text: '                                   Cantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos de asignaciones:\n\n'
                        },
                        {
                            text: 'Nombre de motorista asignado:',
                            preserveLeadingSpaces: true,
                            bold: true
                        },
                        {
                            text: '\nMarca: _________________            Matrícula: _________________             Km. inicial: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                            pageBreak: "after"
                        },
                        {
                            text: 'ANEXO: Tabla de direcciones.\n\n',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            table: {
                                headerRows: 1,
                                widths: [160, '*', '*', '*'],
                                body: bodyData,
                            },
                        },
                    ],
                };
                //Se escribe en el documento el cuerpo previamente definido.
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                }); //Mete todo el texto del PDF en un Array.
                //doc.pipe(fs.createWriteStream('document1.pdf')); //Crea el PDF en local (server).
                /*Al finalizar el documento, se mete en un buffer la concatenación del Array
                y se guarda en 'result'. Este buffer es enviado a la vista en el response.*/
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
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64'),
                        imprimir: crearFOLO13
                    });
                });
                doc.end();
            };
            //La misma documentación de arriba se aplica para todos los casos posteriores.
            //NO quiere motorista y hay más de una dirección.
            if (motorista == "No" && b > 1) {
                console.log("SIN MOTORISTA Y MÁS DE UNA DIRECCION");

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
                var docDefinition = {
                    info: {
                        title: 'Solicitud de transporte FOLO-06 ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    footer: function (currentPage, pageCount) {
                        return [{
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
                            {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                                alignment: 'right',
                                fontSize: '9',
                                italics: true,
                                margin: [15, 0]
                            }
                        ];
                    },
                    content: [{
                            image: 'public/images/logopgr1.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'PROCURADURÍA GENERAL DE LA REPÚBLICA',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nFOLO-06',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nUnidad solicitante: ',
                                bold: true
                            }, '' + unidadSolicitante],
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nMotorista: ',
                                    bold: true
                                }, '' + motorista,
                                {
                                    text: '                                   Cantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                    text: '\nPersona a conducir: ',
                                    bold: true
                                }, '' + personaConducir,
                                {
                                    text: '                Tipo de licencia: ',
                                    bold: true
                                },
                                '' + tipoLicencia
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos de asignaciones:\n\n'
                        },
                        {
                            text: 'Marca: _________________            Matrícula: _________________             Km. inicial: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                            pageBreak: "after"
                        },
                        {
                            text: 'ANEXO: Tabla de direcciones.\n\n',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            table: {
                                headerRows: 1,
                                widths: [160, '*', '*', '*'],
                                body: bodyData,
                            },
                        },
                    ],
                };
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                //doc.pipe(fs.createWriteStream('document1.pdf'));
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
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64'),
                        imprimir: crearFOLO13
                    });
                });
                doc.end();
            };

            //Sí quiere motorista y solo es una dirección.
            if (motorista == "Sí" && b == 1) {
                console.log("CON MOTORISTA Y UNA DIRECCION");

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
                var docDefinition = {
                    info: {
                        title: 'Solicitud de transporte FOLO-06 ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    footer: function (currentPage, pageCount) {
                        return [{
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
                            {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                                alignment: 'right',
                                fontSize: '9',
                                italics: true,
                                margin: [15, 0]
                            }
                        ];
                    },
                    content: [{
                            image: 'public/images/logopgr1.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'PROCURADURÍA GENERAL DE LA REPÚBLICA',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nFOLO-06',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nUnidad solicitante: ',
                                bold: true
                            }, '' + unidadSolicitante],
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nMotorista: ',
                                    bold: true
                                }, '' + motorista,
                                {
                                    text: '                                   Cantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos de asignaciones:\n\n'
                        },
                        {
                            text: 'Nombre de motorista asignado:',
                            preserveLeadingSpaces: true,
                            bold: true
                        },
                        {
                            text: '\nMarca: _________________            Matrícula: _________________             Km. inicial: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                        },
                    ],
                };
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                //doc.pipe(fs.createWriteStream('document1.pdf'));
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
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64'),
                        imprimir: crearFOLO13
                    });
                });
                doc.end();
            };

            //No quiere motorista y solo es una dirección.
            if (motorista == "No" && b == 1) {
                console.log("SIN MOTORISTA Y UNA DIRECCION");

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
                var docDefinition = {
                    info: {
                        title: 'Solicitud de transporte FOLO-06 ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    footer: function (currentPage, pageCount) {
                        return [{
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
                            {
                                text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                                alignment: 'right',
                                fontSize: '9',
                                italics: true,
                                margin: [15, 0]
                            }
                        ];
                    },
                    content: [{
                            image: 'public/images/logopgr1.png',
                            fit: [60, 60],
                            absolutePosition: {
                                x: 70,
                                y: 20
                            },
                            writable: true,
                        },
                        {
                            text: 'PROCURADURÍA GENERAL DE LA REPÚBLICA',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: 'SOLICITUD DE SERVICIO DE TRANSPORTE',
                            alignment: 'center',
                            bold: true,
                            italics: true,
                            fontSize: '16'
                        },
                        {
                            text: '\n\nFOLO-06',
                            alignment: 'right',
                            bold: true,
                            italics: true
                        },
                        {
                            text: [{
                                text: 'Fecha de solicitud: ',
                                bold: true
                            }, '' + fechaSolicitud]
                        },
                        {
                            text: [{
                                text: '\nUnidad solicitante: ',
                                bold: true
                            }, '' + unidadSolicitante],
                        },
                        {
                            text: [{
                                text: '\nPersona que solicita: ',
                                bold: true
                            }, '' + personaSolicitante],
                        },
                        {
                            text: [{
                                    text: '\nFecha de salida: ',
                                    bold: true
                                }, '' + fechaSalida,
                                {
                                    text: '          Hora de salida: ',
                                    bold: true
                                }, '' + horaSalida,
                                {
                                    text: '          Hora de regreso: ',
                                    bold: true
                                }, '' + horaRetorno
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nLugar: ',
                                bold: true
                            }, '' + direccion],
                        },
                        {
                            text: [{
                                text: '\nMisión: ',
                                bold: true
                            }, '' + mision],
                        },
                        {
                            text: [{
                                    text: '\nMotorista: ',
                                    bold: true
                                }, '' + motorista,
                                {
                                    text: '                                   Cantidad de pasajeros: ',
                                    bold: true
                                },
                                '' + cantidadPasajeros
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                    text: '\nPersona a conducir: ',
                                    bold: true
                                }, '' + personaConducir,
                                {
                                    text: '                Tipo de licencia: ',
                                    bold: true
                                },
                                '' + tipoLicencia
                            ],
                            preserveLeadingSpaces: true
                        },
                        {
                            text: [{
                                text: '\nObservación: ',
                                bold: true
                            }, '' + observaciones],
                        },
                        {
                            text: '\n\n_________________________________________________',
                            alignment: 'center'
                        },
                        {
                            text: 'Nombre, firma y sello de la coordinación solicitante\n\n\n',
                            alignment: 'center'
                        },
                        {
                            text: '\nAutorizado por: __________________________________________',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             (Encargado del área de transporte)',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '                             Nombre, firma y sello',
                            alignment: 'center',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nDatos de asignaciones:\n\n'
                        },
                        {
                            text: '\nMarca: _________________            Matrícula: _________________             Km. inicial: _________________',
                            preserveLeadingSpaces: true
                        },
                        {
                            text: '\n\nCantidad de combustible a entregar en cupones _____________ en $_____________.'
                        },
                        {
                            text: '\n\nNo. de los cupones entregados del _______________ al _______________.'
                        },
                        {
                            text: '\n\n\n_______________________________________________                 _________________________________________'
                        },
                        {
                            text: 'Nombre y firma del responsable de combustible                 Nombre y firma del motorista o conductor',
                            preserveLeadingSpaces: true,
                        },
                    ],
                };
                const doc = printer.createPdfKitDocument(docDefinition);
                let chunks = [];
                let result;
                doc.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                //doc.pipe(fs.createWriteStream('document1.pdf'));
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
                    res.send({
                        link: "data:application/pdf;base64," + result.toString('base64'),
                        imprimir: crearFOLO13
                    });
                });
                doc.end();
            };
        } catch (err) {
            console.log(err);
        };
    };

    //Mostrar PDF de los folos ya guardados
    async showAndcreatePDF_Folo13(req, res) {
        //Misma documentación del método anterior.
        try {
            let folo = await this.foloInfo(req);
            var fechaSolicitud = folo.FechaCreacion;
            var unidadSolicitante = folo.emp.unit;
            var personaSolicitante = folo.emp.NombresUsuario + ', ' + folo.emp.ApellidosUsuario;
            var fechaSalida = folo.FechaSalida;
            var horaSalida = folo.HoraSalida;
            var horaRetorno = folo.HoraRetorno;
            var mision = folo.Mision.NombreMision;
            const token = auth_controller.decode_token(req.cookies.token);
            var today = new Date();
            var fileName = 'Hoja_de_Misión_Oficial_FOLO-13_' + today.getDate() + '/' + month + '/' + today.getFullYear() + '.pdf';

            const fonts = {
                Roboto: {
                    normal: 'public/fonts/Roboto-Regular.ttf',
                    bold: 'public/fonts/Roboto-Medium.ttf',
                    italics: 'public/fonts/Roboto-Italic.ttf',
                    bolditalics: 'public/fonts/Roboto-BoldItalic.ttf',
                }
            };
            const printer = new pdfPrinter(fonts);
            var month = today.getMonth() + 1;
            var docDefinition = {
                info: {
                    //Nombre interno del documento.
                    title: 'Hoja de Misión Oficial FOLO-13 ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
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
                        text: 'FORMULARIO CONTROL DE MISIONES OFICIALES',
                        alignment: 'center',
                        bold: true,
                        italics: true,
                        fontSize: '16'
                    },
                    {
                        text: 'PARA DÍAS Y HORAS NO HÁBILES',
                        alignment: 'center',
                        bold: true,
                        italics: true,
                        fontSize: '16'
                    },
                    {
                        text: 'UNIDAD DE LOGÍSTICA',
                        alignment: 'center',
                        bold: true,
                        italics: true,
                        fontSize: '16'
                    },
                    {
                        text: 'PROCURADURÍA GENERAL DE LA REPÚBLICA',
                        alignment: 'center',
                        bold: true,
                        italics: true,
                        fontSize: '16'
                    },
                    {
                        text: '\n\nFOLO-13',
                        alignment: 'right',
                        bold: true,
                        italics: true
                    },
                    {
                        text: [{
                            text: 'Fecha: ',
                            bold: true
                        }, '' + fechaSolicitud]
                    },
                    {
                        text: [{
                            text: '\nUnidad o procuraduría auxiliar: ',
                            bold: true
                        }, '' + unidadSolicitante],
                    },
                    {
                        text: [{
                            text: '\nSe autoriza a: ',
                            bold: true
                        }, '' + personaSolicitante],
                    },
                    {
                        text: [{
                            text: '\nVehículo placa #: ',
                            bold: true
                        }, ''],
                    },
                    {
                        text: [{
                            text: '\nMisión: ',
                            bold: true
                        }, '' + mision],
                    },
                    {
                        text: [{
                            text: '\nPeríodo de la misión: ',
                            bold: true
                        }, '' + fechaSalida + ' de ' + horaSalida + ' a ' + horaRetorno],
                    },
                    {
                        text: '\nAutorizado por: ',
                        bold: true,
                        preserveLeadingSpaces: true
                    },
                    {
                        text: '\n\n\n\n\n\n___________________________________                 _________________________________________',
                        alignment: 'center'
                    },
                    {
                        text: 'Firma y sello de autorizado                                 Nombre y firma del motorista o conductor',
                        preserveLeadingSpaces: true,
                        alignment: 'center',
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
                //res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
                res.send({
                    link: "data:application/pdf;base64," + result.toString('base64')
                });
            });
            doc.end();
        } catch (err) {
            console.log(err);
        };
    };

    async foloInfo(req) {
        try {
            var el = new Object();

            console.log("FOLO QUE VOY A VERIFICAR" + req.body.IDFolo)
            var folo = await Folo6.findByPk(req.body.IDFolo, {
                attributes: ['IDFolo', 'IDRelacionUbicacion', 'FechaSalida', 'HoraSalida', 'HoraRetorno', 'CantidadDePasajeros', 'ConMotorista', 'PersonaQueConducira', 'TipoDeLicencia', 'IDMision', 'Observacion', 'CreadoPor', 'FechaCreacion']
            }).then(folo => {
                console.log("FOLO QUE VOY RECIBI" + folo.IDFolo)

                el.IDFolo = folo.IDFolo;
                el.IDRelacionUbicacion = folo.IDRelacionUbicacion;
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                /*CORRECCIÓN HECHA POR AXEL HERNÁNDEZ - 21/11/2019:
                Al mostrar el PDF desde el listado de solicitudes, la fecha de salida se mostraba con un día
                menos que la fecha de salida almacenada en la base de datos.
                Esto sucedía por la resta del tiempo UTC de -6 horas. La fecha de salida es guardada en la BD
                con valores de 0 horas, 0 minutos, 0 segundos (como si se hubiera guardado exactamente a medianoche),
                y al restarle las 6 horas se devolvía al día anterior.*/
                el.FechaSalida = moment.utc(folo.FechaSalida).format("DD/MM/YYYY");
                el.HoraSalida = moment.utc(folo.HoraSalida).format("h:mm A");
                el.HoraRetorno = moment.utc(folo.HoraRetorno).format("h:mm A");
                el.CantidadDePasajeros = folo.CantidadDePasajeros;
                el.ConMotorista = folo.ConMotorista ? 1 : 0;
                el.PersonaQueConducira = folo.PersonaQueConducira;
                el.TipoDeLicencia = folo.TipoDeLicencia;
                mision_controller.getOne(folo.IDMision).then(m => {
                    el.Mision = m;
                });
                el.Observacion = folo.Observacion;
                el.FechaCreacion = moment.utc(folo.FechaCreacion).utcOffset("-06:00").format("DD/MM/YYYY");
                el.CreadoPor = folo.CreadoPor;
            });
            console.log(el.IDFolo);
            /**APROBACION FOLO***/
            /* var estados = await Apanel.findAll({
                where: {
                    folo06_id: el.id
                }
            });
            el.estado = new Object();
            estados.forEach((estado, i) => {
                console.log(JSON.stringify(estado.id));
                var e = new Object();
                el.estado = new Object();
                e.u_approve = estado.request_unit_approve;
                e.u_det_approve = estado.unit_cancel_detail;
                e.t_approve = estado.transport_unit_approve;
                e.t_det_approve = estado.cancel_tunit_detail;
                e.driver = estado.driver_assigned;
                e.car = estado.car;
                e.gas = estado.gasoline;
                el.estado = e;
            }); */
            /* if(estado.SGT_Folo6_Aprovado.gasoline){
            } */
            //Contador de lugares frecuentes y direcciones
            el.b = 0
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.fplaces = [];
            //Para traer todos los lugares frecuentes ligados a ese folo
            await LugaresContenedor.findAll({
                where: {
                    IDFolo: req.body.IDFolo
                },
                attributes: ['IDLugarFrecuente'],
                include: [FPlace]
            }).then(Fplaces => {
                //console.dir("Conglomerado de fplac:" + JSON.stringify(Fplaces) + " eS DEL TIPO " + typeof (Fplaces));
                Fplaces.forEach(row => {
                    //console.dir(row);
                    if (row.TRA_LugaresFrecuente) {
                        console.dir("Datos del lugar:" + JSON.stringify(row.TRA_LugaresFrecuente.NombreLugarFrecuente));
                        var f = new Object();
                        f.IDLugarFrecuente = row.TRA_LugaresFrecuente.IDLugarFrecuente;
                        f.NombreLugarFrecuente = row.TRA_LugaresFrecuente.NombreLugarFrecuente;
                        f.DetalleLugarFrecuente = row.TRA_LugaresFrecuente.DetalleLugarFrecuente;
                        //SE GUARDA EL NOMBRE DEL MUNICIPIO Y DEPARTAMENTO
                        direcciones_controller.getMunicipioYDto(row.TRA_LugaresFrecuente.CodMunicipio).then(ubicaciones => {
                            f.Municipio = ubicaciones.Municipio;
                            f.Departamento = ubicaciones.Departamento;
                        });
                        //f.procu_id = row.TRA_LugaresFrecuente.procuraduria_id;
                        el.fplaces.push(f);
                        el.b++;
                    }
                })
            });
            /**ASIGNACION MOTORISTA**/
            /* var drivers = await Driver_assign.findAll({
                include: [{
                    model: Driver,
                    attributes: ['first_name', 'last_name', 'license_type']
                }],
                where: {
                    folo06_id: el.id
                }
            });
            el.driver_a = new Object();
            drivers.forEach((driver, i) => {
                var e = new Object();
                el.driver = new Object();
                console.dir(JSON.stringify(driver));
                e.first_name = driver.SGT_Motoristum.first_name;
                e.last_name = driver.SGT_Motoristum.last_name;
                e.license_type = driver.SGT_Motoristum.license_type;
                el.driver = e;
            }); */
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.address = [];
            //Para traer todos las direcciones ligados a ese folo
            var containers = await LugaresContenedor.findAll({
                where: {
                    IDFolo: req.body.IDFolo,
                    IDLugarFrecuente: {
                        [Op.is]: null
                    }
                }
            })
            //console.dir("Conglomerado de address:" + JSON.stringify(Dirs) + " eS DEL TIPO " + typeof (Dirs));

            await asyncForEach(containers, async (container) => {
                //console.dir(row.SGT_Direccion);
                var array = await Address.findAll({
                    where: {
                        IDLugarContenedor: container.IDLugarContenedor
                    }
                })
                var row = array[0];
                console.log("Direccion: " + row.Nombre + " " + row.Detalle);
                var dir = new Object();
                dir.IDDireccion = row.IDDireccion;
                dir.Nombre = row.Nombre;
                dir.Detalle = row.Detalle;
                //SE GUARDA EL NOMBRE DEL MUNICIPIO Y DEPARTAMENTO
                await direcciones_controller.getMunicipioYDto(row.CodMun).then(ubicaciones => {
                    dir.Municipio = ubicaciones.Municipio;
                    dir.Departamento = ubicaciones.Departamento;
                });
                //dir.procu_id = row.address.procuraduria_id;
                el.address.push(dir);
                el.b++;
            });

            el.emp = new Object();
            const token = auth_controller.decode_token(req.cookies.token);
            el.emp = token.user;
            el.emp.unit = await employee_controller.findUnitByUser(token.user)

            console.dir("Datos del folo" + JSON.stringify(el) + "\nDatos el empleado: " + JSON.stringify(el.emp));
            console.dir("Lugares frecuentes: " + JSON.stringify(el.fplaces));
            console.dir("Direcciones: " + JSON.stringify(el.address));
            // console.dir(data);
            //Envía los datos de 'el' a la vista. En ella se debe acceder a sus atributos en forma: data.folo.x; x es cualquier atributo del folo enviado
            console.log("Folo contiene esta cantidad de direcciones y lugares" + el.b)
            return el;
        } catch (error) {
            console.log(error);
        };
    };
    async foloInfoById(req, res) {
        try {
            let Departamentos = await department_controller.getList();

            console.log("FOLO QUE VOY A VERIFICAR" + req.params.id)
            var folo = await Folo6.findAll({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'person_who_drive', 'license_type', 'mission', 'observation', 'created_at', 'employee_id']
            });
            //console.dir(folo);
            var el = new Object();
            folo.forEach((folo, i) => {
                console.log("FOLO QUE VOY RECIBI" + folo.id)

                el.id = folo.id;
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                el.off_date = moment.utc(folo.off_date).format("DD/MM/YYYY");
                el.off_hour = moment.utc(folo.off_hour).format("h:mm A");
                el.return_hour = moment.utc(folo.return_hour).format("h:mm A");
                el.passengers_number = folo.passengers_number;
                el.with_driver = folo.with_driver ? 1 : 0;
                el.person_who_drive = folo.person_who_drive;
                el.license_type = folo.license_type;
                el.mission = folo.mission;
                el.observation = folo.observation;
                el.created_at = moment.utc(folo.created_at).utcOffset("-06:00").format("DD/MM/YYYY");
                el.employee_id = folo.employee_id;
            });

            //Contador de lugares frecuentes y direcciones
            el.b = 0
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.fplaces = [];
            //Para traer todos los lugares frecuentes ligados a ese folo
            await LugaresContenedor.findAll({
                where: {
                    folo_id: req.params.id
                },
                attributes: ['frequent_place_id'],
                include: [FPlace]
            }).then(Fplaces => {
                console.dir("Conglomerado de fplac:" + JSON.stringify(Fplaces) + " eS DEL TIPO " + typeof (Fplaces))
                Fplaces.forEach(row => {
                    if (row.TRA_LugaresFrecuente) {
                        //console.dir("Datos del lugar:" + JSON.stringify(row.frequent_place.name));
                        var f = new Object();
                        f.city = new Object();
                        f.department = new Object();

                        f.id = row.TRA_LugaresFrecuente.id;
                        f.name = row.TRA_LugaresFrecuente.name;
                        f.detail = row.TRA_LugaresFrecuente.detail;
                        //SE GUARDA EL NOMBRE DEL MUNICIPIO
                        f.city.id = row.TRA_LugaresFrecuente.city_id;
                        municipio_controller.getName(row.TRA_LugaresFrecuente.city_id).then(name => {
                            f.city.name = name;
                        });
                        //SE GUARDA EL NOMBRE DEL DEPARTAMENTO
                        f.department.id = row.TRA_LugaresFrecuente.department_id;
                        department_controller.getName(row.TRA_LugaresFrecuente.department_id).then(name => {
                            f.department.name = name;
                        });
                        f.procu_id = row.TRA_LugaresFrecuente.procuraduria_id;
                        el.fplaces.push(f);
                        el.b++;
                    }
                })
            });
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.address = [];
            //Para traer todos las direcciones ligados a ese folo
            //Para traer todos las direcciones ligados a ese folo
            var containers = await LugaresContenedor.findAll({
                where: {
                    folo_id: req.params.id,
                    frequent_place_id: {
                        [Op.is]: null
                    }
                }
            })
            //console.dir("Conglomerado de address:" + JSON.stringify(Dirs) + " eS DEL TIPO " + typeof (Dirs));

            await asyncForEach(containers, async (container) => {
                //console.dir(row.SGT_Direccion);
                var array = await Address.findAll({
                    where: {
                        container_id: container.id
                    }
                })
                var row = array[0];
                console.log("Direccion: " + row.name + " " + row.detail);
                var dir = new Object();
                dir.city = new Object();
                dir.department = new Object();
                dir.id = row.id;
                dir.name = row.name;
                dir.detail = row.detail;
                dir.city.id = row.city_id;
                //SE GUARDA EL NOMBRE DEL MUNICIPIO
                municipio_controller.getName(row.city_id).then(name => {
                    dir.city.name = name;
                });
                dir.department.id = row.department_id
                //SE GUARDA EL NOMBRE DEL DEPARTAMENTO
                department_controller.getName(row.department_id).then(name => {
                    dir.department.name = name;
                });
                //dir.procu_id = row.address.procuraduria_id;

                el.address.push(dir);
                el.b++;

            });
            el.emp = new Object();
            el.emp = await employee_controller.findById1(el.employee_id);

            console.dir("Datos del folo" + JSON.stringify(el) + "\nDatos el empleado: " + JSON.stringify(el.emp));
            console.dir("Lugares frecuentes: " + JSON.stringify(el.fplaces));
            console.dir("Direcciones: " + JSON.stringify(el.address));
            // console.dir(data);
            //Envía los datos de 'el' a la vista. En ella se debe acceder a sus atributos en forma: data.folo.x; x es cualquier atributo del folo enviado
            res.render('./folo6/folo6_edit.html', {
                folo: el,
                Departamentos
            });
        } catch (error) {
            console.log(error);
        }
    };

    //Método que envía los folos ingresados de forma que puedan ser renderizados en un datatable; incluye iconos de eliminado y de edición.
    async getList(req, res) {
        const token = auth_controller.decode_token(req.cookies.token)
        var day, mont, year;
        try {
            /******FALTA: LISTAR LOS VALES QUE CORRESPONDEN A UN SOLO EMPLEADO*/
            var folos = await Folo6.findAll({
                attributes: ['IDFolo', 'FechaSalida', 'HoraSalida', 'HoraRetorno', 'CantidadDePasajeros', 'ConMotorista', 'FechaCreacion'],
                where: {
                    CreadoPor: token.user.CodigoUsuario
                }
            });
            //console.log(d);
            //data contendrá todos los folos extraídos de la BD
            var data = [];
            folos.forEach((row, i) => {
                var el = new Object();
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                el.FechaSalida = moment.utc(row.FechaSalida).format("DD MMMM YYYY");
                el.HoraSalida = moment.utc(row.HoraSalida).format("h:mm A");
                el.HoraRetorno = moment.utc(row.HoraRetorno).format("h:mm A");
                el.CantidadDePasajeros = row.CantidadDePasajeros;
                //Si with_driver = true, envía la cadena "Si"
                el.ConMotorista = row.ConMotorista ? "Si" : "No";
                el.FechaCreacion = moment.parseZone(row.FechaCreacion).local().format("DD/MM/YYYY h:mm A");
                //Icono para visualizar el folo. Enlance y un icono de lapiz para editar el folo. Un icono de eliminado. Ambos tiene por identificardor el id del folo que ha ido a traer a la BD
                //var today = moment().format("DD MMMM YYYY");
                var trully = moment().isBefore(moment.utc(row.FechaSalida))
                //console.log("FECHA ES: " + trully);
                //Descomentar cuando ya se habilite el editar, eliminar e imprimir
                /* if (trully)
                    el.buttons = '<i id="' + row.IDFolo + '" class="large print black link icon "></i><i id="' + row.IDFolo + '" class="large file grey alternate outline link icon "></i><a href="/solicitud_nueva/edit/' + row.IDFolo + '"><i class="large pencil yellow alternate link icon"></i></a><i class="large trash red alternate outline link icon" id="' + row.IDFolo + '"></i>';
                else
                    el.buttons = '<i id="' + row.IDFolo + '" class="large print black link icon "></i><i id="' + row.IDFolo + '" class="large file grey alternate outline link icon "></i>'
                 */
                //SOLO PARA PROBAR IMPRESION
                el.buttons = '<i id="' + row.IDFolo + '" class="large print black link icon "></i>';
                data.push(el);
            });
            //console.dir(data);
            //Envío de los folos en formato JSON
            res.send({
                data: data
            });
        } catch (error) {
            console.log(error);
        }
    };
    //Envía el folo solicitado en el formato en que fueron ingresados. Este se utiliza principalmente en la pantalla para hacer el update al folo6
    async getOne(req, res) {
        try {
            var folo = await Folo6.findAll({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'person_who_drive', 'license_type', 'mission', 'observation', 'created_at', 'employee_id']
            });
            console.dir(folo);
            var el = new Object();
            folo.forEach((folo, i) => {
                el.id = folo.id;
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                el.off_date = moment.utc(folo.off_date).format("DD/MM/YYYY");
                el.off_hour = moment.utc(folo.off_hour).format("h:mm A");
                el.return_hour = moment.utc(folo.return_hour).format("h:mm A");
                el.passengers_number = folo.passengers_number;
                //Se envía '1' ó '0' por que el checkbox "Con motorista" reconoce ambos como estados válidos.
                el.with_driver = folo.with_driver ? 1 : 0;
                el.person_who_drive = folo.person_who_drive;
                el.license_type = folo.license_type;
                el.mission = folo.mission;
                el.observation = folo.observation;
                el.created_at = moment.utc(folo.created_at).format("DD/MM/YYYY");
                el.employee_id = folo.employee_id;
            });

            console.log(el);
            // console.dir(data);
            res.render('./folo6/folo6_edit.html', {
                folo: el
            });
            //return folo;
        } catch (error) {
            console.log(error);
        }
    };
    //Método para enviar en forma de string todos los atributos del folo 6 se utiliza para mostrar en un modal el folo ya sea para ver todos los atributos o para eliminarlos
    //*** FALTA MANDAR COMO STRING LAS DIRECCIONES */
    async foloToString(req, res) {
        try {
            var folo = await Folo6.findAll({
                where: {
                    id: req.params.id
                },
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'person_who_drive', 'license_type', 'mission', 'observation', 'created_at', 'employee_id']
            });
            console.dir(folo);
            var el = new Object();
            folo.forEach((folo, i) => {
                el.id = folo.id;
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                el.off_date = moment.utc(folo.off_date).format("DD/MM/YYYY");
                el.off_hour = moment.utc(folo.off_hour).format("h:mm A");
                el.return_hour = moment.utc(folo.return_hour).format("h:mm A");
                el.passengers_number = folo.passengers_number;
                el.with_driver = folo.with_driver ? 1 : 0;
                el.person_who_drive = folo.person_who_drive;
                el.license_type = folo.license_type;
                el.mission = folo.mission;
                el.observation = folo.observation;
                el.created_at = moment.utc(folo.created_at).format("DD/MM/YYYY");
                el.employee_id = folo.employee_id;
            });

            //Contador de lugares frecuentes y direcciones
            el.b = 0
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.fplaces = [];
            //Para traer todos los lugares frecuentes ligados a ese folo
            await LugaresContenedor.findAll({
                where: {
                    folo_id: req.params.id
                },
                attributes: ['frequent_place_id'],
                include: [FPlace]
            }).then(Fplaces => {
                console.dir("Conglomerado de fplac:" + JSON.stringify(Fplaces) + " eS DEL TIPO " + typeof (Fplaces))
                Fplaces.forEach(row => {
                    if (row.frequent_place) {
                        console.dir("Datos del lugar:" + JSON.stringify(row.frequent_place.name));
                        el.fplaces.push(row.frequent_place);
                        el.b++;
                    }
                })
            });
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.address = [];
            //Para traer todos las direcciones ligados a ese folo
            await LugaresContenedor.findAll({
                where: {
                    folo_id: req.params.id
                },
                attributes: ['address_id'],
                include: [Address]
            }).then(Dirs => {
                console.dir("Conglomerado de address:" + JSON.stringify(Dirs) + " eS DEL TIPO " + typeof (Dirs))
                Dirs.forEach(row => {
                    if (row.address) {
                        console.dir("Datos del lugar:" + JSON.stringify(row.address.detail));
                        el.address.push(row.address);
                        el.b++;
                    }
                })
            });
            console.dir(el);
            /* let x = await this.foloInfo(req, res)
            console.dir("Recibí el objeto " + x) */
            //Envía los datos de 'el' a la vista. En ella se debe acceder a sus atributos en forma: data.folo.x; x es cualquier atributo del folo enviado
            res.send({
                folo: el
            });
        } catch (error) {
            console.log(error);
        }
    };
    //Este metodo recibe los parametros del req y con ellos crea el folo en la BD
    async createFolo6(req, res) {
        var form, empInfo, date, motorista, fplaces, address, folo;
        //Convierte los json enviados por un post de ajax
        motorista = JSON.parse(req.body.motorista);
        console.dir("form: " + JSON.stringify(motorista + "Y del tipo:" + typeof (motorista)));
        form = JSON.parse(req.body.form);
        console.dir("form: " + JSON.stringify(form));
        empInfo = JSON.parse(req.body.empInfo);
        //console.dir("emp: " + JSON.stringify(empInfo) );
        fplaces = JSON.parse(req.body.fplaces)
        console.dir("Recibi estos lugares frecuentes: " + fplaces);
        address = JSON.parse(req.body.address)
        console.dir("Recibi estas direcciones: " + address)

        const token = auth_controller.decode_token(req.cookies.token);
        empInfo.user = token.user;

        console.log("LA MISION QUE TRAE ES" + form.mision_i, )
        try {
            const errors = validationResult(req);
            //Conversion al formato permitido por sequelize YYYY-MM-DD y horas HH:mm (Formato 24 hrs)
            date = moment(form.calendar1, "DD/MM/YYYY").format("YYYY-MM-DD");
            var t = moment(form.time, ["h:mm A"]).format("HH:mm");
            var t1 = moment(form.time1, ["h:mm A"]).format("HH:mm");

            //errors es una variable declara para las validaciones realizadas en express
            //console.log(errors.array());

            if (!errors.isEmpty()) {
                res.send({
                    title: "Error al guardar los datos",
                    message: "Ocurrio un error mientras se guardaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                    type: 1
                });
            } else {
                console.log("Estoy en el create");
                //CREATE para los estados de aprobacion del folo
                //Si en el folo 6 selecciono motorista se llenará con estos datos la BD
                if (motorista) {
                    folo = await Folo6.create({
                        IDRelacionUbicacion: empInfo.IDRelacionUnidadUbicacion,
                        FechaSalida: date,
                        HoraSalida: t,
                        HoraRetorno: t1,
                        CantidadDePasajeros: form.passengers_i,
                        ConMotorista: motorista,
                        PersonaQueConducira: null,
                        TipoDeLicencia: null,
                        IDMision: form.mision_i,
                        Observacion: form.details_i,
                        CreadoPor: empInfo.user.CodigoUsuario,
                        // procuraduria_id: emp.procuraduria_id
                    });
                    //Folo creado
                    console.dir("Folo creado" + folo);

                } else {
                    //Si en el folo 6 NO selecciono motorista se llenará con estos datos la BD

                    folo = await Folo6.create({
                        IDRelacionUbicacion: empInfo.IDRelacionUnidadUbicacion,
                        FechaSalida: date,
                        HoraSalida: t,
                        HoraRetorno: t1,
                        CantidadDePasajeros: form.passengers_i,
                        ConMotorista: motorista,
                        PersonaQueConducira: form.name_driver_i,
                        TipoDeLicencia: form.license_ls,
                        IDMision: form.mision_i,
                        Observacion: form.details_i,
                        CreadoPor: empInfo.user.CodigoUsuario,
                        //procuraduria_id: emp.procuraduria_id
                    });
                    console.dir("Folo creado" + folo);
                }
                //Si es jefe, se auto-aprobara a si mismo
                /**APROBACION FOLO**/
                /* if (emp.is_unit_boss) {
                    Apanel.create({
                        request_unit_approve: 1,
                        aprove_boss_id: emp.id,
                        transport_unit_approve: 0,
                        folo06_id: folo.id
                    });
                } else {
                    Apanel.create({
                        request_unit_approve: 0,
                        transport_unit_approve: 0,
                        folo06_id: folo.id
                    });
                } */
                //CREATE para places container, esta tabla relaciona ya sean lugares frecuentes o direcciones con un folo
                if (fplaces.length) {
                    fplaces.forEach(IDLugar => {
                        LugaresContenedor.create({
                            IDFolo: folo.IDFolo,
                            FechaDeVisita: date,
                            IDLugarFrecuente: IDLugar
                        });
                    })
                } else {
                    console.log("No hay lugares frecuentes para relacionar");
                }
                if (address.length) {
                    for (var i = 0; i < address.length; i++) {
                        //Se crea el place container para cada dirección creada
                        var container = await LugaresContenedor.create({
                            IDFolo: folo.IDFolo,
                            FechaDeVisita: date,
                        });
                        console.log("container id:" + container.IDLugarContenedor)
                        var a = await Address.update({
                            IDLugarContenedor: container.IDLugarContenedor
                        }, {
                            where: {
                                IDDireccion: address[i]
                            }
                        });
                    }
                    console.log("dirección creada:" + a)
                } else {
                    console.log("No hay direcciones que relacioar");
                }
                console.log("sali del create");
                //Datos que se envían a la vista
                const query = querystring.stringify({
                    success: "yes",
                });

                res.send({
                    redirect: "/home?&" + query,
                    status: 200
                });
            }
        } catch (err) {
            console.log("Ocurrió en el método create " + err);
            res.send({
                title: "Error al guardar los datos",
                message: "Ocurrio un error mientras se guardaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                type: 1
            });
            //throw new Error(" Ocurre ingresando los vales en la BD " + err);
        }
    };
    //Recibe los datos actulizados para un registro de folo 6
    async editFolo6(req, res) {
        var form, emp, date, motorista, fplaces, address;
        console.log(req.body);
        motorista = JSON.parse(req.body.motorista);
        console.dir("form: " + JSON.stringify(motorista + "Y del tipo:" + typeof (motorista)));
        form = JSON.parse(req.body.form);
        console.dir("form: " + JSON.stringify(form));
        emp = JSON.parse(req.body.emp);
        console.dir("emp: " + JSON.stringify(emp) + "id: " + emp.id);
        fplaces = JSON.parse(req.body.fplaces);
        console.dir("Recibi estos lugares frecuentes: " + fplaces);
        address = JSON.parse(req.body.address);
        console.dir("Recibi estas direcciones: " + address);

        try {
            const errors = validationResult(req);
            console.log("Solicito editar el folo con id: " + form.folo_id);

            //errors es una variable declara para las validaciones realizadas en express
            //Conversion al formato permitido por sequelize YYYY-MM-DD y horas HH:mm (Formato 24 hrs)
            date = moment(form.calendar1, "DD/MM/YYYY").format("YYYY-MM-DD");
            var t = moment(form.time, ["h:mm A"]).format("HH:mm");
            var t1 = moment(form.time1, ["h:mm A"]).format("HH:mm");

            // console.log(errors.array());
            if (!errors.isEmpty()) {
                res.send({
                    title: "Error al guardar los datos",
                    message: "Ocurrio un error mientras se guardaban los cambios, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                    type: 1
                });
            } else {
                console.log("Estoy en el edit");
                if (motorista) {
                    console.log("Estoy en el true del edit");

                    let f = await Folo6.update({
                        request_unit: emp.unit_id,
                        off_date: date,
                        off_hour: t,
                        return_hour: t1,
                        passengers_number: form.passengers_i,
                        with_driver: motorista,
                        person_who_drive: null,
                        license_type: null,
                        mission: form.mision_i,
                        observation: form.details_i,
                        employee_id: emp.id,
                        // procuraduria_id: emp.procuraduria_id
                    }, {
                        where: {
                            id: form.folo_id
                        }
                    });
                    console.dir("Folo actualizado" + f);

                } else {
                    console.log("Estoy en el else del edit");
                    console.log("En el controller me dice que tiene esta licencia" + form.license_ls);
                    let f = await Folo6.update({
                        request_unit: emp.unit_id,
                        off_date: date,
                        off_hour: t,
                        return_hour: t1,
                        passengers_number: form.passengers_i,
                        with_driver: motorista,
                        person_who_drive: form.name_driver_i,
                        license_type: form.license_ls,
                        mission: form.mision_i,
                        observation: form.details_i,
                        employee_id: emp.id,
                        //procuraduria_id: emp.procuraduria_id
                    }, {
                        where: {
                            id: form.folo_id
                        }
                    });
                    console.dir("Folo actualizado" + f);
                }

                //Departamento
                console.log("sali del create");
                var places = LugaresContenedor.findAll({
                    where: {
                        folo_id: form.folo_id
                    }
                });
                await asyncForEach(places, async (container) => {
                    await LugaresContenedor.update({
                        date_of_visit: date
                    }, {
                        where: {
                            id: container.id
                        }
                    })
                })

                const query = querystring.stringify({
                    success: "yes",
                    edit: "yes"
                });

                res.send({
                    redirect: "/home?&" + query,
                    status: 200
                });
            }
        } catch (err) {
            console.log("Ocurrió en el método edit: " + err);
            res.send({
                title: "Error al guardar los cambios",
                message: "Ocurrio un error mientras se actualizaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                type: 1
            });
            //throw new Error(" Ocurre ingresando los vales en la BD " + err);
        }
    }
    //Elima el folo indicado como parametros en req.params.id
    async deleteFolo(req, res) {
        try {
            /* Elimina de la tabla la unión del folo con los lugares y/o direcciones*/
            await LugaresContenedor.destroy({
                where: {
                    folo_id: req.params.id
                }
            });

            /* Elimina el folo */
            var folo = await Folo6.destroy({
                where: {
                    id: req.params.id
                },
            });

            res.send({
                    type: 0,
                    title: "Datos eliminados con éxito",
                    message: "Folo " + req.params.id + " eliminado con exito",
                }

            );
        } catch (err) {
            res.send({
                title: "Error al eliminar los datos",
                message: "Ocurrio un error mientras se eliminaban los datos, intente de nuevo, si el error persiste recargue la pagina o contacte a soporte",
                type: 1
            });
        }
    }

    async deletePlacesContainer(req, res) {
        try {
            let {
                id_address,
                id_frequent_place
            } = req.body;
            if (id_address != null) {
                LugaresContenedor.destroy({
                    where: {
                        address_id: id_address
                    }
                });
            };
            if (id_frequent_place != null) {
                LugaresContenedor.destroy({
                    where: {
                        frequent_place_id: id_frequent_place
                    }
                });
            };
        } catch (error) {
            console.log(error);
        };
    };

    async createPlacesContainer(req, res) {
        try {
            //Declaración y obtención de variables desde el cuerpo de la petición.
            let {
                folo_id,
                date_of_visit,
                address_id,
                selectedPlace,
                selectedPlaceTxt
            } = req.body;
            //Fomateo de fecha para ser aceptado en la BD.
            date_of_visit = moment().format("YYYY-MM-DD")
            //Si seleccionó "Otro" en el dropdown de lugares frecuentes crea un registro en "places_container"
            //con el id de la dirección creada
            if (selectedPlaceTxt == 'Otro') {
                LugaresContenedor.create({
                    date_of_visit,
                    address_id,
                    folo_id
                });
            } else {
                //Si seleccionó otra opción crea un registro en "places_container" con el id del lugar frecuente seleccionado
                LugaresContenedor.create({
                    date_of_visit,
                    frequent_place_id: selectedPlace,
                    folo_id
                });
            };
        } catch (error) {
            console.log(error);
        };
    };

    //Función que verifica si el día seleccionado es un día hábil.
    async esDiaHabil(req, res) {
        try {
            console.log(req.body);
            let fecha = req.body.fecha;
            //Se convierte la fecha a un objeto 'moment' para su manipulación
            var date = moment(fecha, "DD/MM/YYYY");
            //Variable que indica qué día de la semana es. 0 = Lunes, 6 = Domingo
            var day = date.weekday();
            day = day.toString();
            console.log(day);
            res.send(day); //Se envía dato a la vista para mostrar mensaje de advertencia.
        } catch (error) {
            console.log(error)
        };
    };

    //Función que verifica si la hora de salida o de retorno son horas hábiles.
    async esHoraHabil(req, res) {
        try {
            console.log(req.body);
            let hora = req.body.hora;
            var horasNoHabiles = ['0:0', '0:30', '1:0', '1:30', '2:0', '2:30', '3:0', '3:30', '4:0', '4:30',
                '5:0', '5:30', '6:0', '6:30', '7:0', '7:30', '16:30', '17:0', '17:30', '18:0', '18:30', '19:0',
                '19:30', '20:0', '20:30', '21:0', '21:30', '22:0', '22:30', '23:0', '23:30'
            ];
            var habil; //Bandera
            for (var ele of horasNoHabiles) {
                if (hora == ele) {
                    habil = 'no';
                    break;
                } else {
                    habil = 'sí';
                };
            };
            res.send(habil); //Se envía a la vista para mostrar mensaje de advertencia.
        } catch (error) {
            console.log(error)
        };
    };
};

module.exports = new folo6_controllers();

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};
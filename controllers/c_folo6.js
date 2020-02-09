const db = require('../dbconfig/conex');
const Sequelize = require('sequelize');
const Folo6 = require('../models/m_folo6');
const place_container = require('../models/m_places_container');
const FPlace = require('../models/m_lugares_frecuentes');
const Address = require('../models/m_direccion');
//const Apanel = require('../models/m_folo6_approve_state');
//const Driver = require('../models/m_Driver');
//const Driver_assign = require('../models/m_driver_assign');
const Op = Sequelize.Op;
const querystring = require('querystring');
const auth_controller = require('../controllers/c_auth');


//Manejo de fechas
var moment = require('moment');
moment.locale("Es-SV")

//Para manejar el área de direcciones y lugares frecuentes
//const department_controller = require('../controllers/c_department');
//const municipio_controller = require('../controllers/c_city');
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
            let Departamentos = await department_controller.getList();
            return res.render('./folo6/folo6.html', {
                Departamentos
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
            var fechaSolicitud = folo.created_at;
            var unidadSolicitante = folo.emp.unit.name;
            var personaSolicitante = folo.emp.first_name + ', ' + folo.emp.last_name;
            var fechaSalida = folo.off_date;
            var f1 = moment(folo.off_date, "DD/MM/YYYY"); //Para determinar con moment JS qué día de la semana es
            var horaSalida = folo.off_hour;
            var horaRetorno = folo.return_hour;
            var motorista = folo.with_driver ? "Sí" : "No";
            var cantidadPasajeros = folo.passengers_number;
            var personaConducir = folo.person_who_drive;
            var tipoLicencia = folo.license_type;
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
                    direccion = folo.fplaces[0].name + " ," + folo.fplaces[0].detail + " ," + folo.fplaces[0].city.name + " ," + folo.fplaces[0].department.name;
                } else {
                    //Para verificar que address no está vacío
                    if (folo.address.length)
                        direccion = folo.address[0].name + " ," + folo.address[0].detail + " ," + folo.address[0].city.name + " ," + folo.address[0].department.name;
                }
            } else {
                //Si existe más de una ruta o de un lugar frecuente
                direccion = "Ver listado de direcciones en página anexo"
                if (folo.fplaces.length) {
                    folo.fplaces.forEach(ele => {
                        var direcciones = [];
                        direcciones.push(ele.name);
                        direcciones.push(ele.detail);
                        direcciones.push(ele.city.name);
                        direcciones.push(ele.department.name);
                        bodyData.push(direcciones);
                    });
                };
                if (folo.address.length) {
                    folo.address.forEach(ele => {
                        var direcciones = [];
                        direcciones.push(ele.name);
                        direcciones.push(ele.detail);
                        direcciones.push(ele.city.name);
                        direcciones.push(ele.department.name);
                        bodyData.push(direcciones);
                    });
                };
            };
            console.log(typeof (b) + " cantidad " + b)
            var mision = folo.mission;
            var observaciones = folo.observation;
            var horasNoHabiles = ['12:00 AM', '12:30 AM', '1:00 AM', '1:30 AM', '2:00 AM', '2:30 AM',
                '3:00 AM', '3:30 AM', '4:00 AM', '4:30 AM', '5:00 AM', '5:30 AM', '6:00 AM', '6:30 AM',
                '7:00 AM', '7:30 AM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM',
                '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM',
                '11:00 PM', '11:30 PM'
            ]; //Para verificar si las horas de salida o returno son NO hábiles.
            var crearFOLO13; //Variable a enviar a la vista en el response.
            var diaSemana = f1.weekday(); //Método para obtener qué día de la semana es de la fecha provista.
            console.log(diaSemana);
            //0 = Lunes, 6 = Domingo. Si la fecha es sábado o domingo, se genera FOLO-13.
            if (diaSemana == 5 || diaSemana == 6) {
                crearFOLO13 = "Sí";
            } else {
                crearFOLO13 = "No";
            };
            console.log(horaSalida);
            console.log(horaRetorno);
            /*Horas de salida y retorno serán tratadas como hábiles hasta que sea encontrada en el arreglo 
            de 'horasNoHabiles'. De encontrarse se rompe el ciclo.*/
            for (var ele of horasNoHabiles) {
                //Condicionales separadas por cada hora para más claridad.
                if (ele == horaSalida) {
                    crearFOLO13 = "Sí";
                    console.log(horaSalida + ' no es una hora hábil.');
                    break;
                } else {
                    crearFOLO13 = "No";
                    console.log(horaSalida + ' es una hora hábil.');
                };

                if (ele == horaRetorno) {
                    crearFOLO13 = "Sí";
                    console.log(horaRetorno + ' no es una hora hábil.');
                    break;
                } else {
                    crearFOLO13 = "No";
                    console.log(horaRetorno + ' es una hora hábil.');
                };
            };

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
                var today = new Date();
                var month = today.getMonth() + 1;
                // CUERPO DEL DOCUMENTO. NO TOCAR. >:V
                var docDefinition = {
                    info: {
                        //Nombre interno del documento.
                        title: 'Solicitud de transporte FOLO-06 ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    },
                    pageSize: 'LETTER',
                    footer: {
                        text: 'Fecha de impresión: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                        alignment: 'right',
                        fontSize: '8',
                        color: 'gray',
                        italics: true,
                        margin: [15, 5]
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
                    //Se especifica el tipo de contenido que recibirá.
                    /* res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename="folo6.pdf"'
                    }); */
                    //res.setHeader('content-type', 'application/pdf');
                    //Envío del PDF en forma base64.
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
                    footer: {
                        text: 'Fecha de impresión: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                        alignment: 'right',
                        fontSize: '8',
                        color: 'gray',
                        italics: true,
                        margin: [15, 5]
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
                    //res.setHeader('content-type', 'application/pdf');
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
                    footer: {
                        text: 'Fecha de impresión: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                        alignment: 'right',
                        fontSize: '8',
                        color: 'gray',
                        italics: true,
                        margin: [15, 5]
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
                    /* res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment; filename="folo6.pdf"'
                    }); */
                    //delete req.headers;
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
                    footer: {
                        text: 'Fecha de impresión: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                        alignment: 'right',
                        fontSize: '8',
                        color: 'gray',
                        italics: true,
                        margin: [15, 5]
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
                    //res.setHeader('content-type', 'application/pdf');
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
            var fechaSolicitud = folo.created_at;
            var unidadSolicitante = folo.emp.unit.name;
            var personaSolicitante = folo.emp.first_name + ', ' + folo.emp.last_name;
            var fechaSalida = folo.off_date;
            var horaSalida = folo.off_hour;
            var horaRetorno = folo.return_hour;
            var motorista = folo.with_driver ? "Sí" : "No";
            var personaConducir = folo.person_who_drive;
            var mision = folo.mission;

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
                    //Nombre interno del documento.
                    title: 'Hoja de Misión Oficial FOLO-13 ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                },
                pageSize: 'LETTER',
                footer: {
                    text: 'Fecha de impresión: ' + today.getDate() + '/' + month + '/' + today.getFullYear(),
                    alignment: 'right',
                    fontSize: '8',
                    color: 'gray',
                    italics: true,
                    margin: [15, 5]
                },
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
                        }, ''],
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
            console.log("FOLO QUE VOY A VERIFICAR" + req.body.id_folo)
            var folo = await Folo6.findAll({
                where: {
                    id: req.body.id_folo
                },
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'person_who_drive', 'license_type', 'mission', 'observation', 'created_at', 'employee_id']
            });
            //console.dir(folo);
            var el = new Object();
            folo.forEach((folo, i) => {
                console.log("FOLO QUE VOY RECIBI" + folo.id)

                el.id = folo.id;
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                /*CORRECCIÓN HECHA POR AXEL HERNÁNDEZ - 21/11/2019:
                Al mostrar el PDF desde el listado de solicitudes, la fecha de salida se mostraba con un día
                menos que la fecha de salida almacenada en la base de datos.
                Esto sucedía por la resta del tiempo UTC de -6 horas. La fecha de salida es guardada en la BD
                con valores de 0 horas, 0 minutos, 0 segundos (como si se hubiera guardado exactamente a medianoche),
                y al restarle las 6 horas se devolvía al día anterior.*/
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
            console.log(el.id);
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
            await place_container.findAll({
                where: {
                    folo_id: req.body.id_folo
                },
                attributes: ['frequent_place_id'],
                include: [FPlace]
            }).then(Fplaces => {
                //console.dir("Conglomerado de fplac:" + JSON.stringify(Fplaces) + " eS DEL TIPO " + typeof (Fplaces));
                Fplaces.forEach(row => {
                    //console.dir(row.SGT_Lugar_Frecuente);
                    if (row.SGT_Lugar_Frecuente) {
                        console.dir("Datos del lugar:" + JSON.stringify(row.SGT_Lugar_Frecuente.name));
                        var f = new Object();
                        f.city = new Object();
                        f.department = new Object();

                        f.id = row.SGT_Lugar_Frecuente.id;
                        f.name = row.SGT_Lugar_Frecuente.name;
                        f.detail = row.SGT_Lugar_Frecuente.detail;
                        //SE GUARDA EL NOMBRE DEL MUNICIPIO
                        f.city.id = row.SGT_Lugar_Frecuente.city_id;
                        municipio_controller.getName(row.SGT_Lugar_Frecuente.city_id).then(name => {
                            f.city.name = name;
                        });
                        //SE GUARDA EL NOMBRE DEL DEPARTAMENTO
                        f.department.id = row.SGT_Lugar_Frecuente.department_id;
                        department_controller.getName(row.SGT_Lugar_Frecuente.department_id).then(name => {
                            f.department.name = name;
                        });
                        f.procu_id = row.SGT_Lugar_Frecuente.procuraduria_id;
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
            var containers = await place_container.findAll({
                where: {
                    folo_id: req.body.id_folo,
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
            const token = auth_controller.decode_token(req.cookies.token);
            el.emp = token.user;
            el.emp.unit = new Object();
            el.emp.unit = await employee_controller.findUnitByUser(token.user)

            console.dir("Datos del folo" + JSON.stringify(el) + "\nDatos el empleado: " + JSON.stringify(el.emp));
            console.dir("Lugares frecuentes: " + JSON.stringify(el.fplaces));
            console.dir("Direcciones: " + JSON.stringify(el.address));
            // console.dir(data);
            //Envía los datos de 'el' a la vista. En ella se debe acceder a sus atributos en forma: data.folo.x; x es cualquier atributo del folo enviado
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
            await place_container.findAll({
                where: {
                    folo_id: req.params.id
                },
                attributes: ['frequent_place_id'],
                include: [FPlace]
            }).then(Fplaces => {
                console.dir("Conglomerado de fplac:" + JSON.stringify(Fplaces) + " eS DEL TIPO " + typeof (Fplaces))
                Fplaces.forEach(row => {
                    if (row.SGT_Lugar_Frecuente) {
                        //console.dir("Datos del lugar:" + JSON.stringify(row.frequent_place.name));
                        var f = new Object();
                        f.city = new Object();
                        f.department = new Object();

                        f.id = row.SGT_Lugar_Frecuente.id;
                        f.name = row.SGT_Lugar_Frecuente.name;
                        f.detail = row.SGT_Lugar_Frecuente.detail;
                        //SE GUARDA EL NOMBRE DEL MUNICIPIO
                        f.city.id = row.SGT_Lugar_Frecuente.city_id;
                        municipio_controller.getName(row.SGT_Lugar_Frecuente.city_id).then(name => {
                            f.city.name = name;
                        });
                        //SE GUARDA EL NOMBRE DEL DEPARTAMENTO
                        f.department.id = row.SGT_Lugar_Frecuente.department_id;
                        department_controller.getName(row.SGT_Lugar_Frecuente.department_id).then(name => {
                            f.department.name = name;
                        });
                        f.procu_id = row.SGT_Lugar_Frecuente.procuraduria_id;
                        el.fplaces.push(f);
                        el.b++;
                    }
                })
            });
            //Contendra el total de direcciones que se han creaddo para el folo que se solicita
            el.address = [];
            //Para traer todos las direcciones ligados a ese folo
            //Para traer todos las direcciones ligados a ese folo
            var containers = await place_container.findAll({
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
                attributes: ['id', 'off_date', 'off_hour', 'return_hour', 'passengers_number', 'with_driver', 'created_at'],
                where: {
                    created_by: token.user.id
                }
            });
            //console.log(d);
            //data contendrá todos los folos extraídos de la BD
            var data = [];
            folos.forEach((row, i) => {
                var el = new Object();
                //La BD envia las fechas y horas en formato utc por ello se debe convertir al formato especificado en el método format(). Revisar documentación de moment.js
                el.off_date = moment.utc(row.off_date).format("DD MMMM YYYY");
                el.off_hour = moment.utc(row.off_hour).format("h:mm A");
                el.return_hour = moment.utc(row.return_hour).format("h:mm A");
                el.passengers_number = row.passengers_number;
                //Si with_driver = true, envía la cadena "Si"
                el.with_driver = row.with_driver ? "Si" : "No";
                el.created_at = moment.parseZone(row.created_at).local().format("DD/MM/YYYY h:mm A");
                //Icono para visualizar el folo. Enlance y un icono de lapiz para editar el folo. Un icono de eliminado. Ambos tiene por identificardor el id del folo que ha ido a traer a la BD
                //var today = moment().format("DD MMMM YYYY");
                var trully = moment().isBefore(moment.utc(row.off_date))
                //console.log("FECHA ES: " + trully);
                if (trully)
                    el.buttons = '<i id="' + row.id + '" class="large print black link icon "></i><i id="' + row.id + '" class="large file grey alternate outline link icon "></i><a href="/solicitud_nueva/edit/' + row.id + '"><i class="large pencil yellow alternate link icon"></i></a><i class="large trash red alternate outline link icon" id="' + row.id + '"></i>';
                else
                    el.buttons = '<i id="' + row.id + '" class="large print black link icon "></i><i id="' + row.id + '" class="large file grey alternate outline link icon "></i>'
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
            await place_container.findAll({
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
            await place_container.findAll({
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
        var form, emp, date, motorista, fplaces, address, folo;
        //Convierte los json enviados por un post de ajax
        motorista = JSON.parse(req.body.motorista);
        console.dir("form: " + JSON.stringify(motorista + "Y del tipo:" + typeof (motorista)));
        form = JSON.parse(req.body.form);
        console.dir("form: " + JSON.stringify(form));
        emp = JSON.parse(req.body.emp);
        console.dir("emp: " + JSON.stringify(emp) + "id: " + emp.id);
        fplaces = JSON.parse(req.body.fplaces)
        console.dir("Recibi estos lugares frecuentes: " + fplaces);
        address = JSON.parse(req.body.address)
        console.dir("Recibi estas direcciones: " + address)

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
                        created_by: emp.id
                        // procuraduria_id: emp.procuraduria_id
                    });
                    //Folo creado
                    console.dir("Folo creado" + folo);

                } else {
                    //Si en el folo 6 NO selecciono motorista se llenará con estos datos la BD

                    folo = await Folo6.create({
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
                        created_by: emp.id,
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
                    fplaces.forEach(id => {
                        place_container.create({
                            folo_id: folo.id,
                            date_of_visit: moment(),
                            frequent_place_id: id
                        });
                    })
                } else {
                    console.log("No hay lugares frecuentes para relacionar");
                }
                if (address.length) {
                    for (var i = 0; i < address.length; i++) {
                        //Se crea el place container para cada dirección creada
                        var container = await place_container.create({
                            folo_id: folo.id,
                            date_of_visit: moment(),
                        });
                        console.log("container id:" + container.id)
                        var a = await Address.update({
                            container_id: container.id
                        }, {
                            where: {
                                id: address[i]
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
                var places = place_container.findAll({
                    where: {
                        folo_id: form.folo_id
                    }
                });
                await asyncForEach(places, async (container) => {
                    await place_container.update({
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
            await place_container.destroy({
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
                place_container.destroy({
                    where: {
                        address_id: id_address
                    }
                });
            };
            if (id_frequent_place != null) {
                place_container.destroy({
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
                place_container.create({
                    date_of_visit,
                    address_id,
                    folo_id
                });
            } else {
                //Si seleccionó otra opción crea un registro en "places_container" con el id del lugar frecuente seleccionado
                place_container.create({
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
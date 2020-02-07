var tab, data, success, update;
var params = new URLSearchParams(location.search);
success = params.get('success');
update = params.get('edit');

$(function () {
    if (success == 'yes') {
        if (update == 'yes') {
            $('body')
                .toast({
                    title: '¡Éxito!',
                    showIcon: true,
                    class: 'success',
                    showProgress: true,
                    position: 'top right',
                    displayTime: 5000,
                    closeIcon: true,
                    message: 'Solicitud editada correctamente.',
                    transition: {
                        showMethod: 'zoom',
                        showDuration: 100,
                        hideMethod: 'fade',
                        hideDuration: 500
                    },
                    pauseOnHover: false,
                });
        } else {
            $('body')
                .toast({
                    title: '¡Éxito!',
                    showIcon: true,
                    class: 'success',
                    showProgress: true,
                    position: 'top right',
                    displayTime: 5000,
                    closeIcon: true,
                    message: 'Solicitud creada correctamente.',
                    transition: {
                        showMethod: 'zoom',
                        showDuration: 100,
                        hideMethod: 'fade',
                        hideDuration: 500
                    },
                    pauseOnHover: true,
                });
        }
    };

    //Mostrará toast si el usuario no tenía permisos de ingresar la sesión
    //Verifica si el registro fue guardado con exito
    title = getParameterByName('title');
    message = getParameterByName('message');
    clss = getParameterByName('class');
    icon = getParameterByName('icon')

    console.log(title);
    console.log(message);
    console.log(clss);

    if (title && message && clss && icon) {
        AddToast(title, clss, message, icon);
    }
    ///
});

//Serializa la tabla
$(document).ready(function () {
    fillTable();
    $('body').append(tab);
    console.dir($('body'))

});

//llenar tabla
function fillTable() {
    //Llenar el data table con los datos de todos los folos correspondientes al usuario
    tab = $('#mytable').DataTable({
        "scrollCollapse": false,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        },
        //Este AJAX hace referencia al controller, c_folo6.js método getList(req, res)
        ajax: {
            url: '/solicitud_nueva/folos',
            type: 'GET',
        },
        "columns": [{
                "data": "off_date"
            },
            {
                "data": "off_hour"
            },
            {
                "data": "return_hour"
            },
            {
                "data": "passengers_number"
            },
            {
                "data": "with_driver"
            },
            {
                "data": "created_at"
            },
            {
                "data": "buttons",
                //Indicarle que lo que se renderizará son los iconos que trae data del controlador
                "render": function (data, type, row, meta) {
                    return data;
                }

            }
        ]
    });


}
$('#mytable tbody').on('click', '.trash.red.alternate.outline.link.icon', function (event) {
    showLoadingDimmer();
    var id_folo = parseInt($(this).attr('id'));
    console.log("Usted desea eliminar el folo:" + id_folo);
    //$('.segment').dimmer('set disabled');

    //$('#delete_modal').modal('show');
    $('#delete_modal')
        .modal({
            closable: false,
            onShow: function () {

                console.log("Voy a mostrar el folo" + id_folo);
                //DATOS PARA MOSTRAR SOBRE EL FOLO A ELIMINAR
                $.ajax({
                    url: 'solicitud_nueva/getinfo',
                    async: true,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id_folo: JSON.stringify(id_folo)
                    },
                    success: (data) => {

                    }
                }).done(function (data, textStatus, jqXHR) {
                    console.log("Folo que van a eliminar" + data.folo.id);
                    //Para setting de los labels
                    $("#off_date_lb").text(data.folo.off_date);
                    $("#off_hour_lb").text(data.folo.off_hour);
                    $("#return_hour_lb").text(data.folo.return_hour);
                    $("#Passenger_number_lb").text(data.folo.passengers_number);
                    $("#with_driver_lb").text((data.folo.with_driver ? "Si" : "No"));
                    if (data.folo.with_driver) {
                        $("#driver_name_lb").text("------");
                        $("#license_type_lb").text("------");
                    } else {
                        $("#driver_name_lb").text(data.folo.person_who_drive);
                        $("#license_type_lb").text(data.folo.license_type);
                    }
                    $("#mission_lb").text(data.folo.mission);
                    if ((data.folo.observation).length > 1) {
                        $("#observation_lb").text(data.folo.observation);
                    } else {
                        $("#observation_lb").text("Sin observaciones");
                    }
                    $("#created_at_lb").text(data.folo.created_at);
                    //Limpiar la tabla
                    $('#addressTable').find('tbody').detach();
                    $('#addressTable').append($('<tbody>'));
                    if (data.folo.fplaces.length) {
                        data.folo.fplaces.forEach(ele => {
                            //Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
                            //Inserción de elementos a la tabla
                            $('#addressTable tbody').append("<tr>" +
                                "<td>" + ele.name + "</td>" +
                                "<td>" + ele.detail + "</td>" +
                                "<td>" + ele.city.name + "</td>" +
                                "<td>" + ele.department.name + "</td>" +
                                "</tr>");
                        })
                    }
                    if (data.folo.address.length) {
                        data.folo.address.forEach(ele => {
                            //direcciones.push("\n" + i + " - " /* + ele.name + ', ' */ + ele.detail + ', ' + ele.city.name + ',' + ele.department.name + ".");
                            //Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
                            //Inserción de elementos a la tabla
                            $('#addressTable tbody').append("<tr>" +
                                "<td>" + ele.name + "</td>" +
                                "<td>" + ele.detail + "</td>" +
                                "<td>" + ele.city.name + "</td>" +
                                "<td>" + ele.department.name + "</td>" +
                                "</tr>");
                        })
                    }
                    $('.segment').dimmer('hide');

                })
            },
            onDeny: function () {

            },
            onApprove: function () {
                animateAddButton();
                showDimmer();

                $.ajax({
                    url: 'solicitud_nueva/delete/' + id_folo,
                    async: true,
                    type: 'POST',
                    dataType: 'json',
                    success: (data) => {
                        console.log(data.type);
                        if (!data.type) {
                            successAddToast(data.title, data.message)
                            noAnimateAddButton();
                            tab.ajax.reload();
                        } else {
                            noAnimateAddButton();

                            $('body')
                                .toast({
                                    title: data.title,
                                    showIcon: false,
                                    class: 'error',
                                    position: 'top right',
                                    displayTime: 0,
                                    closeIcon: true,
                                    message: data.message,
                                });

                        }
                        //Para setting de los labels

                    }
                });
            }
        })
        .modal('show')
});

function debugBase64(base64URL) {
    var win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    win.document.close()
}

//PARA MOSTRAR EL PDF DEL FOLO SELECCIONADO
$('#mytable tbody').on('click', '.print.link.icon', function (event) {
    showLoadingPDFDimmer();
    var id_folo = parseInt($(this).attr('id'));
    console.log("Usted desea imprimir el folo:" + id_folo);
    //$('.segment').dimmer('set disabled');

    $.ajax({
        url: '/solicitud_nueva/showPDF',
        async: true,
        type: 'POST',
        dataType: 'json',
        data: {
            id_folo: JSON.stringify(id_folo)
        },
        success: (data) => {
            console.log("El folo se mostrará en seguida")
        }
    }).done(function (data, textStatus, jqXHR) {
        console.log("imprimi")
        debugBase64(data.link);
        $('.segment').dimmer('hide');
    })
});
$('#mytable tbody').on('click', '.file.alternate.outline.link.icon', function (event) {
    showLoadingDimmer();
    var id_folo = parseInt($(this).attr('id'));
    console.log("Usted desea Mostrar el folo:" + id_folo);
    //$('.segment').dimmer('set disabled');

    //$('#delete_modal').modal('show');
    $('#show_modal')
        .modal({
            closable: false,
            onShow: function () {

                console.log("Voy a mostrar el folo" + id_folo);
                //DATOS PARA MOSTRAR SOBRE EL FOLO A ELIMINAR
                $.ajax({
                    url: 'solicitud_nueva/getinfo',
                    async: true,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id_folo: JSON.stringify(id_folo)
                    },
                    success: (data) => {

                    }
                }).done(function (data, textStatus, jqXHR) {
                    console.log("Folo que van a visualizar" + data.folo.id);
                    //Para setting de los labels
                    $("#off_date_lb1").text(data.folo.off_date);
                    $("#off_hour_lb1").text(data.folo.off_hour);
                    $("#return_hour_lb1").text(data.folo.return_hour);
                    $("#Passenger_number_lb1").text(data.folo.passengers_number);
                    $("#with_driver_lb1").text((data.folo.with_driver ? "Si" : "No"));
                    if (data.folo.with_driver) {
                        $("#driver_name_lb1").text("------");
                        $("#license_type_lb1").text("------");
                    } else {
                        $("#driver_name_lb1").text(data.folo.person_who_drive);
                        $("#license_type_lb1").text(data.folo.license_type);
                    }
                    $("#mission_lb1").text(data.folo.mission);
                    if (data.folo.observation) {
                        $("#observation_lb1").text(data.folo.observation);
                    } else {
                        $("#observation_lb1").text("Sin observaciones");
                    }
                    $("#created_at_lb1").text(data.folo.created_at);
                    //Limpiar la tabla
                    /* $('#progressTable1').find('tbody').detach();
                    $('#progressTable1').append($('<tbody>')); */
                    /* console.log("lo que quiero que se vea" + data.folo.estado.unit_cancel_detail); */
                    console.log(data.folo.estado.gas);
                    if (data.folo.estado.gas) {
                        var value = 1;
                        progressBar(value);
                    } else if (data.folo.estado.car) {
                        var value = 2;
                        progressBar(value);
                    } else if (data.folo.estado.driver) {
                        var value = 3;
                        progressBar(value);
                    } else if (data.folo.estado.t_approve) {
                        var value = 4;
                        progressBar(value);
                    } else if (!(data.folo.estado.t_approve) && data.folo.estado.t_det_approve) {
                        var value = 6;
                        var motivo = data.folo.estado.t_det_approve;
                        progressBar(value, motivo);
                    } else if (data.folo.estado.u_approve) {
                        var value = 5;
                        progressBar(value);
                    } else if (!(data.folo.estado.u_approve) && data.folo.estado.u_det_approve) {
                        var value = 7;
                        var motivo = data.folo.estado.u_det_approve;
                        progressBar(value, motivo);
                    } else {
                        progressBar();
                    }
                    $('#addressTable1').find('tbody').detach();
                    $('#addressTable1').append($('<tbody>'));
                    if (data.folo.fplaces.length) {
                        data.folo.fplaces.forEach(ele => {
                            //Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
                            //Inserción de elementos a la tabla
                            $('#addressTable1 tbody').append("<tr>" +
                                "<td>" + ele.name + "</td>" +
                                "<td>" + ele.detail + "</td>" +
                                "<td>" + ele.city.name + "</td>" +
                                "<td>" + ele.department.name + "</td>" +
                                "</tr>");
                        })
                    }
                    if (data.folo.address.length) {
                        data.folo.address.forEach(ele => {
                            //direcciones.push("\n" + i + " - " /* + ele.name + ', ' */ + ele.detail + ', ' + ele.city.name + ',' + ele.department.name + ".");
                            //Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
                            //Inserción de elementos a la tabla
                            $('#addressTable1 tbody').append("<tr>" +
                                "<td>" + ele.name + "</td>" +
                                "<td>" + ele.detail + "</td>" +
                                "<td>" + ele.city.name + "</td>" +
                                "<td>" + ele.department.name + "</td>" +
                                "</tr>");
                        })
                    }
                    $('.segment').dimmer('hide');
                })
            }
        }).modal('show');

});

function successAddToast(title, message) {
    $('.segment').dimmer('hide');
    // $('.segment').dimmer('set disabled');
    $('body')
        .toast({
            title: title,
            showIcon: true,
            class: 'success',
            position: 'top right',
            displayTime: 4000,
            closeIcon: true,
            message: message,
            /* className: {
                toast: 'ui message'
            } */
            transition: {
                showMethod: 'zoom',
                showDuration: 100,
                hideMethod: 'fade',
                hideDuration: 500
            }
        });
}

function showDimmer() {
    // $('.segment').dimmer('set active');
    $('.segment').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "Eliminando la solicitud...",
        closable: false,
    }).dimmer('show');
}

function showLoadingDimmer() {
    // $('.segment').dimmer('set active');
    $('.segment').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "Cargando los datos...",
        closable: false,
    }).dimmer('show');
}

function showLoadingPDFDimmer() {
    // $('.segment').dimmer('set active');
    $('.segment').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "El folo se mostrará en seguida...",
        closable: false,
    }).dimmer('show');
}

function animateAddButton() {
    $('.approve.button').api('set loading');
    showDimmer();
}

function noAnimateAddButton() {
    {
        $('.approve.button')
            .api('remove loading');
        //$('.segment').dimmer('set disabled');
        $('.segment').dimmer('hide');
        //enable_elements();
    }
}

function debugBase64(base64URL) {
    var win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    console.log(base64URL)
    win.document.close()
}

function progressBar(valor, motivo) {
    $('#progressTable1Parent').find('div').detach();
    $('#progressTable1Parent').append($('<div id="progressTable1">'));
    console.log(valor);
    if (valor == "1") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Asignados</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "2") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Esperando Asignaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "3") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Esperando Asignaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "4") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Esperando Asignaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "5") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Esperando Aprobaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Esperando Asignaci&oacute;</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "5") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Esperando Aprobaci&oacute;n</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Asignado</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Esperando Asignaci&oacute;</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    } else if (valor == "6") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="completed step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Aprobado</div>' +
            '</div>' +
            '</div>' +
            '<div class="active step" style="max-width:80%;width:80%">' +
            '<i class="exclamation circle red icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Su solicitud ha sido cancelada debido a: ' + motivo + ' </div>' +
            '</div>' +
            '</div>'
        );
    } else if (valor == "7") {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="active step" style="max-width:100%;width:100%">' +
            '<i class="exclamation circle red icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Su solicitud ha sido cancelada debido a: ' + motivo + ' </div>' +
            '</div>' +
            '</div>'
        );
    } else {
        $('#progressTable1').append('<div class="ui tablet stackable steps">' +
            '<div class="active step" style="max-width:20%;width:20%">' +
            '<i class="user tie icon"></i>' +
            '<div class="content">' +
            '<div class="title">Jefe Unidad</div>' +
            '<div class="description">Entregado</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="chalkboard teacher icon"></i>' +
            '<div class="content">' +
            '<div class="title">Unidad de Transporte</div>' +
            '<div class="description">Sin Aprobar</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="user icon"></i>' +
            '<div class="content">' +
            '<div class="title">Motorista</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="car icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vehiculo</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '<div class="disabled step" style="max-width:20%;width:20%">' +
            '<i class="gas pump icon"></i>' +
            '<div class="content">' +
            '<div class="title">Vales</div>' +
            '<div class="description">Sin Asignar</div>' +
            '</div>' +
            '</div>' +
            '</div>');
    }
};

/*
Obtienes los parametro del querystring por nombre
25092019_DD
*/
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

/*
Funcion que muestra un mensaje a lado superior derecho
27092019_DD
*/

function AddToast(_title, _class, _message, _icon) {
    $('body')
        .toast({
            title: _title,
            showIcon: _icon ? _icon : true,
            class: _class,
            position: 'top right',
            displayTime: 0,
            closeIcon: true,
            message: _message,
            transition: {
                showMethod: 'zoom',
                showDuration: 100,
                hideMethod: 'fade',
                hideDuration: 500
            }
        });
}
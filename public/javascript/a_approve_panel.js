/* Asignamos el formato de datables a nuestra tabla */
$(document).ready(function () {
    $('#mytable').DataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });

});

/* Al cargar la pantalla completamente se muestran los mensajes */
$(window).on('load', function () {
    console.log('window loaded');
    this.enviarToast();
});

/* Para mostrar el toast */
/* type = 1 ó 0 --- depende si se ha aprobado o cancelado el folo  */
/* info = 1 ó 0 --- si se ingreso correctamente o hubo error en la base */
function enviarToast() {
    var type = $('input#messagetype').val();
    var info = $('input#messageinfo').val(); /* Tomamos los valores de los input en el HTML */
    if (type == 'true') {
        if (info == 'true') {
            $('body')
                .toast({
                    class: 'success',
                    message: `El Requerimiento fue aprobado`,
                    position: 'top right'
                });
        } else if (info == 'false') {
            $('body')
                .toast({
                    class: 'error',
                    position: 'top right',
                    message: `Error al modificar la base de Datos.`
                });
        }
    } else if (type == 'false') {
        if (info == 'true') {
            $('body')
                .toast({
                    class: 'warning',
                    position: 'top right',
                    message: `El Requerimiento fue cancelado`
                });
        } else if (info == 'false') {
            $('body')
                .toast({
                    class: 'error',
                    position: 'top right',
                    message: `Error al modificar la base de Datos.`
                });
        }
    }
};

$('#container').css('display', 'block'); /* para arreglar un error de datatables */

/* fill approve mueve el id del folo que se modificara desde la tabla al modal */
function fillApproveButton() {
    /* Asociamos el evento al boton aprobar */
    //$(".button.btnAprobe").click(function (e) {
    $('.green.check.circle.outline.icon').click(function (e) {
        var idchange = $(e.currentTarget).closest('td.btnDelete').find("input[name='folo06_id']").val(); /* se busca el id y se asigna al form */
        console.log(idchange);
        $('.ui.form').form('reset');
        document.getElementById("folo6_id_Amodal").value = idchange;
    });
    /* Asociamos el evento al boton cancelar */
    //$(".button.btnCancel").click(function (e) {
    $('.red.window.close.icon').click(function (e) {
        var idchange = $(e.currentTarget).closest('td.btnDelete').find("input[name='folo06_id']").val(); /* se busca el id y se asigna al form */
        console.log(idchange);
        $('.ui.form').form('reset');
        document.getElementById("folo6_id_Cmodal").value = idchange;
    });

    //$('.button.btnShow').click(function (event) {
    $('.file.alternate.outline.icon').click(function (event) {
        showLoadingDimmer();
        var id_folo = parseInt($(event.currentTarget).closest('td.btnDelete').find("input[name='folo06_id']").val()); /* se busca el id y se asigna al form */
        console.log("Usted desea Mostrar el folo:" + id_folo);
        //$('.segment').dimmer('set disabled');

        //$('#delete_modal').modal('show');
        $('#show_modal')
            .modal({
                closable: false,
                onShow: function () {
                    $('.segment').dimmer('hide');
                    console.log("Voy a mostrar el folo" + id_folo);
                    //DATOS PARA MOSTRAR SOBRE EL FOLO A ELIMINAR
                    $.ajax({
                        url: '/solicitud_nueva/getinfo',
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
                        $('#addressTable1').find('tbody').detach();
                        $('#addressTable1').append($('<tbody>'));
                        console.log(data.folo.fplaces);
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
                    })
                }
            }).modal('show')
    });
};

$(function () {
    fillApproveButton();
});
/* Bind de los eventos para poder abrir el modal correspondiente */
$('#AprobeModal')
    .modal('attach events', '.green.check.circle.outline.icon', 'show');

$('#CancelModal')
    .modal('attach events', '.red.window.close.icon', 'show');

/* $('#show_modal')
    .modal('attach events', '.btnShow.button', 'show'); */

$('.ui.form').form({
    //revalidate: true,
    inline: true,
    fields: {
        motivo: {
            identifier: 'motivo',
            rules: [{
                type: 'empty',
                prompt: 'Debe ingresar un motivo'
            }]
        }
    }
});

function showLoadingDimmer() {
    // $('.segment').dimmer('set active');
    $('.segment').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "Cargando los datos...",
        closable: false,
    }).dimmer('show');
};
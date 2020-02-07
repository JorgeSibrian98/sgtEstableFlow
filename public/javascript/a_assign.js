var filterValue, myTable;
var tableCells = "<tbody> <tr> <td> 1 </td> <td> 2 </td> <td> 3 </td> <td> 4 </td> <td> <i class =\"yellow big edit icon\" value=\"\" >< /i> <i class =\"red big window close icon\" value =\"\" >< /i> </td > </tr> </tbody>"

$(window).on('load', function () {
    this.enviarToast();
});

$(document).ready(function () {
    myTable = $('#mytable').DataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });
    $.ajax({
        url: '/vales/quantity',
        async: true,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            num = data.v;
        }
    }).done(function () {
        $("#quantity").text(num);
    });

    var mostrar = $('input#mostrar_modal').val();
    if (mostrar == 'true') {
        $('.ui.modal')
            .modal('show');
    }
});

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

/* Detona el metodo editar en el back mediante el id en un querystring */
$(".check.green.circle.outline.link.icon").click(function (e) {
    var id_folo = parseInt($(e.currentTarget).closest('td.btnDelete').find("input[name='folo06_id']").val());
    var tableData = $(this).parent().parent().children("td").map(function () {
        return $(this).text();
    }).get();
    $("#model_brand").text($.trim(tableData[1]));
    $("#v_plate").text($.trim(tableData[2]));
    document.getElementById("veh_plate").value = $.trim(tableData[2]);
    document.getElementById("veh_model").value = $.trim(tableData[1]);
    document.getElementById("fecha_folo").value = $.trim(tableData[0]);
    console.log("Usted desea Mostrar el folo:" + id_folo);
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
            document.getElementById("d_name").value = data.folo.driver.first_name + ' ' + data.folo.driver.last_name;
            $("#driver_name_lb1").text(data.folo.driver.first_name + ' ' + data.folo.driver.last_name);
            $("#license_type_lb1").text(data.folo.driver.license_type);
        } else {
            $("#driver_name_lb1").text(data.folo.person_who_drive);
            $("#license_type_lb1").text(data.folo.license_type);
            document.getElementById("d_name").value = data.folo.person_who_drive;
        }
        $("#mission_lb1").text(data.folo.mission);
        if (data.folo.observation) {
            $("#observation_lb1").text(data.folo.observation);
        } else {
            $("#observation_lb1").text("Sin observaciones");
        }
        $("#created_at_lb1").text(data.folo.created_at);
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
    document.getElementById("foloA_id").value = id_folo;
    var tabla = document.getElementById("div_table");
    tabla.style.display = "none";
    var div = document.getElementById("data-hidden");
    div.style.display = "block";
    document.getElementById("cant").disabled = false;
    document.getElementById("mileage_inserted").disabled = false;
    document.getElementById("bAsignar").disabled = false;
    document.getElementById("license_type").disabled = false;

});

$(".ui.left.floated.animated.button").click(function (e) {
    $("#model_brand").text('---');
    $("#v_plate").text('---');
    document.getElementById("veh_plate").value = "";
    document.getElementById("veh_model").value = "";
    document.getElementById("foloA_id").value = "";
    document.getElementById("fecha_folo").value = "";
    var tabla = document.getElementById("div_table");
    tabla.style.display = "block";
    var div = document.getElementById("data-hidden");
    div.style.display = "none";
    document.getElementById("bAsignar").disabled = true;
    document.getElementById("cant").disabled = true;
    document.getElementById("mileage_inserted").disabled = true;
});

function drawTableCells() {
    $('#mytable').html(tableCells);
};

function showLoadingDimmer() {
    // $('.segment').dimmer('set active');
    $('.segment').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "Cargando los datos...",
        closable: false,
    }).dimmer('show');
};
$('#container').css('display', 'block');

$('.ui.form').form({
    //revalidate: true,
    inline: true,
    on: 'blur',
    fields: {
        cant: {
            identifier: 'cant',
            rules: [{
                    type: 'empty',
                    prompt: 'Ingrese una cantidad, sea: 0 o mayores'
                },
                {
                    type: 'integer',
                    prompt: 'Ingrese un número válido de pasajeros'
                },
                {

                }
            ]
        },
        mileage_inserted: {
            identifier: 'mileage_inserted',
            rules: [{
                    type: 'empty',
                    prompt: 'Ingrese una cantidad mayor a 0'
                },
                {
                    type: 'integer',
                    prompt: 'Ingrese un número válido de pasajeros'
                },
                {

                }
            ]
        },
    }
});

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

setInputFilter(document.getElementById("cant"), function (value) {
    return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 4);
});

setInputFilter(document.getElementById("mileage_inserted"), function (value) {
    return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 1000001);
});
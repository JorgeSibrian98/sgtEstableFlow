$('.ui.form') //Validación.
    .form({
        inline: true,
        on: 'blur',
        fields: {
            driver_id: {
                identifier: 'driver_id',
                rules: [{
                    type: 'empty',
                    prompt: 'Seleccione un motorista de la lista'
                }, {
                    type: 'not[--Seleccione un motorista--]',
                    prompt: 'Seleccione un motorista de la lista'
                }]
            },
        }
    });

$(document).ready(function () {
    showLoadingDimmer();
    var id_folo = parseInt(document.getElementById("folo06_id").value);
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
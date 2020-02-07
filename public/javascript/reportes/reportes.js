$(function () {
    fillTable();

    $(".ui.primary.button").click(function () {
        var reporteId = $(this).attr('value');
        console.log(reporteId);
        //alert('You click plate: ' + current_plate + " and the id is: " + index);
        url_list = encodeURI('vehiculos/reporteLoteVehicular');
        console.log(url_list);
        var win = window.open(url_list);
    });
})

//llenar tabla
function fillTable() {
    //Llenar el data table con los datos de todos los folos correspondientes al usuario
    tab = $('#mytable').DataTable({
        "scrollCollapse": false,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        },
        "columns": [{
                "width": "5%"
            },
            {
                "width": "35%"
            },
            {
                "width": "45%"
            },
            {
                "width": "15%"
            }
        ]
    });
}
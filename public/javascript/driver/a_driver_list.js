var filterValue, myTable;
var tableCells = "<tbody> <tr> <td> 1 </td> <td> 2 </td> <td> 3 </td> <td> 4 </td> <td> 5 </td> <td> <i class =\"yellow big edit icon\" value=\"\" >< /i> <i class =\"red big window close icon\" value =\"\" >< /i> </td > </tr> </tbody>"

$(window).on('load', function () {
    console.log('window loaded');
    enviarToast();
});

$(document).ready(function () {
    myTable = $('#mytable').DataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });
    var type = $('input#messagetype').val();
    var info = $('input#messageinfo').val();
    console.log(type);
    console.log(info);
    if (type == 1) {
        if (info == 1) {
            $('body')
                .toast({
                    class: 'success',
                    onclick: 'null',
                    message: `El Requerimiento fue aprobado`
                });
        } else if (info == 0) {
            $('body')
                .toast({
                    class: 'error',
                    message: `Error al modificar la base de Datos.`
                });
        }
    } else if (type == 0) {
        if (info == 1) {
            $('body')
                .toast({
                    class: 'warning',
                    message: `El Requerimiento fue cancelado`
                });
        } else if (info == 0) {
            $('body')
                .toast({
                    class: 'error',
                    message: `Error al modificar la base de Datos.`
                });
        }
    };

    enviarToast();
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


/* Detona el metodo editar en el back mediante el id en un querystring */
$(".pencil.yellow.alternate.link.icon").click(function () {
    var id = $(this).attr("value");
    var url_list = encodeURI('motoristas/gestionar?' + "driver_id=" + id);
    console.log(url_list);
    location.href = url_list;
});


/* Detona el metodo eliminar en el back mediante el id en un querystring */
$(".trash.red.alternate.outline.link.icon").click(function () {
    var id = $(this).attr("value");
    $('.ui.modal')
        .modal({
            closable: true,
            onApprove: function () {
                url_list = encodeURI('motoristas/eliminar?' + "motorista_id=" + id);
                console.log(url_list);
                location.href = url_list;
            }
        })
        .modal('show');
});


function drawTableCells() {
    $('#mytable').html(tableCells);
}

$('#container').css('display', 'block');
/*
Animaciones del Front del formulario de ingresar Procu 
06102019_DD
*/

var filterValue, myTable;
var tableCells = "<tbody> <tr> <td> 1 </td> <td> <i class =\"yellow big edit icon\" value=\"\" >< /i> <i class =\"red big window close icon\" value =\"\" >< /i> </td > </tr> </tbody>"

$(function () {

    $('#mytable').DataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });

    /* Detona el metodo editar en el back mediante el id en un querystring */
    $(".pencil.yellow.alternate.link.icon").click(function () {
        var id = $(this).attr("value");
        var url_list = encodeURI('misiones/gestionar?' + "mis_id=" + id);
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
                    url_list = encodeURI('misiones/eliminar?' + "mis_id=" + id);
                    console.log(url_list);
                    location.href = url_list;
                }
            })
            .modal('show');
    });

    $('.ui.form')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                name: {
                    identifier: 'name',
                    rules: [{
                        type: 'empty',
                        prompt: 'Ingrese el nombre de la procuraduría'
                    }, {
                        type: 'maxLength[100]',
                        prompt: 'El nombre debe ser menor a 40 caracteres'
                    }]
                }
            }
        });

});
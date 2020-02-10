/*
Animaciones del Front del formulario de ingresar Procu 
06102019_DD
*/
var title, message, clss, query1;
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
    title = getParameterByName('title');
    message = getParameterByName('message');
    clss = getParameterByName('class');
    if (title && message && clss) {
        AddToast(title, clss, message);
    }

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
        $('#deleteModal')
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

    $(".check.green.circle.outline.link.icon").click(function () {
        var id = $(this).attr("value");
        $('#activeModal')
            .modal({
                closable: true,
                onApprove: function () {
                    url_list = encodeURI('misiones/activar?' + "mis_id=" + id);
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

function AddToast(_title, _class, _message) {
    $('body')
        .toast({
            title: _title,
            showIcon: true,
            class: _class,
            position: 'top right',
            displayTime: 8000,
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
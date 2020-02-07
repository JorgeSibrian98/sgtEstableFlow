var title, message, clss, query1;
var current_plate;

$(function () {

    //Da formato a la tabla de vehiculos
    $('#mytable').DataTable({
        "scrollCollapse": true,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });

    //Verifica si el registro fue guardado con exito
    title = getParameterByName('title');
    message = getParameterByName('message');
    clss = getParameterByName('class');

    console.log(title);
    console.log(message);
    console.log(clss);

    if (title && message && clss) {
        AddToast(title, clss, message);
    }

    $(".pencil.yellow.alternate.link.icon").click(function () {
        current_plate = $(this).attr('value');
        console.log(current_plate);
        //alert('You click plate: ' + current_plate + " and the id is: " + index);
        url_list = encodeURI('vehiculos/gestionar?' + "matricula=" + current_plate);
        console.log(url_list);
        location.href = url_list;
    });

    $(".large.file.alternate.link.icon").click(function () {
        codigoActivoFijo = $(this).attr('value');
        console.log(codigoActivoFijo);
        //alert('You click plate: ' + current_plate + " and the id is: " + index);
        url_list = encodeURI('vehiculos/reporteIndividual?' + "codigo=" + codigoActivoFijo);
        console.log(url_list);
        var win = window.open(url_list);
        //location.href = url_list;
    });

});

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
function AddToast(_title, _class, _message) {
    $('body')
        .toast({
            title: _title,
            showIcon: true,
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

















/*Funciones recicladas

//Obtiene los parametros del url dado
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

*/
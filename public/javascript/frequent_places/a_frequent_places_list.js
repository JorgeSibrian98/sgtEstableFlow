var filterValue;
var title, message, clss, query1;

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
    title = getParameterByName('title');
    message = getParameterByName('message');
    clss = getParameterByName('class');

    if (title && message && clss) {
        AddToast(title, clss, message);
    }
});




/* Detona el metodo editar en el back mediante el id en un querystring */
$(".pencil.yellow.alternate.link.icon").click(function () {
    var id = $(this).attr("value");
    var url_list = encodeURI('lugares_frecuentes/editar?' + "fplace_id=" + id);
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
                url_list = encodeURI('lugares_frecuentes/eliminar?' + "fplace_id=" + id);
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
                url_list = encodeURI('lugares_frecuentes/activar?' + "fplace_id=" + id);
                console.log(url_list);
                location.href = url_list;
            }
        })
        .modal('show');
});

/* Habilita el filtro de lugares frecuentes por ruta
Y describe el comportamiento cuando el control cambia */
$('#div_ruta')
    .dropdown({
        ignoreDiacritics: true,
        sortSelect: true,
        fullTextSearch: 'exact',
        onChange: function (value, text, selectedItem) {
            console.log(selectedItem);
            filterValue = selectedItem.attr("value");
            console.log(filterValue);
            if (filterValue) {
                showLoadingDimmer();
                fillTable();
            } else {
                console.log("Valor de filtrado nulo");
            }
        }
    });

//Llena la tabla con los lugares frecuentes filtrados
function fillTable() {
    var url_list = encodeURI('/lugares_frecuentes?' + "filter=" + filterValue);
    $('#fTable').load(url_list, filterValue, function () {
        $('#mytable').DataTable({
            "scrollY": "500px",
            "scrollCollapse": true,
        });
        $('#fTable').dimmer('hide');

        //Deben cargarse nuevamente los eventos de los iconos
        $(".pencil.yellow.alternate.link.icon").click(function () {
            var id = $(this).attr("value");
            var url_list = encodeURI('lugares_frecuentes/editar?' + "fplace_id=" + id);
            console.log(url_list);
            location.href = url_list;
        });

        $(".trash.red.alternate.outline.link.icon").click(function () {
            var id = $(this).attr("value");
            $('#deleteModal')
                .modal({
                    closable: true,
                    onApprove: function () {
                        url_list = encodeURI('lugares_frecuentes/eliminar?' + "fplace_id=" + id);
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
                        url_list = encodeURI('lugares_frecuentes/activar?' + "fplace_id=" + id);
                        console.log(url_list);
                        location.href = url_list;
                    }
                })
                .modal('show');
        });
    });
}

//Muestra la aminacion de "cargando mientras se dibuja la tabla con los datos"
function showLoadingDimmer() {
    $('#fTable').dimmer({
        displayLoader: true,
        loaderVariation: 'green double',
        loaderText: "Cargando los datos...",
        closable: false,
    }).dimmer('show');
}

$('#container').css('display', 'block');

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
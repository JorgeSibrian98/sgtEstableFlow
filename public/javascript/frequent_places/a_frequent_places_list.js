var filterValue;

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
    var url_list = encodeURI('lugares_frecuentes/editar?' + "fplace_id=" + id);
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
                url_list = encodeURI('lugares_frecuentes/eliminar?' + "fplace_id=" + id);
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
            $('.ui.modal')
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
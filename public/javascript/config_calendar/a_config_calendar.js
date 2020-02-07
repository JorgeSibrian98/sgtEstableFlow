$(function () {
    /*Bind de los eventos para poder abir el modal correspondiente*/
    $('#modalCancelar').modal('attach events', '.btnCancelar', 'show');

    $('#btnSiguiente').addClass('disabled'); /* Deshabilita el boton siguiente*/

    $('.switch').click(function () {
        /* Funcion que valida el boton siguiente, sin no hay ningun switch seleccioando se deshabilita el boton */

        var indice = 0; /* variable que almacenara la cantidad de switch seleccionados*/

        if ($("input[type='checkbox']").is(':checked') == true) {

            indice = indice + 1;
        } else {
            indice = indice + 0;
        }

        if (indice > 0) {
            $('#btnSiguiente').removeClass('disabled');
        } else
            $('#btnSiguiente').addClass('disabled');
    });
});

$('#routes').click(function () {
    var config = 1;
    showLoadingDimmer();
    next_page(config);
})

$('#drivers_routes').click(function () {
    var config = 2;
    showLoadingDimmer();
    next_page(config);
})

$('#calendar').click(function () {
    var config = 3;
    showLoadingDimmer();
    next_page(config);
})

function next_page(page) {
    var url_list = encodeURI('/configuracion_calendario?' + 'config=' + page);
    console.log(url_list);
    $('#calendar_pages').load(url_list, page, function () {
        $('#calendar_pages').dimmer('hide');
        switch (page) {
            case 1:
                $('#routes').addClass("active");
                $('#drivers_routes').removeClass("active");
                break;
            case 2:
                $('#drivers_routes').addClass("active");
                $('#routes').removeClass("active");
                break;
        }

        /* columnas master*/
        $('.col-master').click(function () {
            var idx = $(this).parent().parent().index();
            console.log(idx);
            $('table td:nth-child(' + (idx + 1) + ') input.child').prop('checked', this.checked)
        })
        /* filas master*/
        $('.row-master').click(function () {
            $(this).closest('tr').find('input.child').prop('checked', this.checked)
        });

        $('.child').change(function () {
            /* filas hijas */
            var $tr = $(this).closest('tr')
            $tr.find('input.row-master').prop('checked', $tr.find('.child').not(':checked').length == 0);
            /* columnas hijas*/
            var idx = $(this).parent().parent().index(),
                $tds = $('table td:nth-child(' + (idx + 1) + ')');
            $tds.find('input.col-master').prop('checked', $tds.find('input.child').not(':checked').length == 0)
        })
    });
}

//Muestra la aminacion de "cargando mientras se dibuja la tabla con los datos"
function showLoadingDimmer() {
    $('#calendar_pages').dimmer({
        displayLoader: true,
        loaderVariation: 'green double',
        loaderText: "Cargando los datos...",
        closable: false,
    }).dimmer('show');
}

/* Semi */

/*Bind de los eventos para poder abir el modal correspondiente*/
$('#modalCancelar').modal('attach events', '.btnCancelar', 'show');
$('#modalContinuar').modal('attach events', '.btnContinuar', 'show');
/* fin */

/*para abrir el toast con el evento click*/
$('#btnInfoAceptar').addEventListener('click', function () {
    $('body')
        .toast({
            class: 'success',
            displayTime: 1000,
            title: 'Información',
            message: 'Realizando Asignación',
            showProgress: 'bottom'
        });
})

/* checkear el padre a partir de sus hijos y viceversa */

/* columnas master*/
$('.col-master').click(function () {
    var idx = $(this).parent().parent().index();
    console.log(idx);
    $('table td:nth-child(' + (idx + 1) + ') input.child').prop('checked', this.checked)
})
/* filas master*/
$('.row-master').click(function () {
    $(this).closest('tr').find('input.child').prop('checked', this.checked)
});



$('.child').change(function () {
    /* filas hijas */
    var $tr = $(this).closest('tr')
    $tr.find('input.row-master').prop('checked', $tr.find('.child').not(':checked').length == 0);
    /* columnas hijas*/
    var idx = $(this).parent().parent().index(),
        $tds = $('table td:nth-child(' + (idx + 1) + ')');
    $tds.find('input.col-master').prop('checked', $tds.find('input.child').not(':checked').length == 0)
})
/* fin */


/* permitir habilitar el boton continuar si hay checkbox seleccionados */
$('#btnContinuar').prop('disabled', true);
$('.chk').click(function () {
    if ($("input[type='checkbox']").is(':checked') == true) {
        $('#btnContinuar').prop('disabled', false);
    } else {
        $('#btnContinuar').prop('disabled', true);
    }
});
/* fin */
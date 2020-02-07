/*Bind de los eventos para poder abir el modal correspondiente*/
$('#modalCancelar').modal('attach events', '.btnCancelar', 'show');
$('#modalContinuar').modal('attach events', '.btnContinuar', 'show');
/* fin */

/*para abrir el toast con el evento click*/
document.getElementById("btnInfoAceptar").addEventListener('click', function () {
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
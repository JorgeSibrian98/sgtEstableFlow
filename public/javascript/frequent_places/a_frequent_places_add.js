$(function () {
    $('#frm-prueba').form({
        inline: true,
        on: 'change',
        fields: {
            name: {
                identifier: 'name',
                rules: [{
                    type: 'empty',
                    prompt: 'Ingrese un nombre para la Dirección'
                }, {
                    type: 'maxLength[150]',
                    prompt: 'Longitud Maxima de nombre 150 caracteres'
                }, {
                    type: 'Alphanumeric',
                    prompt: 'El campo nombre solo acepta caracteres alfanumericos.'
                }]
            },
            detail: {
                identifier: 'detail',
                rules: [{
                    type: 'maxLength[200]',
                    prompt: 'Longitud Maxima del detalle 200 caracteres'
                }]
            },
            departamento: {
                identifier: 'departamento',
                rules: [{
                    type: 'empty',
                    prompt: 'Seleccione un Departamento'
                }]
            },
            municipio: {
                identifier: 'municipio',
                rules: [{
                    type: 'empty',
                    prompt: 'Seleccione un Municipio'
                }]
            },
        }
    })
});

$(document).ready(function () {
    $('#message').fadeIn('slow', function () {
        $('#message').delay(5000).fadeOut();
    });
});
$(".close.icon").click(function () {
    $(this).parent().hide();
});
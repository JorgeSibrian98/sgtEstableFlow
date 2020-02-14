var NombreInicial;
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
                    type: 'maxLength[100]',
                    prompt: 'Longitud Maxima de nombre 100 caracteres'
                }, {
                    type: 'Alphanumeric',
                    prompt: 'El campo nombre solo acepta caracteres alfanumericos.'
                }]
            },
            detail: {
                identifier: 'detail',
                rules: [{
                    type: 'maxLength[150]',
                    prompt: 'Longitud Maxima del detalle 150 caracteres'
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
            ruta: {
                identifier: 'ruta',
                rules: [{
                    type: 'empty',
                    prompt: 'Seleccione una Ruta'
                }]
            },
        }
    })
});

$(document).ready(function () {
    $('#message').fadeIn('slow', function () {
        $('#message').delay(5000).fadeOut();
    });
    let Edicion = $('#fplace_id').val();
    console.log(Edicion);
    if (Edicion == '') {
        NombreInicial = 'Null'
        console.log(NombreInicial);
    } else {
        NombreInicial = $('#name').val();
        console.log(NombreInicial);
    }
});
$(".close.icon").click(function () {
    $(this).parent().hide();
});

$('#name').on('focus', function () {
    $('#guardar').prop('disabled', true);
});

//Si hace clic en el campo pero no lo modifica, se habilita el botón (caso editar).
$('#name').on('blur', function () {
    $('#guardar').prop('disabled', false);
});


$('#name').on('change', function () {
    var name = $('#name').val(); //Se obtiene el valor del campo 'name'.
    //Petición ajax post.
    if (NombreInicial == name) {
        $('body')
            .toast({
                title: '¡Éxito!',
                position: 'top right',
                class: 'success',
                displayTime: 3000,
                showProgress: 'top',
                classProgress: 'red',
                progressUp: false,
                closeIcon: true,
                message: 'Nombre del Lugar sin Cambios.',
                pauseOnHover: false,
                transition: {
                    showMethod: 'zoom',
                    showDuration: 100,
                    hideMethod: 'fade',
                    hideDuration: 500
                }
            });
    } else {
        $.post('/lugares_frecuentes/LugarExists', {
                name
            },
            function (exists) {
                console.log(exists);
                /* Si se determina que el nombre ya existe, deshabilita el botón de guardado y
                muestra mensaje de error. */
                if (exists == 'yes') {
                    $('#guardar').prop('disabled', true);
                    $('body')
                        .toast({
                            title: '¡Error!',
                            position: 'top right',
                            class: 'error',
                            displayTime: 3000,
                            showProgress: 'top',
                            classProgress: 'red',
                            progressUp: false,
                            closeIcon: true,
                            message: 'El Lugar Frecuente ya existe en la base de datos. Ingrese otro nombre.',
                            pauseOnHover: false,
                            transition: {
                                showMethod: 'zoom',
                                showDuration: 100,
                                hideMethod: 'fade',
                                hideDuration: 500
                            }
                        });
                } else {
                    //De no existir, procede con normalidad y muestra mensaje de éxito.
                    $('body')
                        .toast({
                            title: '¡Éxito!',
                            position: 'top right',
                            class: 'success',
                            displayTime: 3000,
                            showProgress: 'top',
                            classProgress: 'red',
                            progressUp: false,
                            closeIcon: true,
                            message: 'El nombre del Lugar es válido.',
                            pauseOnHover: false,
                            transition: {
                                showMethod: 'zoom',
                                showDuration: 100,
                                hideMethod: 'fade',
                                hideDuration: 500
                            }
                        });
                    $('#guardar').prop('disabled', false);
                };
            });
    }

});
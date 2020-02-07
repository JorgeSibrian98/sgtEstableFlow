//Habilita funcionamiento de los checkbox.
$('.ui.checkbox').checkbox('enable');

//El botón se habilitará hasta verificar que el nombre de la procuraduría que está creando NO existe en la BD.
$('#name').on('focus', function () {
    $('#guardar').prop('disabled', true);
});

//Si hace clic en el campo pero no lo modifica, se habilita el botón (caso editar).
$('#name').on('blur', function () {
    $('#guardar').prop('disabled', false);
});

//Función que valida si la procuraduría a ingresar ya existe previamente en la tabla.
$('#name').on('change', function () {
    var name = $('#name').val(); //Se obtiene el valor del campo 'name'.
    //Petición ajax post.
    $.post('/instituciones/procuNameExists', {
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
                        message: 'El nombre de la procuraduría ya existe en la base de datos. Ingrese otro nombre.',
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
                        message: 'El nombre de la procuraduría es válido.',
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
});

//Validación de formulario.
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
            },
            detail: {
                identifier: 'detail',
                rules: [{
                    type: 'empty',
                    prompt: 'Ingrese el detalle de la dirección'
                }]
            },
            departamento: {
                identifier: 'departamento',
                rules: [{
                    type: 'empty',
                    prompt: 'Seleccione un departamento de la lista'
                }, {
                    type: 'not[--Seleccione un departamento--]',
                    prompt: 'Seleccione un departamento de la lista'
                }]
            },
            municipio: {
                identifier: 'municipio',
                optional: 'true',
                depends: 'departamento',
                rules: [{
                    type: 'empty',
                    prompt: 'Seleccione un municipio de la lista'
                }, {
                    type: 'not[--Seleccione un municipio--]',
                    prompt: 'Seleccione un municipio de la lista'
                }]
            }
        }
    });

//Función que determina si se va a guardar o a editar la procuraduría.
$('#guardar').on('click', function () {
    event.preventDefault();
    if ($('#procu_id').val()) {
        updateProcu();
    } else {
        createProcu();
    };
});

//Función para crear la ruta.
function createProcu() {
    //Se definen y se obtienen los valores de las variables.
    var name = $('#name').val();
    var enabled;
    var detail = $('#detail').val();
    var departamento = $('#departamento').val();
    var municipio = $('#municipio').val();

    //Determina si la ruta está habilitada o no.
    if($('#enabled').is(':checked')){
        enabled = true;
    } else {
        enabled = false;
    };
    //Petición ajax post.
    $.post('/instituciones/gestionar', {
        name,
        enabled,
        detail,
        departamento,
        municipio
    }, function (resp) {
        //Si la creación tuvo éxito, redirige al listado de procuradurías.
        if (resp.redirect) {
            window.location.href = resp.redirect;
        } else {
            //Caso contrario muestra un mensaje de error.
            $('body')
                .toast({
                    title: '¡Error!',
                    showIcon: true,
                    closeIcon: true,
                    class: 'error',
                    position: 'top right',
                    displayTime: 10000,
                    pauseOnHover: false,
                    message: 'No se pudo guardar la procuraduría. Si el problema persiste, contacte con el administrador.',
                    showProgress: 'top',
                    progressUp: false,
                    transition: {
                        showMethod: 'zoom',
                        showDuration: 100,
                        hideMethod: 'fade',
                        hideDuration: 500
                    }
                });
        };
    });
};

//Función para editar/actualizar la procuraduría.
function updateProcu() {
    //Se definen y se obtienen los valores de las variables.
    var name = $('#name').val();
    var enabled;
    var detail = $('#detail').val();
    var departamento = $('#departamento').val();
    var municipio = $('#municipio').val();
    var procu_id = $('#procu_id').val();

    //Determina si la ruta está habilitada o no.
    if($('#enabled').is(':checked')){
        enabled = true;
    } else {
        enabled = false;
    };
    //Petición ajax post.
    $.post('/instituciones/gestionar', {
        name,
        enabled,
        detail,
        departamento,
        municipio,
        procu_id
    }, function (resp) {
        //Si la edición tuvo éxito, redirige al listado de rutas.
        if (resp.redirect) {
            window.location.href = resp.redirect;
        } else {
            //Caso contrario muestra un mensaje de error.
            $('body')
                .toast({
                    title: '¡Error!',
                    showIcon: true,
                    closeIcon: true,
                    class: 'error',
                    position: 'top right',
                    displayTime: 10000,
                    pauseOnHover: false,
                    message: 'No se pudo guardar la procuraduría. Si el problema persiste, contacte con el administrador.',
                    showProgress: 'top',
                    progressUp: false,
                    transition: {
                        showMethod: 'zoom',
                        showDuration: 100,
                        hideMethod: 'fade',
                        hideDuration: 500
                    }
                });
        };
    });
};
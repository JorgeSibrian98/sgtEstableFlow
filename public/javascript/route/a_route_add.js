//Habilita funcionamiento de los checkbox.
$('.ui.checkbox').checkbox('enable');

//El botón se habilitará hasta verificar que el nombre de la ruta que está creando NO existe en la BD.
$('#name').on('focus', function () {
    $('#guardar').prop('disabled', true);
});

//Si hace clic en el campo pero no lo modifica, se habilita el botón (caso editar).
$('#name').on('blur', function () {
    $('#guardar').prop('disabled', false);
});

//Función que valida si la ruta a ingresar ya existe previamente en la tabla.
$('#name').on('change', function () {
    var name = $('#name').val(); //Se obtiene el valor del campo 'name'.
    //Petición ajax post.
    $.post('/rutas/routeNameExists', {
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
                        message: 'El nombre de la ruta ya existe en la base de datos. Ingrese otro nombre.',
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
                        message: 'El nombre de la ruta es válido.',
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

//Validación del formulario
$('.ui.form')
    .form({
        inline: true,
        on: 'blur',
        fields: {
            name: {
                identifier: 'name',
                rules: [{
                    type: 'empty',
                    prompt: 'Ingrese el nombre de la ruta estándar.'
                }, {
                    type: 'maxLength[40]',
                    prompt: 'El nombre debe ser menor a 40 caracteres'
                }]
            },
            monday_frequency: {
                identifier: 'monday_frequency',
                depends: 'monday',
                rules: [{
                    type: 'integer[1..40]',
                    prompt: 'Ingrese un valor entre 1 y 40.'
                }]
            },
            tuesday_frequency: {
                identifier: 'tuesday_frequency',
                depends: 'tuesday',
                rules: [{
                    type: 'integer[1..40]',
                    prompt: 'Ingrese un valor entre 1 y 40.'
                }]
            },
            wednesday_frequency: {
                identifier: 'wednesday_frequency',
                depends: 'wednesday',
                rules: [{
                    type: 'integer[1..40]',
                    prompt: 'Ingrese un valor entre 1 y 40.'
                }]
            },
            thursday_frequency: {
                identifier: 'thursday_frequency',
                depends: 'thursday',
                rules: [{
                    type: 'integer[1..40]',
                    prompt: 'Ingrese un valor entre 1 y 40.'
                }]
            },
            friday_frequency: {
                identifier: 'friday_frequency',
                depends: 'friday',
                rules: [{
                    type: 'integer[1..40]',
                    prompt: 'Ingrese un valor entre 1 y 40.'
                }]
            },
            saturday_frequency: {
                identifier: 'saturday_frequency',
                depends: 'saturday',
                rules: [{
                    type: 'integer[1..40]',
                    prompt: 'Ingrese un valor entre 1 y 40.'
                }]
            },
            sunday_frequency: {
                identifier: 'sunday_frequency',
                depends: 'sunday',
                rules: [{
                    type: 'integer[1..40]',
                    prompt: 'Ingrese un valor entre 1 y 40.'
                }]
            },
        }
    });

//Muestra un mensaje de advertencia sobre las validaciones de la cantidad de motoristas por día.
$('body')
    .toast({
        title: '¡Atención!',
        position: 'top right',
        class: 'warning',
        showProgress: 'top',
        classProgress: 'red',
        progressUp: false,
        closeIcon: true,
        displayTime: 10000,
        message: 'La cantidad de motoristas solo se validará si su respectivo día está seleccionado.' +
            ' Caso contrario se guardará automáticamente con un valor de 0.',
        pauseOnHover: false,
        transition: {
            showMethod: 'zoom',
            showDuration: 100,
            hideMethod: 'fade',
            hideDuration: 500
        }
    });

//Función que determina si se va a guardar o a editar la ruta.
$('#guardar').on('click', function () {
    event.preventDefault();
    if ($('#route_id').val()) {
        updateRoute();
    } else {
        createRoute();
    };
});

//Función para crear la ruta.
function createRoute() {
    //Se definen y se obtienen los valores de las variables.
    var name = $('#name').val();
    var monday;
    var monday_frequency = $('#monday_frequency').val();
    var tuesday;
    var tuesday_frequency = $('#tuesday_frequency').val();
    var wednesday;
    var wednesday_frequency = $('#wednesday_frequency').val();
    var thursday;
    var thursday_frequency = $('#thursday_frequency').val();
    var friday;
    var friday_frequency = $('#friday_frequency').val();
    var saturday;
    var saturday_frequency = $('#saturday_frequency').val();
    var sunday;
    var sunday_frequency = $('#sunday_frequency').val();
    var enabled

    /* Pregunta si el checkbox de cada día está marcado. De estarlo, la variable toma el valor de true;
    caso contrario, toma el valor de false. */
    //Un 'true' indica que ese día sí se brindará servicio.
    //Un 'false' indica que ese día no se brindará servicio a la ruta.
    //En este caso la cantidad de motoristas se cambia a 0.
    if($('#monday').is(':checked')){
        monday = true;
    } else {
        monday = false;
        monday_frequency = 0;
    };

    if($('#tuesday').is(':checked')){
        tuesday = true;
    } else {
        tuesday = false;
        tuesday_frequency = 0;
    };

    if($('#wednesday').is(':checked')){
        wednesday = true;
    } else {
        wednesday = false;
        wednesday_frequency = 0;
    };

    if($('#thursday').is(':checked')){
        thursday = true;
    } else {
        thursday = false;
        thursday_frequency = 0;
    };

    if($('#friday').is(':checked')){
        friday = true;
    } else {
        friday = false;
        friday_frequency = 0;
    };

    if($('#saturday').is(':checked')){
        saturday = true;
    } else {
        saturday = false;
        saturday_frequency = 0;
    };

    if($('#sunday').is(':checked')){
        sunday = true;
    } else {
        sunday = false;
        sunday_frequency = 0;
    };
    //Determina si la ruta está habilitada o no.
    if($('#enabled').is(':checked')){
        enabled = true;
    } else {
        enabled = false;
    };
    //Petición ajax post.
    $.post('/rutas/gestionar', {
        name,
        monday, monday_frequency,
        tuesday, tuesday_frequency,
        wednesday, wednesday_frequency,
        thursday, thursday_frequency,
        friday, friday_frequency,
        saturday, saturday_frequency,
        sunday, sunday_frequency,
        enabled
    }, function (resp) {
        //Si la creación tuvo éxito, redirige al listado de rutas.
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
                    message: 'No se pudo guardar la ruta. Si el problema persiste, contacte con el administrador.',
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

//Función para editar/actualizar la ruta.
function updateRoute() {
    //Se definen y se obtienen los valores de las variables.
    var name = $('#name').val();
    var monday;
    var monday_frequency = $('#monday_frequency').val();
    var tuesday;
    var tuesday_frequency = $('#tuesday_frequency').val();
    var wednesday;
    var wednesday_frequency = $('#wednesday_frequency').val();
    var thursday;
    var thursday_frequency = $('#thursday_frequency').val();
    var friday;
    var friday_frequency = $('#friday_frequency').val();
    var saturday;
    var saturday_frequency = $('#saturday_frequency').val();
    var sunday;
    var sunday_frequency = $('#sunday_frequency').val();
    var enabled;
    var route_id = $('#route_id').val();
    var route_conditions_id = $('#route_conditions_id').val();

    /* Pregunta si el checkbox de cada día está marcado. De estarlo, la variable toma el valor de true;
    caso contrario, toma el valor de false. */
    //Un 'true' indica que ese día sí se brindará servicio.
    //Un 'false' indica que ese día no se brindará servicio a la ruta.
    //En este caso la cantidad de motoristas se cambia a 0.
    if($('#monday').is(':checked')){
        monday = true;
    } else {
        monday = false;
        monday_frequency = 0;
    };

    if($('#tuesday').is(':checked')){
        tuesday = true;
    } else {
        tuesday = false;
        tuesday_frequency = 0;
    };

    if($('#wednesday').is(':checked')){
        wednesday = true;
    } else {
        wednesday = false;
        wednesday_frequency = 0;
    };

    if($('#thursday').is(':checked')){
        thursday = true;
    } else {
        thursday = false;
        thursday_frequency = 0;
    };

    if($('#friday').is(':checked')){
        friday = true;
    } else {
        friday = false;
        friday_frequency = 0;
    };

    if($('#saturday').is(':checked')){
        saturday = true;
    } else {
        saturday = false;
        saturday_frequency = 0;
    };

    if($('#sunday').is(':checked')){
        sunday = true;
    } else {
        sunday = false;
        sunday_frequency = 0;
    };
    //Determina si la ruta está habilitada o no.
    if($('#enabled').is(':checked')){
        enabled = true;
    } else {
        enabled = false;
    };
    //Petición ajax post.
    $.post('/rutas/gestionar', {
        name,
        monday, monday_frequency,
        tuesday, tuesday_frequency,
        wednesday, wednesday_frequency,
        thursday, thursday_frequency,
        friday, friday_frequency,
        saturday, saturday_frequency,
        sunday, sunday_frequency,
        enabled,
        route_id, route_conditions_id
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
                    message: 'No se pudo actualizar la ruta. Si el problema persiste, contacte al adminsitrador.',
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
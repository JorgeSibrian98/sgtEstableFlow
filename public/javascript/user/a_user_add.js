//Defines de Fade time (In or Out)
var time_out = 500;

$(function () {
    $('.ui.form')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                first_name: {
                    identifier: 'first_name',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese el nombre del empleado'
                    }]
                },
                last_name: {
                    identifier: 'last_name',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese los apellidos'
                    }]
                },
                email: {
                    identifier: 'email',
                    rules: [{
                        type: 'empty',
                        prompt: 'Ingrese el correo electrónico del empleado'
                    }, {
                        type: 'email',
                        prompt: 'Ingrese un Email valido'
                    }]
                },
                password: {
                    identifier: 'password',
                    rules: [{
                            type: 'empty',
                            prompt: 'Ingrese la contraseña de usuario'
                        },
                        {
                            type: 'minLength[8]',
                            prompt: 'Su contraseña debe tener más de 8 caracteres'
                        }, {
                            type: 'maxLength[25]',
                            prompt: 'Su contraseña debe tener no más a 25 caracteres'
                        }
                    ]
                }
            }
        });

    $('.ui.toggle.checkbox').checkbox('set enabled');

    createTempTags();

});

/*Crea las etiquetas temporales en caso sea una edicion con roles asignados */
function createTempTags() {
    var roles = $('#assinged_roles').val();
    if (roles) {
        //Coloca los roles ya asignados. Valido cuando sea una actualizacion
        $('.ui.fluid.clearable.multiple.selection.dropdown')
            .dropdown('restore defaults');
    }
}


/*Nuestra el selector correspondiente en base al valor del checkbox 11012020_DD*/
$('#is_unit_boss').change(function () {
    var url = '/usuarios/gestionar?';
    var uri;
    if ($(this).checkbox('is checked') === true) {
        //Para saber si el campo ya fue añadadido
        if ($('#boss_field').hasClass('field')) {
            $('#boss_field').fadeOut(time_out, function () {
                $(this).remove();
                getSelector(1)
            });
        } else {
            getSelector(1);
        }
    } else {
        if ($('#unit_field').hasClass('field')) {
            $('#unit_field').fadeOut(time_out, function () {
                $(this).remove();
                getSelector(2);
            });
        } else {
            getSelector(2);
        }


    }
});

/*Funcion para obtener el selector de unidades 11012020_DD*/
function getSelector(selector) {
    var url = '/usuarios/gestionar?';
    var uri = encodeURI(url + "selector=" + selector);
    switch (selector) {
        case 1: //Selector de unidad
            $('#unit').load(uri, 1, function () {

            }).hide();
            $('#unit').fadeIn(time_out * 5);
            break;
        case 2: //Selector de jefes
            $('#boss').load(uri, 2, function () {
                var user_id = $('#user_id').val();
                var user_email = $('#email').val();
                if (user_id && user_email) {
                    console.log(user_id + user_email);
                    var contains = "option[email*='%1']";
                    contains = contains.replace("%1", user_email);
                    $(contains).remove();
                }
            }).hide();
            $('#boss').fadeIn(time_out * 5);
            break;
    }
}


$('#pw_icon').click(function () {
    if (!$(this).hasClass('slash')) {
        $('#password').attr('type', 'password');
        $(this).addClass('slash');
    } else {
        $('#password').attr('type', 'text');
        $(this).removeClass('slash');
    }
})

/*
Detona el proceso de insercion del vehiculo
28092019_DD 
*/
$("#add_btn").click(function () {
    insert_user();
});

/*
Metodo Ajax de creacion/actulizacion de usuario
04012019_DD
*/
function insert_user() {
    $('.ui.toast').remove();
    $('.ui.form').form('validate form');
    if ($('.ui.form').form('is valid')) {
        $.ajax({
            url: "/usuarios/gestionar",
            async: true,
            type: 'POST',
            dataType: 'json',
            data: $('.ui.form').serializeArray(),
            success: (data) => {
                if (data.redirect) {
                    window.location.href = data.redirect;
                } else {
                    if (data.errors) {
                        for (var error of data.errors) {
                            AddToast(data.title, 'error', error.msg);
                        }
                    } else {
                        AddToast(data.title, 'error', data.message);
                    }
                }
            }
        });
    }
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
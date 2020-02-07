$(function () {
    //Para mostrar mensaje cuando la sesión haya caducado
    var session_error = getParameterByName('session_error');
    if (session_error) {
        $('#session_error_message').removeClass('hidden').addClass('visible')
    }
    var bye = getParameterByName('bye');
    if (bye) {
        $('#bye_message').removeClass('hidden').addClass('visible')
    }
    //Validaciones del formulario
    $(".ui.form")
        .form({
            fields: {
                cod_usuario: {
                    identifier: "cod_usuario",
                    rules: [{
                        type: "empty",
                        prompt: "Por favor introduzca su código de usuario"
                    }]
                },
                password: {
                    identifier: "password",
                    rules: [{
                            type: "empty",
                            prompt: "Por favor introduzca su contraseña"
                        }
                        /*DEFINIR LA LONGITUD DE LA CONTRASEÑA ,
                                                {
                                                    type: "length[3]",
                                                    prompt: "La contraseña deve tener al menos 3 caracteres"
                                                } */
                    ]
                }
            }
        });
});


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
$('.message .close')
    .on('click', function () {
        $(this)
            .closest('.message')
            .transition('fade');
    });
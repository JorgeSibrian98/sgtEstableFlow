/*
Animaciones del Front del formulario de ingresar vehiculo 
20092019_DD
*/

//Rutas para ajax
var url_request_plate_exist;
var url_post_create = '/vehiculos/gestionar';
var url_get_lis = 'vehiculos';
var data_type;


/*
Validacion del formulario del lado del cliente 
20092019_DD
*/
$(function () {
    $('.ui.form')
        .form({
            inline: true,
            on: 'blur',
            fields: {
                code: {
                    identifier: 'code',
                    rules: [{
                            type: 'empty',
                            prompt: 'Por favor ingrese el número del activo fijo'
                        },
                        {
                            type: 'minLength[21]',
                            prompt: 'El numero del activo fijo debe tener exactamente 21 caracteres'
                        },
                        {
                            type: 'maxLength[21]',
                            prompt: 'El numero del activo fijo debe tener exactamente 21 caracteres'
                        },
                        {
                            type: 'regExp',
                            value: /(\d{4})-(\d{5})-(\d{3})-(\d{1})-(\d{4})/i,
                            prompt: 'El número de activo fijo solo puede contener valores numéricos y guiones. El formato debe ser: "1800-61101-101-1-0004"'
                        }
                    ]
                },
                plate: {
                    identifier: 'plate',
                    rules: [{
                            type: 'empty',
                            prompt: 'Por favor ingrese el número de placa'
                        },
                        {
                            type: 'minLength[4]',
                            prompt: 'El numero de placa puede poseer menos de 4 caracteres'
                        },
                        {
                            type: 'maxLength[8]',
                            prompt: 'El numero de placa no puede poseer más de 8 caracteres'
                        },
                        {
                            type: 'regExp',
                            value: /^(N|M|P|C)(\d{3,6}$)/i,
                            prompt: 'El número de placa debe tener este este formato: (N|M|P|C)###(###)'
                        }
                    ]
                },
                chassis: {
                    identifier: 'chassis',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese información del chasis'
                    }, {
                        type: 'minLength[17]',
                        prompt: 'El valor debe contener mínimo 17 caracteres'
                    }, {
                        type: 'maxLength[20]',
                        prompt: 'El valor debe contener máximo 20 caracteres'
                    }, {
                        type: 'regExp',
                        value: /([A-Za-z0-9]{17,20})/i,
                        prompt: 'Ingrese unicamente valores alfanuméricos al número del chasis'
                    }]
                },
                engine: {
                    identifier: 'engine',
                    rules: [{
                            type: 'empty',
                            prompt: 'Por favor ingrese número del motor'
                        },
                        {
                            type: 'regExp',
                            value: /([A-Za-z0-9]{10})/i,
                            prompt: 'Ingrese valor alfanumérico de 10 caracteres'
                        },
                        {
                            type: 'minLength[10]',
                            prompt: 'La información del motor debe contener al menos caracteres 10'
                        }
                    ]
                },
                vin: {
                    identifier: 'vin',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese información del número VIN'
                    }, {
                        type: 'minLength[17]',
                        prompt: 'El valor debe contener mínimo 17 caracteres'
                    }, {
                        type: 'maxLength[20]',
                        prompt: 'El valor debe contener máximo 20 caracteres'
                    }, {
                        type: 'regExp',
                        value: /([A-Za-z0-9]{17,20})/i,
                        prompt: 'Ingrese unicamente valores alfanuméricos al número del VIN'
                    }]
                },
                brand: {
                    identifier: 'brand',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese la marca del vehículo'
                    }]
                },
                model: {
                    identifier: 'model',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese el modelo'
                    }]
                },
                type: {
                    identifier: 'type',
                    rules: [{
                        type: 'empty',
                        prompt: 'Debe seleccionar el tipo de vehículo'
                    }]
                },
                mileage: {
                    identifier: 'mileage',
                    rules: [{
                        type: 'empty',
                        prompt: 'Debe ingresar el kilometraje inicial'
                    }]
                },
                year: {
                    identifier: 'year',
                    rules: [{
                        type: 'empty',
                        prompt: 'Por favor ingrese el año del vehículo'
                    }, {
                        type: 'minLength[4]',
                        prompt: 'El valor debe contener únicamente 4 caracteres'
                    }, {
                        type: 'maxLength[4]',
                        prompt: 'El valor debe contener únicamente 4 caracteres'
                    }]
                },
                state: {
                    identifier: 'state',
                    rules: [{
                        type: 'empty',
                        prompt: 'Debe seleccionar el estado del vehículo'
                    }]
                },
                seats: {
                    identifier: 'seats',
                    rules: [{
                        type: 'integer[1..40]',
                        prompt: 'La capacidad de personas debe estar entre 1 y 40'
                    }]
                },
                office: {
                    identifier: 'office',
                    rules: [{
                        type: 'empty',
                        prompt: 'Debe seleccionar la oficina responsable del vehiculo del vehículo'
                    }]
                },
                color: {
                    identifier: 'color',
                    rules: [{
                        type: 'empty',
                        prompt: 'Debe ingresar el color del vehículo'
                    }]
                },
                fuel: {
                    identifier: 'fuel',
                    rules: [{
                        type: 'empty',
                        prompt: 'Debe seleccionar el tipo de combustible del vehículo.'
                    }]
                },
                details: {
                    identifier: 'details',
                    depends: 'km_input',
                    rules: [{
                        type: 'empty',
                        prompt: 'Debe ingresar un justificación detallada'
                    }]
                }
            }
        });

    if (!$('#vehicle_id').val()) {
        $('#add_btn').addClass('disabled');
    } else {
        $('#mileage').attr("Readonly", "true");
        $('#code').attr("Readonly", "true");
    }

});

/*Calendar input unicamente para año*/
$('#year')
    .calendar({
        type: 'year'
    });

$('#code').keypress(function () {
    $('#code').val(Masking($(this).val(), '____-_____-___-_-____'))
})

function Masking(value, pattern) {
    var out = '';
    var space = ' ';
    var any = '_';

    for (var i = 0, j = 0; j < value.length; i++, j++) {
        if (value[j] === pattern[i]) {
            out += value[j];
        } else if (pattern[i] === any && value[j] !== space) {
            out += value[j];
        } else if (pattern[i] !== any && pattern[i] !== space) {
            out += pattern[i];
            j--;
        }
    }
    //console.log('Output: ' + out);
    return out;
}

/*
Evita el ingreso de mas de 21 caracteres al campo
27012020_DD
*/
$('#code').keydown(function (event) {
    return $(this).val().length <= 20 || event.keyCode === 9 || event.keyCode === 8 || event.keyCode === 46 || event.keyCode >= 35 && event.keyCode <= 40 ? true : false;
})

/*
Impide el ingreso de cualquier caracter que no se numero
06012019_DD
 */
$("#seats").keydown(function (event) {
    return event.keyCode === 9 || event.keyCode === 8 || event.keyCode === 46 || event.keyCode >= 35 && event.keyCode <= 40 ? true : !isNaN(Number(event.key));
})

$("#mileage").keydown(function (event) {
    return event.keyCode === 9 || event.keyCode === 8 || event.keyCode === 46 || event.keyCode >= 35 && event.keyCode <= 40 ? true : !isNaN(Number(event.key));
})

$("#km_input").keydown(function (event) {
    return event.keyCode === 9 || event.keyCode === 8 || event.keyCode === 46 || event.keyCode >= 37 && event.keyCode <= 40 ? true : !isNaN(Number(event.key));
})

/*Limita el ingreso de caracteres a la letra N y numeros
13012020_DD*/
$("#vplate").keydown(function (event) {
    return event.keyCode === 9 || event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 65 || event.keyCode === 66 || event.keyCode === 77 || event.keyCode === 78 || event.keyCode === 80 || event.keyCode >= 37 && event.keyCode <= 40 ? true : !isNaN(Number(event.key));
})

/*
Impide el ingreso de cualquier caracter que no se letra del alfabeto
BackSpace, Suprimir o flechas direccionales
06012019_DD
 */
$("#brand").keydown(function (event) {
    return event.keyCode === 9 || event.keyCode === 8 || event.keyCode === 46 || event.keyCode >= 37 && event.keyCode <= 40 || event.keyCode >= 65 && event.keyCode <= 90 ? true : false;
})

/*
Impide el ingreso de la letra i,o,q,ñ
06012019_DD
 */
$("#chassis").keydown(function (event) {
    return event.keyCode === 73 || event.keyCode === 79 || event.keyCode === 81 || event.keyCode === 192 ||
        !((event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 9) ||
            (event.keyCode >= 64 && event.keyCode <= 90) ||
            (event.keyCode >= 37 && event.keyCode <= 40) ||
            !isNaN(Number(event.key))) ? false : true;
})

/*
Impide el ingreso de la letra i,o,q,ñ
06012019_DD
 */
$("#vin").keydown(function (event) {
    return event.keyCode === 73 || event.keyCode === 79 || event.keyCode === 81 || event.keyCode === 192 ||
        !((event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 9) ||
            (event.keyCode >= 64 && event.keyCode <= 90) ||
            (event.keyCode >= 37 && event.keyCode <= 40) ||
            !isNaN(Number(event.key))) ? false : true;
})


/*
Impide el ingreso de la letra ñ y caracteres especiales
06012019_DD
 */
$("#engine").keydown(function (event) {
    return event.keyCode === 192 ||
        !((event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 9) ||
            (event.keyCode >= 64 && event.keyCode <= 90) ||
            (event.keyCode >= 37 && event.keyCode <= 40) ||
            !isNaN(Number(event.key))) ? false : true;
})

/*
Impide el ingreso de la letra ñ y caracteres especiales
06012019_DD
 */
$("#model").keydown(function (event) {
    return event.keyCode === 192 ||
        !((event.keyCode === 8 || event.keyCode === 46 || event.keyCode === 9) ||
            (event.keyCode >= 64 && event.keyCode <= 90) ||
            (event.keyCode >= 37 && event.keyCode <= 40) ||
            !isNaN(Number(event.key))) ? false : true;
})

/*
Permite cerrar los mensajes emergentes
29092019_DD
 */
$(".close.icon").click(function () {
    $(this).parent().hide();
});

/*
Detona el proceso de insercion del vehiculo
28092019_DD 
*/
$("#add_btn").click(function () {
    console.log($('#vehicle_id').val());
    if ($('#vehicle_id').val()) {
        update_vehicle();
    } else {
        insert_vehicle();
    }


});

/*
 Valida que la placa no esté vinculada a ningun otro vehiculo
 01102019_DD
*/
$('#fPlate').focusout(function () {
    console.dir($(".ui.form").form('validate field', 'plate'));
    if ($(".ui.form").form('validate field', 'plate')) {
        if ($('#old_plate').val() === $('#vplate').val() && $('#vehicle_id').val()) {
            $('#add_btn').removeClass('disabled');
            //AddToast("Valor Integro", "orange", "El numero de placa: " + current_plate + " no ha cambiado");
        } else if (!$('#vplate').val()) {
            $('#fPlate').addClass('error');
            AddToast("Valor Nulo", "error", "Debe ingresar un matricula valida para poder verificar su unicidad");
        } else {
            if ($('#vplate').val().length >= 4) {
                console.log($('#vplate').val().length)
                validate_plate();
            }
        }
    }
})

/*
Logica del proceso de insercion con su respectivas validaciones
28092019_DD
*/
function insert_vehicle() {
    $('.ui.toast').remove();
    $('.ui.form').form('validate form');
    if ($('.ui.form').form('is valid')) {
        url_request_plate_exist = 'matricula_' + $('#vplate').val();
        $.ajax({
            url: url_request_plate_exist,
            async: false,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                if (data.type === 0) {
                    create_vehicle();
                } else {
                    AddToast('Error con la Matricula', 'warning', data.message);
                    $('#add_btn').addClass('disabled');
                }
            }
        });
    }
}

/*
Logica del proceso de insercion con su respectivas validaciones
01102019_DD
*/
function update_vehicle() {
    $('.ui.toast').remove();
    $('.ui.form').form('validate form');
    if ($('.ui.form').form('is valid')) {
        console.log($('#old_plate').val());
        console.log($('#vplate').val());
        if ($('#old_plate').val() === $('#vplate').val()) {
            refresh_vehicle();
        } else {
            validate_plate();
            if (data_type === 0) {
                refresh_vehicle();
            }
        }
    }
}


/*
Verifica si el numero de placa existe
01102019_DD
*/
function validate_plate() {
    url_request_plate_exist = 'matricula_' + $('#vplate').val();
    $.ajax({
        url: url_request_plate_exist,
        async: false,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            data_type = data.type;
            if (data.type === 0) {
                AddToast('Matrícula valida', 'success', data.message);
                $('#add_btn').removeClass('disabled');
            } else {
                AddToast('Error con la Matricula', 'warning', data.message);
                $('#add_btn').addClass('disabled');
                $('#fPlate').addClass('error');
            }
        }
    });
}

/*
Metodo Ajax de insercion de vehiculo
28092019_DD 
*/
function create_vehicle() {
    $.ajax({
        url: "/vehiculos/gestionar",
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

/*
Metodo Ajax de actualizacion de vehiculo
28092019_DD 
*/
function refresh_vehicle() {
    $.ajax({
        url: "/vehiculos/gestionar",
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
$("#office").dropdown({
    fullTextSearch:true
})
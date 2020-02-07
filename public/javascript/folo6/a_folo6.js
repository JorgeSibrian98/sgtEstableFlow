/*****ANIMACIÓN,SETTINGS INICIALES Y VALIDACIONES******/
var id_employee = 3;
var motorista;
var user, unit;;

function showLoadingDimmer() {
    // $('.segment').dimmer('set active');
    $('body').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "Cargando los datos...",
        closable: false,
    }).dimmer('show');
}


$(document).ready(function () {
    showLoadingDimmer()
    $.ajax({
        url: '/empleado/info',
        async: true,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            console.log(typeof (data.user));
            user = data.user;
            unit = data.unit
            console.log(user);
            console.log(unit);
        }
    }).done(function () {
        $("#name_lb").text(user.first_name + ", " + user.last_name);
        $("#unidad_lb").text(unit.name_unit);
        $('body').dimmer('hide');
    });

});

//VALIDACION DEL FORM
$('.ui.form').form({
    //revalidate: true,
    inline: true,
    on: 'blur',
    fields: {
        calendar1: {
            identifier: 'calendar1',
            rules: [{
                type: 'empty',
                prompt: 'Seleccione una fecha de salida'
            }]
        },
        time: {
            identifier: 'time',
            rules: [{
                type: 'empty',
                prompt: 'Seleccione una hora de salida'
            }]
        },
        time1: {
            identifier: 'time1',
            rules: [{
                type: 'empty',
                prompt: 'Seleccione una hora de retorno'
            }, {
                type: 'different[time]',
                prompt: 'La hora de retorno debe ser distinta a la hora de salida'
            }]
        },
        passengers_i: {
            identifier: 'passengers_i',
            rules: [{
                    type: 'empty',
                    prompt: 'Seleccione un número de pasajeros'
                },
                {
                    type: 'integer',
                    prompt: 'Ingrese un número válido de pasajeros'
                }, {
                    type: 'integer[1...42]',
                    prompt: 'Ingrese un número válido de pasajeros'
                }
            ]
        },
        departamento: {
            identifier: 'departamento',
            optional: 'true',
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
        },
        fplaces: {
            identifier: 'fplaces',
            optional: 'true',
            depends: 'municipio',
            rules: [{
                type: 'empty',
                prompt: 'Seleccione un lugar frecuente de la lista'
            }, {
                type: 'not[--Seleccione un lugar--]',
                prompt: 'Seleccione un lugar frecuente de la lista'
            }]
        },
        mision_i: {
            identifier: 'mision_i',
            rules: [{
                type: 'empty',
                prompt: 'Ingrese el motivo o misión de su viaje'
            }]
        },
    },
});

//Validación de campos si NO selecciona motorista
//valida select de licencia
$("#license_ls_id").change(function () {
    $(".ui.form").form('validate field', 'license_ls');
});
$("#n_driver_i").change(function () {
    $(".ui.form").form('validate field', 'name_driver_i');
});
//
//valida input de misión
$("#mision_i_id").keyup(function () {
    $(".ui.form").form('validate field', 'mision_i');
});
/*--Formato y setting de fecha--*/
var today = new Date();
var month_lb = today.getMonth() + 1;
//Para setting de los labels
$("#date_lb").text(('0' + today.getDate()).slice(-2) + '/' + ('0' + (today.getMonth() + 1)).slice(-2) + '/' + today.getFullYear());

$('#standard_calendar').calendar({
    monthFirst: false,
    type: 'date',
    minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    onHide: function () {
        $(".ui.form").form('validate field', 'calendar1');
    },
    text: {
        days: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    },
    formatter: {
        date: function (date, settings) {
            if (!date) return '';
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            // return day + '/' + month + '/' + year; DD/MM/YYYY
            return (('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year);
        }
    },
    onSelect: function (date, mode) {
        //Verifica que la fecha de salida sea con 3 días de anticipación a partir de la fecha actual(día en que estamos)
        var days = date.getDate() - today.getDate();
        var months = (date.getMonth() + 1) - (today.getMonth() + 1);
        var years = date.getFullYear() - today.getFullYear();

        //Controlará si la fecha de salida es menor a tres días del día en que se llena y mes-año actual
        if (days < 3 && months === 0 && years === 0) {
            console.log("Solicitó con: " + days + " días hábiles, Tendrá que manejar por su cuenta");
            $('#driver_cb').checkbox('uncheck');
            $('.ui.checkbox').checkbox('disable');
            motorista = 0;
        } else {
            console.log("Solicitó con:" + days + " días hábiles, Puede solicitar motorista al área e logistica");
            $('#driver_cb').checkbox('check');
            $('.ui.checkbox').checkbox('enable');
            motorista = 1;
        }
    }
}).calendar('focus');
/*--Checkbox motorista--*/
/* Los campos "Nombre del motorista" y "Tipo de licencia" se mostrarán/ocultarán dependiendo de si
quiere o no motorista.*/
$('#name_driver_f').prop('hidden', true);
$('#type_license_f').prop('hidden', true);
$('.ui.checkbox').checkbox('enable');
$('#driver_cb').checkbox({
    onChecked: function () {
        $('#n_driver_i').prop('disabled', true);
        $('#license_ls_id').prop('disabled', true);
        motorista = 1;
        $('.ui.form').form('remove fields', ['name_driver_i', 'license_ls']);
        /* $(".ui.form").form('validate field', 'name_driver_i');
        $(".ui.form").form('validate field', 'license_ls');
        $('#license_ls_id').prop('selectedIndex', 0);
        $('#n_driver_i').val(''); */
        $('#name_driver_f').slideUp(); //Esconde el campo
        $('#type_license_f').slideUp(); //Esconde el campo
    },
    onUnchecked: function () {
        motorista = 0;
        $('#name_driver_f').slideDown(); //Muestra el campo
        $('#type_license_f').slideDown(); //Muestra el campo
        $('#n_driver_i').prop('disabled', false);
        $('#license_ls_id').prop('disabled', false);
        $('.ui.form').form('add rule', 'name_driver_i', {
            rules: [{
                type: 'empty',
                prompt: 'Ingrese el nombre de la persona que conducirá'
            }, {
                type: 'regExp[/^[A-Za-zÁáÉéÍíÓóÚúñ ]+$/g]',
                prompt: 'Este campo solo permite letras.'
            }]
        });
        $('.ui.form').form('add rule', 'license_ls', {
            rules: [{
                type: 'empty',
                prompt: 'Seleccione el tipo de licencia que posee el conductor'
            }]
        });
    }
})
/* --TIMER´s--*/
$('#time_calendar')
    .calendar({
        type: 'time',
        minTimeGap: '30',
        endCalendar: $('#time_calendar1'),
        onHide: function (date, text, mode) {
            $(".ui.form").form('validate field', 'time');
        },
        onchange: function (date, text, mode) {
            console.log("Hora de salida: " + date + " Formato string" + text + " y mode:" + mode);
        }
    });
$('#time_calendar1')
    .calendar({
        type: 'time',
        minTimeGap: '30',
        startCalendar: $('#time_calendar'),
        onChange: function (date, text, mode) {
            var dat = new Date($('#time_calendar').calendar('get date'));
            console.log(dat.getHours() + ':' + dat.getMinutes());
            //$(".ui.form").form('validate field', 'time1');
        },
        onHide: function (date, text, mode) {
            $(".ui.form").form('validate field', 'time1');
        }
    });
/*****FIN: ANIMACIÓN,SETTINGS INICIALES Y VALIDACIONES******/

function debugBase64(base64URL) {
    var win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    win.document.close()
}

/* $('#save_print_btn').on('click', function () {
    if ($('.ui.form').form('is valid')) {
        event.preventDefault();
        showDimmer();
        guardarFolo6();
        // setTimeout(guardarFolo6(), 30000);
    }
}); */

/*PARA VALIDAR QUE SE INGRESE AL MENOS UNA DIRECCIÓN */
$('#save_print_btn').on('click', function () {
    $('.ui.toast').remove();
    if ($('#createdAddress').has('option').length > 0 || $('#selectedFPlace').has('option').length > 0) {
        if ($('.ui.form').form('is valid')) {
            event.preventDefault();

            showDimmer();
            guardarFolo6();
            // setTimeout(guardarFolo6(), 30000);
        }
    } else {
        event.preventDefault();

        hideDimmer();
        $('body')
            .toast({
                title: "Lugares de destino vacíos",
                showIcon: false,
                class: 'error',
                position: 'top right',
                displayTime: 0,
                closeIcon: true,
                message: "La solicitud debe tener al menos un lugar o una dirección que visitar",
            });
    }
});


//Animación patanlla negra y muestra el loader: "guardando..."
function showDimmer() {
    $('body').dimmer({
        displayLoader: true,
        loaderVariation: 'slow blue medium elastic',
        loaderText: "Ingresando solicitud...",
        closable: false,
    }).dimmer('show');
}

function guardarFolo6() {

    //Convierte el formulario a un array unidimensional donde cada atributo del form es un elemento del array es decir {campoX,CampoY} esto se hizo así ya que
    //Si se coloca .serializeArray() crea una matriz de la siguiente forma: [{name:campox,value:valorCampox},{name:campoY,value:valorCampoY}...]
    var form = $(".ui.form").serializeArray().reduce(function (a, z) {
        a[z.name] = z.value;
        console.log(a);
        return a;
    }, {});
    var fplaces = [];
    var address = [];
    if ($('#createdAddress option').length) {
        $('#createdAddress option').each(function () {
            address.push($(this).val());
        });
    } else {
        console.log("No se enviara direcciones")
    }
    if ($('#selectedFPlace option').length) {
        $('#selectedFPlace option').each(function () {
            fplaces.push($(this).val());
        });
    } else {
        console.log("No se enviara lugares frecuentes")
    }

    console.log("Se enviaran estos lugares: " + fplaces + " Direcciones: " + address)
    //Valores del json que serán enviados en el ajax para guardar el folo6
    var jsonReq = {
        form: JSON.stringify(form),
        emp: JSON.stringify(user),
        motorista: JSON.stringify(motorista),
        fplaces: JSON.stringify(fplaces),
        address: JSON.stringify(address)
    }
    console.log("Enviará:" +
        "form:" + JSON.stringify(form) + "emp:" + JSON.stringify(user) + "fplaces: " + JSON.stringify(fplaces) + "address:" + JSON.stringify(address));
    console.log("Empaquetado" + typeof (jsonReq));
    return $.ajax({
        type: "POST",
        async: true,
        url: '/solicitud_nueva/add',
        dataType: 'json',
        data: jsonReq,
        success: (data) => {
            console.log("data.type es:" + typeof (data.type) + " y trae: " + data);
            console.log("data.type es:" + typeof (data.type) + " y trae: " + data.type);
            if (data.type == 1) {
                //Si hay error
                console.log(data.message);
                $('body')
                    .toast({
                        title: data.title,
                        showIcon: false,
                        class: 'error',
                        position: 'top right',
                        displayTime: 0,
                        closeIcon: true,
                        message: data.message,
                    });
                hideDimmer();
            } else {
                //Si se ingresó con éxito
                window.location.href = data.redirect;
            }
        },
    }).done();
}
//Para poder animar los elementos cuando se envía un ingreso de vales

function hideDimmer() {
    {
        //$('.segment').dimmer('set disabled');
        $('body').dimmer('hide');
        //enable_elements();
    };
};

//MANEJO DE DIRECCIONES EN EL FOLO 6
//Esconde los dropdown.
$('#createdAddress').hide();
$('#selectedFPlace').hide();

//Esconde los campos a rellenar únicamente si selecciona "Otro" en el lugar de destino.
//Serán mostrados hasta que seleccione "Otro" en el lugar de destino.
$('#otherName').prop('hidden', true);
$('#otherDetail').prop('hidden', true);

$('#municipio').prop('disabled', true); //Este valor será cambiado a 'false' en a_address.js
$('#fplaces').prop('disabled', true); //Se habilita al seleccionar un municipio.
$('#addAddress').prop('disabled', true); //Se habilitará hasta que seleccione un lugar frecuente.
//En caso de seleccionar "otro", se habilitará hasta que llene alguno de los 2 campos siguientes.

//Función que habilita el dropdown de lugares frecuentes una vez se haya seleccionado una opción
//del dropdown de municipios.
$('#municipio').on('change', function () {
    $('#fplaces').prop('disabled', false);
});

//ESTA FUNCIÓN ESTABA REPETIDA. REMOVIDA 16/11/2019 POR AXEL HERNÁNDEZ

//Función que guarda en la BD las direcciones que se van ingresando a la tabla.
$('#addAddress').click(function () {
    event.preventDefault();
    var idSelDepto = $('#departamento').val();
    var idSelMun = $('#municipio').val();
    var selectedPlace = $('#fplaces').val();
    var destinyPlace = $('#destiny_place_i').val(); //Obtengo todos los valores
    var direction = $('#direction_txt').val();
    var selectedDeptoTxt = $('#departamento option:selected').text();
    var selectedMunTxt = $('#municipio option:selected').text();
    var selectedPlaceTxt = $('#fplaces option:selected').text();
    var dirCreadas = $('#createdAddress'); //Obtengo el dropdown de direcciones que está oculto
    var selectedFPlace = $('#selectedFPlace'); //Dropdown que tiene solo los lugares frecuentes ingresados
    var baseDir, cmpDir, c1, c2, c3, c4, dirExiste = 0;
    var tablaDirecciones = document.getElementById('addressTable');

    if (destinyPlace == '') {
        destinyPlace = 'No especificado';
    };

    if (direction == '') {
        direction = 'No especificado';
    };

    //Creo dirección base a partir de los valores obtenidos de los inputs.
    if (selectedPlaceTxt == 'Otro') {
        baseDir = destinyPlace + ', ' + direction + ', ' + selectedDeptoTxt + ', ' + selectedMunTxt;
    } else {
        baseDir = selectedPlaceTxt + ', No especificado, ' + selectedDeptoTxt + ', ' + selectedMunTxt;
    };

    //Paso a minúscula la dirección y la muestro en consola del navegador.
    baseDir = baseDir.toLowerCase();
    console.log(baseDir);
    /*Itero las filas de la tabla de direcciones para armar un string que contenga una dirección a partir
    de los valores en cada celda, esta se compara con la dirección creada a partir de los inputs.*/
    for (var i = 0; i < tablaDirecciones.rows.length; i++) {
        c1 = tablaDirecciones.rows[i].cells[0].innerHTML;
        if (c1 == '') {
            c1 = 'No especificado';
        };
        c2 = tablaDirecciones.rows[i].cells[1].innerHTML;
        if (c2 == '') {
            c2 = 'No especificado';
        };
        c3 = tablaDirecciones.rows[i].cells[2].innerHTML;
        c4 = tablaDirecciones.rows[i].cells[3].innerHTML;
        cmpDir = c1 + ', ' + c2 + ', ' + c3 + ', ' + c4;
        cmpDir = cmpDir.toLowerCase(); //Convierto a minúscula la dirección creada.
        console.log(cmpDir); //Muestro en consola la dirección.
        //Si ambas direcciones son iguales, la variable dirExiste toma el valor de 1 y se rompe el ciclo.
        if (baseDir == cmpDir) {
            dirExiste = 1;
            break;
        };
    };
    //Si dirExiste es igual a 1, se muestra un mensaje de error y NO se ingresa la dirección a la tabla.
    if (dirExiste == 1) {
        $('body')
            .toast({
                title: '¡Error!',
                position: 'top right',
                class: 'error',
                displayTime: 3000,
                message: 'La dirección que intenta ingresar ya existe.',
                pauseOnHover: false
            });
        //Caso contrario se añade la dirección a la tabla y se muestra un mensaje de éxito.
    } else {
        if (selectedPlaceTxt == 'Otro') {
            $.post('/direccion/add', { //Hago la petición post
                    idSelDepto,
                    idSelMun,
                    selectedPlace,
                    destinyPlace,
                    direction,
                    selectedPlaceTxt
                }, //Agrego al dropdown el id de la dirección creada
                function (dir) {
                    if (dir != null && !jQuery.isEmptyObject(dir)) {
                        dirCreadas.append($('<option/>', {
                            value: dir.id,
                            text: dir.id
                        }));
                    };
                    fillAddressTable(); //Se llena la tabla en la vista.
                    addDeleteIcon(dir.id); //Agrega el ícono de eliminar
                });
            //Esconde los campos para poder ingresar otra dirección.
            $('#otherName').slideUp();
            $('#otherDetail').slideUp();
        };
        //Agrego el lugar frecuente seleccionado al dropdown
        if (selectedPlaceTxt != 'Otro') {
            selectedFPlace.append($('<option/>', {
                value: selectedPlace,
                text: selectedPlaceTxt,
            }));
            fillAddressTable();
            addDeleteIconFP(parseInt(selectedPlace));
        };
        $('body')
            .toast({
                title: '¡Éxito!',
                position: 'top right',
                class: 'success',
                displayTime: 3000,
                message: 'Dirección ingresada correctamente.',
                pauseOnHover: false
            });
        console.log(dirCreadas); //Muestro el dropdown en consola (navegador) para verificar su contenido.
        console.log(selectedFPlace);
        $(this).prop('disabled', true);
    };
});

//Añade el ícono eliminar en la tabla direcciones del folo cuando es FP
function addDeleteIconFP(selectedPlace) {
    //Crea un ícono para eliminar la dirección tanto de la tabla como en la BD.
    $('<i></i>', {
        class: "red big window close icon",
        value: selectedPlace, //ID lugar frecuente
        id: "delAddress",
        "on": { //Cada ícono se crea con un evento onclick.
            "click": function () {
                $(this).parents('tr').remove(); //Elimina la dirección de la tabla.
                //Elimino el id del dropdown
                $('#selectedFPlace option[value=' + selectedPlace + ']').remove();
                console.log($('#selectedFPlace'));
            },
        },
        //Cada ícono se agrega a la última celda de cada fila de la tabla.
    }).appendTo('#addressTable > tbody > tr:last > td:last');
};

//Añade el ícono eliminar en la tabla direcciones del folo cuando es una nueva dirección
function addDeleteIcon(dir) {
    //Crea un ícono para eliminar la dirección tanto de la tabla como en la BD.
    $('<i></i>', {
        class: "red big window close icon",
        value: dir, //ID address
        id: "delAddress",
        "on": { //Cada ícono se crea con un evento onclick.
            "click": function () {
                $(this).parents('tr').remove(); //Elimina la dirección de la tabla.
                address = $(this).toArray(); //Convierto las propiedades del ícono a array.
                id_address = address[0].attributes.value.value; //Obtengo el id de la dirección que está en la propiedad value.
                $.post('/direccion/delete', {
                    id_address
                }); //Elimina la dirección de la BD.
                //Elimino el id del dropdown.
                $('#createdAddress option[value=' + dir + ']').remove();
                console.log($('#createdAddress'));
            },
        },
        //Cada ícono se agrega a la última celda de cada fila de la tabla.
    }).appendTo('#addressTable > tbody > tr:last > td:last');
};

//Función que agrega las direcciones a la tabla al hacer clic en el botón "Agregar dirección"
function fillAddressTable() {
    $('#n_dir').text("Si");
    //Obtiene los valores de los combobox
    var selectedPlace = $('#fplaces option:selected').text();
    var selectedDepartamento = $('#departamento option:selected').text();
    var selectedMunicipio = $('#municipio option:selected').text();
    var destinyPlace = $('#destiny_place_i').val();
    var direction = $('#direction_txt').val();
    //Si el usuario elige la opción "Otro" del combobox de lugares frecuentes
    if (selectedPlace == "Otro") {
        //Inserción de elementos a la tabla
        $('#addressTable tbody').append("<tr>" +
            "<td>" + destinyPlace + "</td>" +
            "<td>" + direction + "</td>" +
            "<td>" + selectedDepartamento + "</td>" +
            "<td>" + selectedMunicipio + "</td>" +
            "<td></td>" +
            "</tr>");
        //Reinicia los combobox y los campos a excepción del combobox de departamentos.
        $('#fplaces').empty();
        $('#departamento').val("");
        $('#municipio').empty();
        $('#destiny_place_i').val("");
        $('#destiny_place_i').prop('disabled', true);
        $('#direction_txt').val("");
        $('#direction_txt').prop('disabled', true);
        $('#fplaces').prop('disabled', true);
        $('#municipio').prop('disabled', true);
    } else { //Si el usuario selecciona un lugar frecuente
        //Inserción de elementos a la tabla
        $('#addressTable tbody').append("<tr>" +
            "<td>" + selectedPlace + "</td>" +
            "<td></td>" +
            "<td>" + selectedDepartamento + "</td>" +
            "<td>" + selectedMunicipio + "</td>" +
            "<td></td>" +
            "</tr>");
        //Reinicia los combobox y los campos a excepción del combobox de departamentos.
        $('#fplaces').empty();
        $('#departamento').val("");
        $('#municipio').empty();
        $('#fplaces').prop('disabled', true);
        $('#municipio').prop('disabled', true);
    };
};

/*Función que habilita los campos "Nombre del destino" y "Detalle de dirección"
si el usuario seleccionó la opción "Otro" del combobox de lugares frecuentes.*/
$('#fplaces').change(function () {
    if ($('#fplaces option:selected').text() == 'Otro') {
        $('#destiny_place_i').prop('disabled', false);
        $('#direction_txt').prop('disabled', false);
        $('#otherName').slideDown(); //Muestra el campo
        $('#otherDetail').slideDown(); //Muestra el campo
    } else {
        $('#destiny_place_i').prop('disabled', true);
        $('#direction_txt').prop('disabled', true);
        $('#otherName').slideUp(); //Esconde el campo
        $('#otherDetail').slideUp(); //Esconde el campo
        $('#addAddress').prop('disabled', false);
    };
});

//Función que habilita el botón "Agregar dirección" si el campo "Nombre del destino":
$('#destiny_place_i').on('change', function () {
    if ($(this).val() != null) { //1) Es diferente de nulo
        // 1.1) Y si el campo "Detalle de dirección" está vacío habilita el botón (en caso previo ya hubiese sido deshabilitado).
        //Este caso se puede dar si lleno ambos campos y luego borro el campo "Detalle de dirección".
        if ($('#direction_txt').val() == '') {
            $('#addAddress').prop('disabled', false);
        } else {
            //1.2) Si lleno primero el campo "Detalle de dirección"
            if ($(this).val() != '') { //y luego lleno este campo:
                $('#addAddress').prop('disabled', false); //Mantengo habilitado el botón
            } else {
                $('#addAddress').prop('disabled', true); //Deshabilito el botón
            };
        };
    };
    //2) Si este campo está vacío:
    if ($(this).val() == '') {
        //2.1) y si el campo "Detalle de dirección" también está vacío deshabilita el botón (en caso previo ya hubiese sido habilitado).
        if ($('#direction_txt').val() == '') {
            $('#addAddress').prop('disabled', true);
            //2.2) Pero si este campo está vacío y el campo "Detalle de dirección" no lo está, habilita el botón.
        } else {
            $('#addAddress').prop('disabled', false);
        };
        /*Este caso se puede dar si lleno ambos campos y luego borro ambos, o si lleno ambos campos y solo
        borro el campo "Nombre del destino".*/
    };
});

//Función que habilita el botón "Agregar dirección" si:
$('#direction_txt').on('change', function () {
    // 1) Este valor es diferente de nulo
    if ($(this).val() != null) {
        $('#addAddress').prop('disabled', false);
    };
    // 2) Si este campo está vacío
    if ($(this).val() == '') {
        if ($('#destiny_place_i').val() == '') { //y el campo "Nombre del destino" también está vacío
            $('#addAddress').prop('disabled', true); //Deshabilito el botón
        } else {
            $('#addAddress').prop('disabled', false); //Mantengo habilitado el botón
        };
    };
});

//Función para eliminar todas las direcciones creadas si el usuario se sale del Folo06.
$('#backBtn').click(function () {
    var dirCreadas = [];
    //Recorro cada elemento del dropdrown, obtengo su propiedad value y la inserto en el array.
    $('#createdAddress option').each(function () {
        dirCreadas.push($(this).val());
    });
    $.post('/direccion/deleteList', {
        dirCreadas
    }); //Petición post para eliminar las direcciones.
    console.log(dirCreadas);
});
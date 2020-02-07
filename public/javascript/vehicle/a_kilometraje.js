$('#modal_update_km')
    .modal('attach events', '#update_km', 'show');

//AGREGA REGLA PARA VERIFICAR QUE EL KILOMETRAJE INGRESADO SEA MAYOR O IGUAL QUE EL ANTERIOR
$.fn.form.settings.rules.minor = function (value, minor) {
    try {
        var valido = true;
        if (parseInt($("#km_input").val()) < parseInt($("#km_actual").val())) {
            valido = false;
        }
        return (valido);
    } catch (err) {
        console.log(err);
    }
};

//Para verificar el cambio de estado, si no hay cambio de estado el formulario se mantendra oculto
$("#state").change(function () {
    var state = $(this).children("option:selected").val();
    console.log("El estado es: " + state);
    //Agregue el es por que asi se maneja en tus dropdown
    var old_state = $("#old_state").val();
    console.log("viejo estado: " + old_state)

    if (state == '1' && state != old_state && old_state) {
        console.log("mostrar form")
        document.getElementById("update_km_form_div").style.display = "block";
        //Se actualizará con el nuevo estado.
        //DD: No debe actualizarse sino al estar jugando con el cambio pierde el sentido y deja de funcionar
        //$("#old_state").val(state)
        $('#km_cb').checkbox('checked');
        $('#km_input').removeAttr('readonly');
        $('.ui.form')
            .form('add rule', 'km_input', {
                rules: [{
                        type: 'empty',
                        prompt: 'Ingrese un nuevo kilometraje'
                    }, {
                        type: 'integer[1...999999999999]',
                        prompt: 'Este campo solo permite números enteros.'
                    }, //Válida la longitud de caracteres
                    {
                        type: 'regExp[/^[0-9]{1,16}$/]',
                        prompt: 'Por favor ingrese un número con longitud válida '
                    }, {
                        type: 'minor[km_actual]',
                        prompt: 'El nuevo kilometraje deber ser mayor o igual que el registro actual'
                    },
                ]
            });
    } else {
        //Elimina las reglas de validación creadas para ese campo 
        $('.ui.form').form('remove field', 'km_input');
        document.getElementById("update_km_form_div").style.display = "none";
    }
});

//Kilometraje actual
//DD:No necesario porque justo arriba titene el valor
//$("#km_input").val($("#km_actual").val());

$('#km_cb').checkbox('enable'); //.checkbox('uncheck');
//Para registrar si hay cambio en el kilometraje del vehículo
$('#km_cb').checkbox({
    onChecked: function () {
        $('#km_input').removeAttr('readonly');
    },
    onUnchecked: function () {
        $('#km_input').attr('readonly', 'true');

        //Setea el kilometraje actual
        //DD:No necesario porque justo arriba titene el valor
        $("#km_input").val($("#km_actual").val());

        //Elimina las reglas de validación creadas para ese campo 
        //$('.ui.form').form('remove field', 'km_input');
    }
})

$('.ui.form').form({
    on: 'blur',
    revalidate: true,
    inline: true,
    fields: {
        motive_dropdown: {
            identifier: 'motive_dropdown',
            rules: [{
                type: 'empty',
                prompt: 'Por favor seleccione un motivo de actulización de kilometraje'
            }]
        },
        details: {
            identifier: 'details',
            rule: [{
                type: 'empty',
                prompt: 'Ingrese una justificacion detallada'
            }]
        }
    },
});
$(document).ready(function () {
    $('#message').fadeIn('slow', function () {
        $('#message').delay(5000).fadeOut();
    });
});
$(".close.icon").click(function () {
    $(this).parent().hide();
});

$('#standard_calendar').calendar({
    monthFirst: false,
    type: 'date',
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
    }
});
$('#standar_calendar').calendar().on('changeDate', function () {
    $(this).blur();
});
$(function () {
    $('#frm-prueba').form({
        //revalidate: true,
        inline: true,
        fields: {
            license: {
                identifier: 'driver_license',
                rules: [{
                    type: 'empty',
                    prompt: 'Ingrese el numero de la licencia'
                }]
            },
            license_type: {
                identifier: 'license_type',
                rules: [{
                    type: 'empty',
                    prompt: 'seleccione el tipo de licencia'
                }]
            },
            calendar1: {
                identifier: 'calendar1',
                rules: [{
                    type: 'empty',
                    prompt: 'Seleccione una fecha de nacimiento'
                }]
            },
            first_name: {
                identifier: 'first_name',
                rules: [{
                    type: 'empty',
                    prompt: 'Ingrese el nombre o los nombres'
                }]
            },
            last_name: {
                identifier: 'last_name',
                rules: [{
                    type: 'empty',
                    prompt: 'Ingrese el apellido o apellidos'
                }]
            },
            month: {
                identifier: 'month',
                rules: [{
                    type: 'empty',
                    prompt: 'Seleccione un mes'
                }]
            },
            anio: {
                identifier: 'anio',
                rules: [{
                    type: 'empty',
                    prompt: 'Seleccione un a&ntilde;o'
                }]
            }
        }
    })
});

function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

setInputFilter(document.getElementById("driver_license"), function (value) {
    return /^\d*\-?\d*\-?\d*\-?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});
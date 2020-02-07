function fillMunicipio() {
    var sMun = $("#idmun").val();
    var selectedDepartamento = $("#departamento").val();
    var municipiosSelect = $('#municipio');
    municipiosSelect.empty();
    if (selectedDepartamento != null && selectedDepartamento != '') {
        $.getJSON('http://localhost:3000/direccion/getMunicipios', {
            selectedDepartamento
        }, function (municipios) {
            if (municipios != null && !jQuery.isEmptyObject(municipios)) {
                municipiosSelect.append($('<option/>', {
                    value: null,
                    text: "--Seleccione un municipio--"
                }));
                $.each(municipios, function (index, municipio) {
                    if (municipio.id == sMun) {
                        municipiosSelect.append($('<option/>', {
                            value: municipio.id,
                            text: municipio.name,
                            selected: true,
                        }))
                    } else {
                        municipiosSelect.append($('<option/>', {
                            value: municipio.id,
                            text: municipio.name,
                        }))
                    }
                });
            };
        });
    };
};


$(function () {
    fillMunicipio();
});

$('#departamento').change(function () {
    $('#municipio').prop('disabled', false); //Habilito dropdown de municipios al seleccionar un departamento
    fillMunicipio();
});
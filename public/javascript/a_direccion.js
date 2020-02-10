function fillMunicipio() {
    var sMun = $("#idmun").val();
    var selectedDepartamento = $("#departamento").val();
    var municipiosSelect = $('#municipio');
    municipiosSelect.empty();
    if (selectedDepartamento != null && selectedDepartamento != '') {
        $.getJSON('/direccion/getMunicipios', {
            selectedDepartamento
        }, function (municipios) {
            if (municipios != null && !jQuery.isEmptyObject(municipios)) {
                municipiosSelect.append($('<option/>', {
                    value: null,
                    text: "--Seleccione un municipio--"
                }));
                $.each(municipios, function (index, municipio) {
                    if (municipio.CodigoUbicacionGeografica == sMun) {
                        municipiosSelect.append($('<option/>', {
                            value: municipio.CodigoUbicacionGeografica,
                            text: municipio.NombreUbicacionGeografica,
                            selected: true,
                        }))
                    } else {
                        municipiosSelect.append($('<option/>', {
                            value: municipio.CodigoUbicacionGeografica,
                            text: municipio.NombreUbicacionGeografica,
                        }))
                    }
                });
            };
        });
    };
};

$('#departamento').change(function () {
    $('#municipio').prop('disabled', false); //Habilito dropdown de municipios al seleccionar un departamento
    fillMunicipio();
});

$(window).on('load', function () {
    var sMun = $("#idmun").val();
    if (sMun) {
        this.fillMunicipio();
    }
});
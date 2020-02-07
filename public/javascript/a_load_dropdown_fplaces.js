function fillPlaces() {
    var sPlace = $("#idfplaces").val();
    var selectedMunicipio = $("#municipio").val();
    var placesSelect = $('#fplaces');
    placesSelect.empty();
    if (selectedMunicipio != null && selectedMunicipio != '') {
        $.getJSON('/lugares_frecuentes/getPlaces', {
            selectedMunicipio
        }, function (places) {
            if (places != null && !jQuery.isEmptyObject(places)) {
                placesSelect.append($('<option/>', {
                    value: null,
                    text: "--Seleccione un lugar--"
                }));
                $.each(places, function (index, place) {
                    if (place.id == sPlace) {
                        placesSelect.append($('<option/>', {
                            value: place.id,
                            text: place.name,
                            selected: true,
                        }))
                    } else {
                        placesSelect.append($('<option/>', {
                            value: place.id,
                            text: place.name,
                        }))
                    };
                });
                placesSelect.append($('<option/>', {
                    value: 10000,
                    text: "Otro",
                }));
            } else {
                placesSelect.append($('<option/>', {
                    value: null,
                    text: "--Seleccione un lugar--",
                }));
                placesSelect.append($('<option/>', {
                    value: 10000,
                    text: "Otro",
                }));
            };
        });
    };
};


$(function () {
    fillPlaces();
});

$('#municipio').change(function () {
    fillPlaces();
});
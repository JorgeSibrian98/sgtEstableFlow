/*
Animaciones del Front del formulario de ingresar Procu 
06102019_DD
*/

var success, update;
var params = new URLSearchParams(location.search);
success = params.get('success');
update = params.get('edit');

if(success == 'yes'){
    //Muestra mensaje de éxito si se editó la procuraduría sin errores.
    if (update == 'yes'){
        $('body')
        .toast({
            title: '¡Éxito!',
            showIcon: true,
            class: 'success',
            showProgress: true,
            position: 'top right',
            displayTime: 3000,
            closeIcon: true,
            showProgress: 'top',
            classProgress: 'red',
            progressUp: false,
            message: 'Procuraduría editada correctamente.',
            transition: {
                showMethod: 'zoom',
                showDuration: 100,
                hideMethod: 'fade',
                hideDuration: 500
            },
            pauseOnHover: false, 
        });
    } else {
        //Muestra mensaje de éxito si se creó la procuraduría sin errores.
        $('body')
        .toast({
            title: '¡Éxito!',
            showIcon: true,
            class: 'success',
            showProgress: true,
            position: 'top right',
            displayTime: 3000,
            closeIcon: true,
            showProgress: 'top',
            classProgress: 'red',
            progressUp: false,
            message: 'Procuraduría creada correctamente.',
            transition: {
                showMethod: 'zoom',
                showDuration: 100,
                hideMethod: 'fade',
                hideDuration: 500
            },
            pauseOnHover: false, 
        });
    }
};

$('#mytable').DataTable({
    "scrollCollapse": true,
    language: {
        "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
    }
});

$(".pencil.yellow.alternate.link.icon").click(function () {
    var id = $(this).attr("value");
    /* var route = $(this).closest("td").find("i.edit.yellow.icon").attr("value"); */
    url_list = encodeURI('instituciones/gestionar?' + "procu_id=" + id);
    console.log(url_list);
    location.href = url_list;
});


var title, message, clss;

/*Inicializa el dataTable y conviete los labels en español*/
$(function () {
    $('#mytable').DataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        language: {
            "url": "//cdn.datatables.net/plug-ins/1.10.15/i18n/Spanish.json"
        }
    });

    //Verifica si el registro fue guardado con exito
    title = getParameterByName('title');
    message = getParameterByName('message');
    clss = getParameterByName('class');

    if (title && message && clss) {
        AddToast(title, clss, message);
    }

})

/* Detona el metodo editar en el back mediante el id en un querystring */
$(".pencil.yellow.alternate.link.icon").click(function () {
    var id = $(this).attr("value");
    var url_list = encodeURI('usuarios/gestionar?' + "user_id=" + id);
    console.log(url_list);
    location.href = url_list;
});

/*
Obtienes los parametro del querystring por nombre
25092019_DD
*/
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
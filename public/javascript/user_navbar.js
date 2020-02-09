var home = "<a id=\"_home\" href=\"/home\" class=\"item\"><i class=\"home icon\"></i>Home</a>";
var folo6 = "<a href=\"/solicitud_nueva\" class=\"item\"><i class=\"file alternate icon\"></i>Folo 6</a>";
var aprobarFolos = "<a href =\"/panel_de_aprobacion\" class=\"item\"><i class=\"tasks icon\"></i>Aprobar Folos</a></i>";
var flotaVehicular = "<a href=\"/vehiculos\" class=\"item\"><i class=\"car side icon\"></i>Flota Vehicular</a>";
var vale = "<a href=\"/vales\" class=\"item\"><i class=\"gas pump icon\"></i>Vales</a>";
var adminFplaces = "<a href=\"/lugares_frecuentes\" class=\"item\"><i class=\"map marked alternate icon\"></i>Administrar<br>Lugares Frecuentes</a>";
var aprobarReq = "<a href=\"/nuevos_requerimientos\" class=\"item\"><i class=\"tasks icon\"></i>Aprobar requerimientos</a>";
var adminPro = "<a href=\"/instituciones\" class=\"item\"><i class=\"building outline icon\"></i>Administrar<br>Procuradurías</a>";
var rutas = "<a href=\"/rutas\" class=\"item\"><i class=\"route icon\"></i>Rutas</a>";
var calConfig = "<a href=\"/configuracion_calendario\" class=\"item\"><i class=\"inverted corner settings icon\"></i>Calendario de rutas</a>";
var asignarVal = "<a href=\"/asignar_recursos/vales\" class=\"item\"><i class=\"gas pump icon\"></i>Asignar Vales</a>";
var motorista = "<a href=\"/motoristas\" class=\"item\"><i class=\"address card outline icon\"></i>Motoristas</a>";
var controlRuta = "<a href=\"/asignar_motorista\" class=\"item\"><i class=\"clipboard outline icon\"></i>Control de ruta</a>";
var mision = "<a href=\"/misiones\" class=\"item\"><i class=\"flag outline icon\"></i>Misiones</a>";
var usuarios = "<a href=\"/usuarios\" class=\"item\"><i class=\"user tie icon\"></i>Usuarios</a>";
var reportes = "<a href=\"/reportes\" class=\"item\"><i class=\"print icon\"></i>Reportes</a>";

//Opciones de menu por Roles
var adminIT = [reportes] //[usuarios, adminPro];
var adminR = [rutas, controlRuta, adminFplaces, calConfig];
var adminTrans = [flotaVehicular, reportes]; //, motorista, aprobarReq, mision];
var adminV = [asignarVal];
var emp = [home, folo6];
var uBoss = [aprobarFolos, home, folo6];
var unitC = [vale];
var adminVe = [flotaVehicular];
var user;
var roles;
var rolesA = [];

$(function () {
    //Para obtener datos de empleado a mostrar en la navbar, así como también extraer roles
    var user = $.ajax({
        url: '/userinfo',
        async: true,
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            console.log("Encontro usuario")
        }
    }).done(function (data, textStatus, jqXHR) {
        user = data.user;
        roles = data.roles;
        $('#username').text(user.NombresUsuario + ' ' + user.ApellidosUsuario);

        getMenuOptions(roles);
    });


});

$('#username').change(getMenuOptions(roles));

function getMenuOptions(_roles) {
    var menuOptions = [];
    roles = _roles;
    for (var r in roles) {
        console.log(roles[r]);
        switch (roles[r]) {
            case "emp       ":
                menuOptions = menuOptions.concat(emp);
                break;
            case "adminIT":
                menuOptions = menuOptions.concat(adminIT);
                break;
            case "uBoss":
                menuOptions = menuOptions.concat(uBoss);
                break;
            case "adminR":
                menuOptions = menuOptions.concat(adminR);
                break;
            case "adminTrans":
                menuOptions = menuOptions.concat(adminTrans);
                break;
            case "adminV":
                menuOptions = menuOptions.concat(adminV);
                break;
            case "unitC":
                menuOptions = menuOptions.concat(unitC);
                break;
            case "dminV":
                break;
        }
    }

    //Convierte el set de datos en arreglo. Necesario apra eliminar cualquier valor repetido
    menuOptions = [...new Set(menuOptions)];

    for (var r in menuOptions) {
        console.log(menuOptions[r]);
        $("#menu_container").append(menuOptions[r]);
    }

}
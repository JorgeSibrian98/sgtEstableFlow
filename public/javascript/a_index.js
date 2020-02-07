/* const home = "<a href=\"/home\" class=\"item\"><i class=\"home icon\"></i>Home</a>";
const folo6 = "<a href=\"/solicitud_nueva\" class=\"item\"><i class=\"file alternate icon\"></i>Folo 6</a>";
const aprobarFolos = "<a href =\"/panel_de_aprobacion\" class=\"item\"><i class=\"tasks icon\"></i>Aprobar Folos</a></i>";
const flotaVehicular = "<a href=\"/vehiculos\" class=\"item\"><i class=\"car side icon\"></i>Flota Vehicular</a>";
const vale = "<a href=\"/vales\" class=\"item\"><i class=\"gas pump icon\"></i>Vales</a>";
const adminFplaces = "<a href=\"/lugares_frecuentes\" class=\"item\"><i class=\"map marked alternate icon\"></i>Administrar<br>Lugares Frecuentes</a>";
const aprobarReq = "<a href=\"/nuevos_requerimientos\" class=\"item\"><i class=\"tasks icon\"></i>Aprobar requerimientos</a>";
const adminPro = "<a href=\"/instituciones\" class=\"item\"><i class=\"building outline icon\"></i>Administrar<br>Procuradurías</a>";
const rutas = "<a href=\"/rutas\" class=\"item\"><i class=\"route icon\"></i>Rutas</a>";
const calConfig = "<a href=\"/configuracion_calendario\" class=\"item\"><i class=\"inverted corner settings icon\"></i>Calendario de rutas</a>";
const asignarVal = "<a href=\"/asignar_recursos/vales\" class=\"item\"><i class=\"gas pump icon\"></i>Asignar Vales</a>";
const motorista = "<a href=\"/motoristas\" class=\"item\"><i class=\"address card outline icon\"></i>Motoristas</a>";
const controlRuta = "<a href=\"/asignar_motorista\" class=\"item\"><i class=\"clipboard outline icon\"></i>Control de ruta</a>";
const mision = "<a href=\"/misiones\" class=\"item\"><i class=\"flag outline icon\"></i>Misiones</a>";
const ussuarios = "<a href=\"/usuarios\" class=\"item\"><i class=\"user tie icon\"></i>Usuarios</a>"; */

$(function () {
    $('.ui.sidebar')
        .sidebar({
            //overflow: hidden
            context: $('.ui.container'),
        })
        .sidebar('attach events', '#menu');

    $('#user_menu #user')
        .popup({
            inline: true,
            hoverable: true,
            position: 'bottom center',
            delay: {
                show: 300,
                hide: 800
            }
        });

});
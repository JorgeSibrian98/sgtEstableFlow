const Route = require('../models/m_route');
const route_conditions = require('../models/m_route_conditions');
const Sequelize = require('sequelize');
const {
  validationResult
} = require('express-validator');
const querystring = require('querystring');

class Route_controller {
  constructor() { }

  async getRouteList() {
    return await Route.findAll({
      order: Sequelize.literal('id ASC')
    });
  }


  //Gets routes list
  async getRouteList(req, res) {
    try {
      var Routes = await Route.findAll({
        order: Sequelize.literal('id ASC')
      });
      return Routes
    } catch (error) {
      console.log(error);
    }
  };

  //Gets routes list
  async getList(req, res) {
    try {
      var Rutas = await Route.findAll();
      return res.render('../views/route/list.html', {
        Rutas
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Muestra formulario para creación/edición
  async getGestionar(req, res) {
    try {
      //Si viene del ícono de edición se recupera el id.
      let route_id = req.query.route_id;
      if (route_id) {
        let Ruta = await Route.findByPk(route_id); //Se obtiene la ruta con el id provisto
        //Se obtienen las condiciones relacionadas con la ruta obtenida
        let Condiciones = await route_conditions.findOne({
          where: {
            IDRuta: Ruta.IDRuta
          }
        });
        console.log(Ruta);
        console.log(Condiciones);
        return res.render('../views/route/add.html', {
          Ruta,
          Condiciones
        }); //Renderiza formulario editar
      } else {
        return res.render('../views/route/add.html'); //Renderiza formulario agregar
      };
    } catch (error) {
      console.log(error);
    };
  };

  //Saves the new route in the DB.
  async createRoute(req, res) {
    try {
      //Se llena variable con los resultados de la validación
      const errors = validationResult(req);
      let {
        name,
        monday,
        monday_frequency,
        tuesday,
        tuesday_frequency,
        wednesday,
        wednesday_frequency,
        thursday,
        thursday_frequency,
        friday,
        friday_frequency,
        saturday,
        saturday_frequency,
        sunday,
        sunday_frequency,
        enabled
      } = req.body; //Se obtienen variables del cuerpo de la petición
      console.log(req.body);
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new route in the DB.
        res.render('../views/route/add.html', {
          name,
          errors: errors.array()
        });
      } else {
        console.log(req.body); //Impresión del cuerpo de la petición
        //Guardado en BD de la ruta estándar
        var ruta = await Route.create({
          Nombre: name,
          Habilitado: enabled,
        });
        //Guardado en la BD de las condiciones de la ruta
        var conditions = await route_conditions.create({
          Lunes: monday,
          CantidadMotoristasLunes: monday_frequency,
          Martes: tuesday,
          CantidadMotoristasMartes: tuesday_frequency,
          Miercoles: wednesday,
          CantidadMotoristasMiercoles: wednesday_frequency,
          Jueves: thursday,
          CantidadMotoristasJueves: thursday_frequency,
          Viernes: friday,
          CantidadMotoristasViernes: friday_frequency,
          Sabado: saturday,
          CantidadMotoristasSabado: saturday_frequency,
          Domingo: sunday,
          CantidadMotoristasDomingo: sunday_frequency,
          IDRuta: ruta.IDRuta
        });
        console.log(conditions);
        console.log(ruta);
        const query = querystring.stringify({
          success: 'yes'
        });
        res.send({
          redirect: "/rutas?&" + query,
          status: 200
        });
      }
    } catch (error) {
      console.log(error); //Muestra errores si los hubiera.
    };
  };

  //Saves the edited route in the DB.
  async updateRoute(req, res) {
    try {
      //Se llena variable con los resultados de la validación
      const errors = validationResult(req);
      let {
        name,
        monday,
        monday_frequency,
        tuesday,
        tuesday_frequency,
        wednesday,
        wednesday_frequency,
        thursday,
        thursday_frequency,
        friday,
        friday_frequency,
        saturday,
        saturday_frequency,
        sunday,
        sunday_frequency,
        enabled,
        route_id,
        route_conditions_id,
      } = req.body; //Se obtienen variables del cuerpo de la petición
      console.log(req.body);
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new route in the DB.
        let Ruta = await Route.findByPk(route_id);
        let Condiciones = await route_conditions.findByPk(Ruta.route_conditions_id);
        res.render('../views/route/add.html', {
          Ruta,
          Condiciones,
          errors: errors.array()
        });
      } else {
        console.log(req.body); //Impresión del cuerpo de la petición
        //Actualización en la BD de las condiciones de la ruta
        await route_conditions.update({
          Lunes: monday,
          CantidadMotoristasLunes: monday_frequency,
          Martes: tuesday,
          CantidadMotoristasMartes: tuesday_frequency,
          Miercoles: wednesday,
          CantidadMotoristasMiercoles: wednesday_frequency,
          Jueves: thursday,
          CantidadMotoristasJueves: thursday_frequency,
          Viernes: friday,
          CantidadMotoristasViernes: friday_frequency,
          Sabado: saturday,
          CantidadMotoristasSabado: saturday_frequency,
          Domingo: sunday,
          CantidadMotoristasDomingo: sunday_frequency,
        }, {
          where: {
            IDCondicionesRuta: route_conditions_id
          }
        });
        //Actualización en la BD de la ruta estándar
        await Route.update({
          Nombre: name,
          Habilitado: enabled
        }, {
          where: {
            IDRuta: route_id
          }
        });
        const query = querystring.stringify({
          success: 'yes',
          edit: 'yes'
        });
        res.send({
          redirect: "/rutas?&" + query,
          status: 200
        });
      };
    } catch (error) {
      console.log(error); //Muestra errores si los hubiera.
    };
  };

  //Función para verificar que la ruta tenga nombre único.
  async routeNameExists(req, res) {
    try {
      //Se obtiene el valor del campo 'name'
      let name = req.body.name;
      let exists; //Bandera
      //Obtiene solo el campo 'name' de la tabla de rutas en la BD.
      let Rutas = await Route.findAll({
        attributes: ['Nombre']
      });
      /* Itera los nombres obtenidos de la BD y compara cada uno con el nombre que proviene del campo
      en la vista. Si son iguales, se indica en la bandera y se rompe el ciclo. */
      for (var ruta of Rutas) {
        if (name == ruta.name) {
          exists = 'yes';
          break;
        };
      };
      //Se envía la bandera a la vista.
      res.send(exists);
    } catch (error) {
      console.log(error); //Muestra errores si los hay.
    };
  };
};

module.exports = new Route_controller();
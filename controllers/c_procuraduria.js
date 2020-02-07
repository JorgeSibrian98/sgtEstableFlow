const Procuraduria = require('../models/m_procuraduria');
const Address = require('../models/m_address');
const Departamento = require('../controllers/c_department');
const {
  validationResult
} = require('express-validator');
const querystring = require('querystring');

class Procuraduria_controller {
  constructor() { }

  async getGestionar(req, res) {
    try {
      //Editar procu en la misma ruta
      //06102019_DD
      var Procu;
      let procu_id = req.query.procu_id;
      if (procu_id) {
        Procu = await Procuraduria.findByPk(procu_id);
        let Dir = await Address.findByPk(Procu.address_id);
        let detail = Dir.detail;
        let departamento = Dir.department_id;
        let municipio = Dir.city_id;
        let Departamentos = await Departamento.getList();
        return res.render('../views/procuraduria/add.html', {
          Procu,
          detail,
          departamento,
          municipio,
          Departamentos
        });
      } else {
        Procu = await Procuraduria.findByPk(procu_id);
        let Departamentos = await Departamento.getList();
        return res.render('../views/procuraduria/add.html', {
          Departamentos,
          Procu
        });
      };
    } catch (error) {
      console.log(error);
    }
  };

  //Gets procuradurías list
  async getList(req, res) {
    try {
      var Procuradurias = await Procuraduria.findAll();
      return res.render('../views/procuraduria/list.html', {
        Procuradurias
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Saves the new procuraduría in the DB.
  //Última edición: 15/11/2019 - Axel Hernández
  async createProcuraduria(req, res) {
    try {
      const errors = validationResult(req);
      let {
        name,
        detail,
        departamento,
        municipio,
        enabled
      } = req.body;
      //Para enviar si hay error
      //06102019_DD
      var Procu = req.body;
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the new Address
        res.render('../views/procuraduria/add.html', {
          Procu,
          errors: errors.array()
        });
      } else {
        console.log(req.body);
        var dir = await Address.create({
          detail,
          city_id: municipio,
          department_id: departamento
        });
        Procuraduria.create({
          name,
          enabled,
          address_id: dir.id
        });
        const query = querystring.stringify({
          success: 'yes'
        });
        res.send({
          redirect: "/instituciones?&" + query,
          status: 200
        });
      }
    } catch (error) {
      console.log(error);
    };
  };

  //Saves the edited procuraduria in the DB
  async updateProcuraduria(req, res) {
    try {
      const errors = validationResult(req);
      let {
        procu_id,
        name,
        detail,
        departamento,
        municipio,
        enabled
      } = req.body;
      let Procu = await Procuraduria.findByPk(procu_id);
      console.log(errors.array());
      if (!errors.isEmpty()) {
        //If there are errors, renders the same form, otherwise saves the edited Address
        res.render('../views/procuraduria/add.html', {
          Procu,
          errors: errors.array()
        });
      } else {
        console.log(req.body);
        Address.update({
          detail,
          city_id: municipio,
          department_id: departamento
        }, {
          where: {
            id: Procu.address_id
          },
        });
        Procuraduria.update({
          name,
          enabled
        }, {
          where: {
            id: procu_id
          }
        });
        const query = querystring.stringify({
          success: 'yes',
          edit: 'yes'
        });
        res.send({
          redirect: "/instituciones?&" + query,
          status: 200
        });
      };
    } catch (error) {
      console.log(error);
    }
  };

  //Función para verificar que la ruta tenga nombre único.
  async procuNameExists(req, res) {
    try {
      //Se obtiene el valor del campo 'name'
      let name = req.body.name;
      let exists; //Bandera
      //Obtiene solo el campo 'name' de la tabla de rutas en la BD.
      let Procus = await Procuraduria.findAll({
        attributes: ['name']
      });
      /* Itera los nombres obtenidos de la BD y compara cada uno con el nombre que proviene del campo
      en la vista. Si son iguales, se indica en la bandera y se rompe el ciclo. */
      for (var procu of Procus) {
        if (name == procu.name) {
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

module.exports = new Procuraduria_controller();
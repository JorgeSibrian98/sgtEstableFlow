const Address = require('../models/m_direccion');
//const place_container = require('../models/m_places_container');
const UbicacionesGeograficas = require('../models/m_ubicaciones_geograficas');

//Manejo de fechas
var moment = require('moment');
moment.locale("Es-SV")

const {
  validationResult
} = require('express-validator');

class address_services {
  constructor() {}

  //Gets Departments List
  async getDepartmentList(req, res) {
    try {
      let Departamentos = await UbicacionesGeograficas.findAll({
        attributes: ['CodigoUbicacionGeografica', 'NombreUbicacionGeografica'],
        where: {
          CodigoUbicacionGeograficaSuperior: 'ES'
        }
      });
      return res.render('../views/direccion/add.html', {
        Departamentos
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Gets Municipios list based on the selected department
  async getMunicipiosByDepartamento(req, res) {
    try {
      let selectedDepartamento = req.query.selectedDepartamento;
      let municipios = await UbicacionesGeograficas.findAll({
        attributes: ['CodigoUbicacionGeografica', 'NombreUbicacionGeografica'],
        where: {
          CodigoUbicacionGeograficaSuperior: selectedDepartamento
        }
      });
      res.send(municipios);
    } catch (error) {
      console.log(error);
    }
  };

  //Saves the new address in the DB.
  async createAddress(req, res) {
    try {
      var container;
      console.log("ID DEL LUGAR FRECUENTE" + req.query.fplace_id)
      let dir; //Creo variable que contendrá el objeto Dirección
      //Si no es lugar frecuete se crea la direccion de lo contrario se enlazará el id del lugar frecuente con el folo en la tabla place_container
      if (!req.query.fplace_id) {
        let {
          idSelDepto,
          idSelMun,
          selectedPlace,
          destinyPlace,
          direction,
          selectedPlaceTxt
        } = req.body //Saco los atributos del cuerpo de la petición
        console.log(req.body); //Imprimo la petición para comprobar los datos.
        if (req.query.folo_id) {
          container = await place_container.create({
            folo_id: req.query.folo_id,
            date_of_visit: moment(),
          });

          // guardará depto y municipio del dropdown; nombre y dirección de los inputs.
          console.log("GUARDAR DIRECCION con el contenedor" + container.id)
          dir = await Address.create({
            Nombre: destinyPlace,
            Detalle: direction, //Creo dirección
            Cod_mun: idSelMun,
            Cod_depto: idSelDepto,
            container_id: container.id
          });
        } else {
          // guardará depto y municipio del dropdown; nombre y dirección de los inputs.
          console.log("GUARDAR DIRECCION sn contenedor")
          dir = await Address.create({
            Nombre: destinyPlace,
            Detalle: direction, //Creo dirección
            Cod_mun: idSelMun,
            Cod_depto: idSelDepto,
          });
        }
      } else {
        console.log("LUGAR FRECUENTE")
        if (req.query.folo_id) {
          await place_container.create({
            folo_id: req.query.folo_id,
            date_of_visit: moment(),
            frequent_place_id: req.query.fplace_id
          });
        }
      }
      res.send(dir); //Envío la dirección creada a la vista.
    } catch (error) {
      console.log(error); //Muestra errores.
    };
  };

  //Elimina la dirección creada a través del ícono en la tabla.
  async deleteAddress(req, res) {
    try {
      let {
        id_address
      } = req.body; //Se obtiene el parámetro del cuerpo de la petición.
      console.log("Eliminara la dirección" + id_address)
      var address = await Address.findByPk(id_address);
      console.log("contenedor" + address.container_id)
      await place_container.destroy({ //Eliminación de la dirección.
        where: {
          id: address.container_id,
        }
      });
      await Address.destroy({ //Eliminación de la dirección.
        where: {
          IDDireccion: id_address,
        }
      });
    } catch (error) {
      console.log(error); //Mensaje de error si lo hubiera.
    };
  };

  //Elimina todas las direcciones creadas al salir del Folo6.
  async deleteAddressList(req, res) {
    try {
      //Parseo del cuerpo de la petición para poder leer el array enviado dentro de él.
      req.body = JSON.parse(JSON.stringify(req.body));
      //Recorrido del cuerpo de la petición
      for (var key in req.body) {
        //Sin el parseo no es posible ejecutar el método dentro del if.
        if (req.body.hasOwnProperty(key)) {
          let value = req.body[key];
          await Address.destroy({ //Eliminación de las direcciones.
            where: {
              IDDireccion: value,
            }
          });
          console.log('Se eliminó la dirección con el id ' + value); //Mensaje de éxito.
        };
      };
    } catch (error) {
      console.log(error); //Mensaje de error si lo hubiera.
    };
  };
};

module.exports = new address_services();
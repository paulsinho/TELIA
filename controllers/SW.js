/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var models = require('./../models');
var Actor = models.actor;
var Persona = models.persona;
var Reserva = models.reserva;

class Sw {
    obtenerListaTodos(req, res) {
        Persona.findAll().then(function (lista) {
            console.log("HOLA ++++++++++++++++++");
            res.status(200).json(lista);
        })
    }

    cambiarEstado(req, res) {
        var external = req.params.codigo;
        Reserva.findOne({ where: { external_id: external } }).then(function (reserv) {
            if (reserv.estado) {
                reserv.update({ estado: 0 }).then(function (reservaUpdate) {
                    console.log('AQUI++++++++++++++++  ' + reserv.estado)
                    if (reservaUpdate) {
                        console.log("LO logramos amigos");
                        res.status(200).json({ estado: reserv.estado });
                    }
                });
            } else {
                reserv.update({ estado: 1 }).then(function (reservaUpdate) {
                    console.log('AQUI++++++++++++++++  ' + reserv.estado)
                    if (reservaUpdate) {
                        console.log("LO logramos amigos");
                        res.status(200).json({ estado: reserv.estado });
                    }
                });
            }
        })







    }
}

module.exports = Sw;

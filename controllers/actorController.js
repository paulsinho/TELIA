

'use strict';
var models = require('./../models');
var Actor = models.actor;
var Persona = models.persona;
var Cuenta = models.cuenta;
var Rol = models.rol;
const uuidv4 = require('uuid/v4');
var bCrypt = require('bcrypt-nodejs');
var forEach = require('sync-each');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('teatrodb', 'PortusN', '1234', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    // SQLite only
    storage: 'path/to/database.sqlite',

    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
});

//INSTALAR ESTAS DEPENDENCIAS
//var fs = require('fs');
//var maxFileSize = 1 * 1024 * 1024;
//var extensiones = ["jpg", "png"];
//var formidable = require('formidable');

class home {
    verRegActor(req, res) {
        var rol = req.user.rol;
        sequelize.query("select actor.desActor, actor.external_id ,persona.foto, persona.nombre,persona.sexo, persona.fecha_Nac, actor.años_Exp,'true'as directoR from persona inner join actor where actor.id_actor = persona.idPersona", { type: Sequelize.QueryTypes.SELECT })
            .then(function (actors) {
                if (req.isAuthenticated()) {
                    if (req.user.rolN === 'director') {
                        res.render('fragmentos/rolPrincipal', {
                            titulo: 'Telia',
                            regActor: 'registro/registrarActor',
                            view: 'esRegActor',
                            navRol: 'menu/navRol',
                            rol: rol,
                            actores: actors
                        });
                    } else {
                        res.redirect('/');
                    }
                } else {
                    res.redirect('/');
                }
            });
    }

    agregarActor(req, res) {
        var correo = req.body.correo;
        var clave = req.body.clave;
        var generateHash = function (clave) {
            return bCrypt.hashSync(clave, bCrypt.genSaltSync(8), null);
        };
        Cuenta.findOne({
            where: {
                correo: correo
            }
        }).then(function (cuenta) {
            if (cuenta) {
                res.redirect('/agregarActor');
            } else {
                var userPassword = generateHash(clave);
                Rol.findOne({
                    where: { nombre: 'director' }
                }).then(function (rol) {
                    if (rol) {
                        var dataPersona =
                        {
                            apellido: req.body.apellido,
                            nombre: req.body.nombre,
                            cedula: req.body.cedula,
                            telefono: req.body.telefono,
                            direccion: req.body.direccion,
                            id_rol: req.body.idRol,
                            foto: 'galeria/images/fotosPersona/usuarioPerfil.jpg',
                            sexo: req.body.sexo,
                            external_id: uuidv4(),
                            fecha_Nac: req.body.fechaNac
                        };
                        Persona.create(dataPersona).then(function (newPersona, created) {
                            if (!newPersona) {
                            }
                            if (newPersona) {
                                var dataActor = {
                                    años_Exp: req.body.añosExperiencia,
                                    external_id: newPersona.external_id,
                                    id_actor: newPersona.idPersona,
                                    isDirector: false,
                                    desActor: 'El Actor aun no ingresa su Descripcion'
                                };
                                Actor.create(dataActor).then(function (newActor, created) {
                                    if (newActor) {
                                        var dataCuenta = {
                                            correo: correo,
                                            clave: userPassword,
                                            id_persona: newPersona.idPersona,
                                            external_id: uuidv4()
                                        };
                                        Cuenta.create(dataCuenta).then(function (newCuenta, created) {
                                            if (newCuenta) {
                                                //   return done(null, newCuenta);
                                                res.redirect('/inicioSesion');
                                            }
                                            if (!newCuenta) {
                                                console.log("cuenta no se pudo crear");
                                                //borrar persona
                                                //                                                return done(null, false, {
                                                //                                                    //     message: req.flash('error_registro', 'La Cuenta no se puedo Crear')
                                                //                                                });
                                                res.redirect('/agregarActor');
                                            }

                                        });
                                    }
                                    if (!newPersona) {
                                        console.log("cuenta no se pudo crear");
                                        //borrar persona
                                    }

                                });
                            }
                        });
                    } else {
                        console.log('Rol No Existe');

                    }
                });
            }
        });
    }

    listarActor(req, res) {
        if (req.isAuthenticated()) {
            // if (req.user.rolN == 'director') {
            var rol = req.user.rol;
            sequelize.query("select actor.desActor, actor.external_id ,persona.foto, persona.nombre,persona.apellido,persona.sexo,persona.fecha_Nac, actor.años_Exp,'true'as directoR from persona inner join actor where actor.id_actor = persona.idPersona", { type: Sequelize.QueryTypes.SELECT })
                .then(function (actors) {
                    if (req.isAuthenticated()) {
                        res.render('fragmentos/rolPrincipal', {
                            titulo: 'Telia',
                            listarActor: 'listar/listarActor',
                            view: 'eslistarActor',
                            navRol: 'menu/navRol',
                            rol: rol,
                            lista: actors
                        });
                    } else {
                        res.redirect('/');
                    }
                });
            // } else {
            //     sequelize.query("select actor.desActor,persona.foto, persona.nombre,persona.sexo,persona.fecha_Nac,actor.años_Exp from persona inner join actor where actor.id_actor = persona.idPersona", { type: Sequelize.QueryTypes.SELECT })
            //         .then(function (actors) {
            //             var rol = req.user.rol;
            //             switch (rol) {
            //                 case 1:
            //                     res.render('fragmentos/rolPrincipal',
            //                         {
            //                             titulo: "TELIA",
            //                             actores: actors,
            //                             usuario: true
            //                         });
            //                     break;
            //                 case 3:
            //                     res.render('actores',
            //                         {
            //                             titulo: "TELIA",
            //                             actores: actors,
            //                             asistente: true
            //                         });
            //                     break;
            //                 case 4:
            //                     res.render('actores',
            //                         {
            //                             titulo: "TELIA",
            //                             actores: actors,
            //                             productor: true
            //                         });
            //                     break;
            //                 case 5:
            //                     res.render('actores',
            //                         {
            //                             titulo: "TELIA",
            //                             actores: actors,
            //                             actor: true
            //                         });
            //                     break;
            //             }
            //         });
            // }
        } else {
            res.redirect('/');
        }
    }

    actualizarActor(req, res) {
        Persona.update({
            nombre: req.body.nombre,
            cedula: req.body.cedula,
            apellido: req.body.apellido,
            fecha_Nac: req.body.fechaNac,
            direccion: req.body.direccion,
            telefono: req.body.telefono,
            rol: req.body.rol
        }, { where: { external_id: req.body.external } }).then(function (updatedPersona, created) {
            Actor.update({
                desActor: req.body.descripcion
            }, { where: { id_actor: req.body.person } }).then(function (updatedActor, created) {
                if (updatedActor) {
                    res.redirect('/perfil');
                } else {
                    console.log('NO SE PUDO ACTUALIZAR ACTOR');
                    res.redirect('/');
                }
            });
        });
    }

    verEditActor(req, res) {
        if (req.isAuthenticated()) {
            Actor.findOne({ where: { external_id: req.params.externalX } }).then(actor => {
                Persona.findOne({ where: { idPersona: actor.id_actor } }).then(persona => {
                    if (req.user.rolN === 'director') {
                        res.render('fragmentos/rolPrincipal', {
                            titulo: 'Editar Actor',
                            editActor: 'editar/editarActor',
                            view: 'esEditActor',
                            navRol: 'menu/navRol',
                            rol: req.user.rol,
                            actores: actor,
                            persona: persona
                        });
                    } else {
                        res.redirect('/verActores');
                    }
                });
            });
        } else {
            res.redirect('/');
        }
    }
}


module.exports = home;




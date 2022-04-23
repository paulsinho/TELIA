var models = require('./../models');
var Persona = models.persona;
var Cuenta = models.cuenta;
var Actor = models.actor;

'use strict';
class CuentaController {
    verLogin(req, res) {
        if (!req.isAuthenticated()) {
            var esinicio = true;
            res.render('inicioSesion', {
                esinicio: true,
                esregUsuario: false
            });
        } else {
            res.redirect('/');
        }
    }

    verRegistro(req, res) {
        if (!req.isAuthenticated()) {
            var esregUsuario = true;
            res.render('inicioSesion', {
                titulo: 'Telia',
                esinicio: false,
                esregUsuario: true
            });
        } else {
            res.redirect('/');
        }
    }

    cerrar(req, res) {
        req.session.destroy();
        res.redirect("/");
    }

    verPerfil(req, res) {
        if (req.isAuthenticated()) {
            var rol = req.user.rol;
            var nombre = req.user.nom;
            var multimedia = req.user.foto;
            Persona.findOne({ where: { external_id: req.user.id_persona } }).then(function (persona) {
                console.log('El rol de esta cuenta es ' + req.user.rolN + '======');
                Actor.findOne({ where: { id_actor: req.user.idPersona } }).then(function (actor) {
                    if (rol === 1) {
                        res.render('fragmentos/rolPrincipal', {
                            titulo: "TELIA",
                            view: 'perfil',
                            perfil: 'perfil',
                            navRol: 'menu/navRol',
                            rol: req.user.rol,
                            footer: 'footerX',
                            per: persona
                        });
                    } else {
                        res.render('fragmentos/rolPrincipal', {
                            titulo: "TELIA",
                            view: 'perfil',
                            perfil: 'perfil',
                            navRol: 'menu/navRol',
                            rol: req.user.rol,
                            rolN: req.user.rolN,
                            footer: 'footerX',
                            per: persona,
                            actor: actor
                        });
                    }
                });
            });
        } else {
            res.redirect('/');
        }
    }

    bajarCuenta(req, res) {
        if (req.isAuthenticated()) {
            Persona.update({
                id_rol: 1
            }, { where: { idPersona: req.body.personX } }).then(function (updatedPerson, created) {
                if (updatedPerson) {
                    Actor.destroy({ where: { id_actor: req.body.personX } }).then(function () {
                    });
                    res.redirect('/verActores');
                } else {
                    console.log('error, no se pudo actualizar');
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    }
}

module.exports = CuentaController;




'use strict';
var models = require('./../models');
const uuidv4 = require('uuid/v4');
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
const { Op } = require('sequelize')
var fs = require('fs');
var maxFileSize = 200 * 1024 * 1024;
var extensiones = ["jpg", "png"];
var formidable = require('formidable');
var Obra = models.obra;
var Actor = models.actor;
var Persona = models.persona;
var Multimedia = models.multimedia;
var moment = require('moment');
var fechaHoy = moment().format('YYYY[-]MM[-]DD');
class home {
    verRegObra(req, res) {
        if (req.isAuthenticated()) {
            if (req.user.rolN === 'asistente') {
                var rol = req.user.rol;
                res.render('fragmentos/rolPrincipal', {
                    titulo: 'Telia',
                    regObra: 'registro/registrarObra',
                    view: 'esRegObra',
                    navRol: 'menu/navRol',
                    rol: rol
                });
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    }

    registrarObra(req, res) {
        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.parse(req, function (err, fields, files) {
            if (fields.multimedia == 1) {//video
                Obra.create({
                    external_id: uuidv4(),
                    nombre: fields.nombre,
                    multimedia: fields.video,
                    desc: fields.descripcion,
                    genero: fields.genero,
                    autor: fields.autor,
                    fechaEstreno: fields.fecha,
                    lugarEstreno: fields.lugar,
                    horaEstreno: fields.hora,
                    precioBoleto: fields.precio,
                    esVideo: 1
                }).then(function (newObra, created) {
                    if (newObra) {
                        console.log('tu noticia se ha registrado correctamente');
                        Multimedia.create({
                            external_id: uuidv4(),
                            titulo: fields.nombre,
                            desc: 'OBRA',
                            archivo: fields.video,
                            esVideo: 1,
                            id_obra: newObra.idObra
                        }).then(function (newMultimedia, created) {
                            if (newMultimedia) {
                                console.log('Tu Imagen se ha registrado correctamente');
                                res.redirect('/');
                            } else {
                                console.log("ERROR - No se pudo ingresar multimedia");
                                res.redirect('404');
                            }
                        });
                    } else {
                        console.log("ERROR - No se pudo ingresar multimedia");
                        res.redirect('/agregarObra');
                    }
                });
            } else {
                if (files.archivo.size <= maxFileSize) {
                    var extension = files.archivo.name.split(".").pop().toLowerCase();
                    if (extensiones.includes(extension)) {
                        var nombre = files.archivo.name;
                        fs.rename(files.archivo.path, "public/galeria/images/fotosGaleria/" + nombre, function (err) {
                            if (err) {
                                next(err);
                                console.log("error al subir la foto :/");
                            }
                            Obra.create({
                                external_id: uuidv4(),
                                nombre: fields.nombre,
                                multimedia: "galeria/images/fotosGaleria/" + files.archivo.name,
                                desc: fields.descripcion,
                                genero: fields.genero,
                                autor: fields.autor,
                                fechaEstreno: fields.fecha,
                                lugarEstreno: fields.lugar,
                                horaEstreno: fields.hora,
                                precioBoleto: fields.precio,
                                esVideo: 0
                            }).then(function (newObra, created) {
                                if (newObra) {
                                    console.log('tu obra se ha registrado correctamente');
                                    Multimedia.create({
                                        external_id: uuidv4(),
                                        titulo: fields.nombre,
                                        desc: 'OBRA',
                                        archivo: "galeria/images/fotosGaleria/" + files.archivo.name,
                                        esVideo: 0,
                                        id_obra: newObra.idObra
                                    }).then(function (newMultimedia, created) {
                                        if (newMultimedia) {
                                            console.log('Tu Imagen se ha registrado correctamente');
                                            res.redirect('/');
                                        } else {
                                            console.log("ERROR - No se pudo ingresar multimedia");
                                            res.redirect('404');
                                        }
                                    });
                                } else {
                                    console.log("ERROR - No se pudo ingresar multimedia");
                                    res.redirect('/agregarObra');
                                }
                            });
                        });
                    } else {
                        home.eliminar(files.archivo.path);
                        req.flash('error', 'Error de extension', false);
                        res.redirect('/agregarNoticia');
                        console.log("error de extension");
                    }
                } else {
                    home.eliminar(files.archivo.path);
                    req.flash('error', 'Error de tamanio se admite ' + maxFileSize, false);
                    res.redirect('/agregarObra');
                    console.log("error de tamanio solo se adminte " + maxFileSize);
                }
            }
        });
    }

    static eliminar(link) {
        fs.exists(link, function (exists) {
            if (exists) {
                console.log('Borrando ahora ...');
                fs.unlinkSync(link);
            } else {
                console.log('No se borro - no existe archivo ' + link);
            }
        });
    }

    verObra(req, res) {
        if (req.isAuthenticated()) {
            Obra.findAll({}).then(function (obras) {
                var rol = req.user.rol;
                res.render('fragmentos/rolPrincipal',
                    {
                        titulo: "TELIA",
                        lista: obras,
                        view: 'eslistarObra',
                        navRol: 'menu/navRol',
                        rol: rol,
                        listarObra: 'listar/listarObra',
                    });
            }).catch(function (err) {
                console.log("Error:", err);
                req.flash('error', 'Hubo un error');
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    }

    verEditObra(req, res) {
        Obra.findOne({ where: { external_id: req.params.external } }).then(function (obr) {
            if (req.isAuthenticated()) {
                if (req.user.rolN === 'asistente') {
                    res.render('fragmentos/rolPrincipal', {
                        titulo: 'Editar Obra',
                        editObra: 'editar/editarObra',
                        view: 'esEditObra',
                        navRol: 'menu/navRol',
                        rol: req.user.rol,
                        obra: obr
                    });
                } else {
                    res.redirect('/obras');
                }
            } else {
                res.redirect('/obras');
            }
        }).catch(function (err) {
            console.log("Error:", err);
            req.flash('error', 'Hubo un error');
            res.redirect('/');
        });
    }

    actualizarObra(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {

            if (fields.multimedia == 1) {//video
                Obra.update({
                    nombre: fields.titulo,
                    multimedia: fields.video,
                    desc: fields.descripcion,
                    esVideo: 1,
                    genero: fields.genero,
                    autor: fields.autor,
                    fechaEstreno: fields.fecha,
                    lugarEstreno: fields.lugar,
                    horaEstreno: fields.hora,
                    precioBoleto: fields.precio
                }, { where: { external_id: fields.external } }).then(function (updatedNoticia, created) {
                    if (updatedNoticia) {
                        console.log('tu noticia se ha registrado correctamente');
                        Multimedia.update({
                            esVideo: 1
                        }, { where: { id_obra: fields.idObra } }).then(function (updateMultimedia, created) {
                            if (updateMultimedia) {
                                console.log('Tu Imagen se ha registrado correctamente');
                                res.redirect('/obras');
                            } else {
                                console.log("ERROR - No se pudo ingresar multimedia");
                                res.redirect('404');
                            }
                        });
                    } else {
                        console.log("ERROR - No se pudo ingresar multimedia");
                        res.redirect('/');
                    }
                });
            } else if (fields.multimedia == 0) {
                if (files.archivo.size <= maxFileSize) {
                    var extension = files.archivo.name.split(".").pop().toLowerCase();
                    if (extensiones.includes(extension)) {
                        var nombre = files.archivo.name;
                        fs.rename(files.archivo.path, "public/galeria/images/fotosGaleria/" + nombre, function (err) {
                            if (err) {
                                next(err);
                                console.log("error al subir la foto :/");
                            }
                            Obra.update({
                                nombre: fields.titulo,
                                multimedia: "galeria/images/fotosGaleria/" + files.archivo.name,
                                desc: fields.descripcion,
                                esVideo: 0,
                                genero: fields.genero,
                                autor: fields.autor,
                                fechaEstreno: fields.fecha,
                                lugarEstreno: fields.lugar,
                                horaEstreno: fields.hora,
                                precioBoleto: fields.precio
                            }, { where: { external_id: fields.external } }).then(function (updatedNoticia, created) {
                                if (updatedNoticia) {
                                    console.log('tu noticia se ha registrado correctamente');
                                    Multimedia.update({
                                        titulo: fields.titulo,
                                        archivo: "images/fotosGaleria/" + files.archivo.name,
                                        esVideo: 0
                                    }, { where: { id_obra: fields.idObra } }).then(function (updateMultimedia, created) {
                                        if (updateMultimedia) {
                                            console.log('Tu Imagen se ha registrado correctamente');
                                            res.redirect('/obras');
                                        } else {
                                            console.log("ERROR - No se pudo ingresar multimedia");
                                            res.redirect('404');
                                        }
                                    });
                                } else {
                                    console.log("ERROR - No se pudo ingresar multimedia");
                                    res.redirect('/agregarNoticia');
                                }
                            });
                        });
                    } else {
                        home.eliminar(files.archivo.path);
                        req.flash('error', 'Error de extension', false);
                        res.redirect('/editarObra');
                        console.log("error de extension");
                    }
                } else {
                    home.eliminar(files.archivo.path);
                    req.flash('error', 'Error de tamanio se admite ' + maxFileSize, false);
                    res.redirect('/editarObra');
                    console.log("error de tamanio solo se adminte " + maxFileSize);
                }
            } else {
                Obra.update({
                    nombre: fields.titulo,
                    multimedia: fields.multActual,
                    desc: fields.descripcion,
                    genero: fields.genero,
                    autor: fields.autor,
                    fechaEstreno: fields.fecha,
                    lugarEstreno: fields.lugar,
                    horaEstreno: fields.hora,
                    precioBoleto: fields.precio
                }, { where: { external_id: fields.external } }).then(function (updatedNoticia, created) {
                    if (updatedNoticia) {
                        console.log('tu noticia se ha registrado correctamente');
                        Multimedia.update({
                            titulo: fields.titulo
                        }, { where: { id_obra: fields.idObra } }).then(function (updateMultimedia, created) {
                            if (updateMultimedia) {
                                console.log('Tu Imagen se ha registrado correctamente');
                                res.redirect('/obras');
                            } else {
                                console.log("ERROR - No se pudo ingresar multimedia");
                                res.redirect('404');
                            }
                        });
                    } else {
                        console.log("ERROR - No se pudo ingresar multimedia");
                        res.redirect('/');
                    }
                });
            }
        });
    }

    obtenerObra() {

        Obra.findAll({
            where: {
                fecha: {
                    [Op.gte]: moment().subtract(7, 'days').toDate()
                }
            }
        });
    }
}

module.exports = home;







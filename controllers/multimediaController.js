

'use strict';
var models = require('./../models');
const uuidv4 = require('uuid/v4');
//INSTALAR ESTAS DEPENDENCIAS
var fs = require('fs');
var maxFileSize = 200 * 1024 * 1024;
var extensiones = ["jpg", "png"];
var formidable = require('formidable');

var Multimedia = models.multimedia;

class multimediaController {
    verGaleria(req, res) {
        Multimedia.findAll({where: {esVideo: 0}}).then(function (imagenes) {
            if (req.isAuthenticated()) {
                var rol = req.user.rol;
                console.log('===========CTM========', rol);
                res.render('fragmentos/galeria/galeriaR', {
                    titulo: 'Telia',
                    navRol: '../menu/navRol',
                    rol: rol,
                    footer: 'footerX',
                    images: imagenes,
                    cont: 0,
                    ban: 1
                });
            } else {
                res.redirect('/');
            }
        }).catch(function (err) {
            console.log("Error:", err);
            //req.flash('error', 'Hubo un error');
            res.redirect('404');
        });
    }

    guardarImagenGaleria(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (files.archivo.size <= maxFileSize) {
                var extension = files.archivo.name.split(".").pop().toLowerCase();
                if (extensiones.includes(extension)) {
                    var nombre = files.archivo.name;
                    fs.rename(files.archivo.path, "public/galeria/images/fotosGaleria/" + nombre, function (err) {
                        if (err) {
                            next(err);
                            console.log("error CTM");
                        }
                        Multimedia.create({
                            external_id: uuidv4(),
                            titulo: fields.titulo,
                            desc: fields.desc,
                            archivo: "galeria/images/fotosGaleria/" + files.archivo.name,
                            esVideo: 0
                        }).then(function (newMultimedia, created) {
                            if (newMultimedia) {
                                console.log('Tu Imagen se ha registrado correctamente');
                                res.redirect('/galeria');
                            } else {
                                console.log("ERROR - No se pudo ingresar multimedia");
                                res.redirect('404');
                            }
                        });
                    });
                } else {
                    multimediaController.eliminar(files.archivo.path);
                    req.flash('error', 'Error de extension', false);
                    res.redirect('/galeria');
                    console.log("error de extension");
                }
            } else {
                multimediaController.eliminar(files.archivo.path);
                req.flash('error', 'Error de tamanio se admite ' + maxFileSize, false);
                res.redirect('/galeria');
                console.log("error de tamanio solo se adminte " + maxFileSize);
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
}

module.exports = multimediaController;







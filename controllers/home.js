'use strict';
var models = require('./../models');
var Multimedia = models.multimedia;

class home {

    verPrincipal(req, res) {
        // require('./init/init'); <3
        Multimedia.findAll({where: {esVideo: 0}}).then(function (imagenes) {
            if (req.isAuthenticated()) {
                var rol = req.user.rol;
                console.log('//////////////////////////////////');
                console.log('-----------' + rol + '----------');
                console.log('-----------' + req.user.rolN + '----------');
                console.log('//////////////////////////////////');
                res.render('fragmentos/rolPrincipal', {
                    titulo: 'Telia',
                    images: imagenes,
                    footer: 'fragmentos/footer',
                    rol: rol,
                    navRol: 'menu/navRol',
                    view: 'home',
                    homeGeneral: 'homeGeneral'
                });
            } else {
                res.render('home', {
                    titulo: 'Telia',
                    nav: 'fragmentos/menu/nav',
                    footer: 'fragmentos/footer',
                    gal: 'fragmentos/galeria/galeriaM',
                    images: imagenes
                });
            }
        }).catch(function (err) {
            console.log("Error:", err);
            //req.flash('error', 'Hubo un error');
            res.redirect('404');
        });
    }
}
module.exports = home;
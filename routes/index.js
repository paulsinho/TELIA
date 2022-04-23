var express = require('express');
var router = express.Router();
var passport = require('passport');
var home = require('../controllers/home');
var homeController = new home();
var cuenta = require('../controllers/cuentaController');
var cuentaController = new cuenta();
var actor = require('../controllers/actorController');
var actorController = new actor();
var noticia = require('../controllers/noticiaController');
var noticiaController = new noticia();
var obra = require('../controllers/obraController');
var obraController = new obra();
var reserva = require('../controllers/reservaController');
var reservaController = new reserva();
var multi = require('../controllers/multimediaController');
var multimediaController = new multi();
var persona = require('../controllers/personaController');
var personaController = new persona();
var correo = require('../controllers/mailController');
var mailController = new correo();
var reporte = require('../controllers/reporteController');
var reporteController = new reporte();

/*Servicio WEB*/
var sw = require('../controllers/SW');
var SW = new sw();




/**
 * Middleware Inicio de Sesion
 *
 * @section Usuario
 * @type post
 * @url /inicioSesion/entrar
 */
router.post('/inicioSesion/entrar',
    passport.authenticate('local-signin', {
        successRedirect: '/',
        failureRedirect: '/inicioSesion',
        failureFlash: true
    }));

//PERSONA
/**
 * Perfil del Usuario
 *
 * @section Usuario
 * @type get
 * @url /perfil
 */
router.get('/perfil', cuentaController.verPerfil);
/**
 * Actualizar los Datos del usuario
 *
 * @section Usuario
 * @type post
 * @url /actualizarUsuarior
 */
router.post('/actualizarUsuario', personaController.actualizarPersona);
/**
 * Actualiza  foto de Perfil
 *
 * @section Usuario
 * @type post
 * @url /actualizarfotoUsuario
 */
router.post('/actualizarfotoUsuario', personaController.cambiarFoto);


//Cuenta
/**
 * Muestra vista Principal
 *
 * @section Cuenta
 * @type get
 * @url /
 */
router.get('/', homeController.verPrincipal);
/**
 * Vista de Inicio de Sesion
 *
 * @section Cuenta
 * @type get
 * @url /inicioSesion
 */
router.get('/inicioSesion', cuentaController.verLogin);
/**
 * Da de baja una Cuenta
 *
 * @section Cuenta
 * @type post
 * @url /bajarCuenta
 */
router.post('/bajarCuenta', cuentaController.bajarCuenta);
/**
 * Registro Cuenta
 *
 * @section Cuenta
 * @type post
 * @url /registro/guardar
 */
router.post('/registro/guardar',
    passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/registro'
    }));

//Noticia
/**
 * Vista Registro Noticias
 *
 * @section Noticia
 * @type get
 * @url /agregarNoticia
 */
router.get('/agregarNoticia', noticiaController.verRegNoticia);
/**
 * Vista Noticias
 *
 * @section Noticia
 * @type get
 * @url /noticia
 */
router.get('/noticia', noticiaController.verNoticia);
/**
 * Vista Actualiza Noticia
 *
 * @section Noticia
 * @type get
 * @url /editarNoticia/:external
 */
router.get('/editarNoticia/:external', noticiaController.verEditNoticia);
/**
 * Registro Noticia
 *
 * @section Noticia
 * @type post
 * @url /registro/guardarNoticia
 */
router.post('/registro/guardarNoticia', noticiaController.registrarNoticia);
/**
 * Actualiza Noticia
 *
 * @section Noticia
 * @type post
 * @url /editarNoticia
 */
router.post('/editarNoticia', noticiaController.actualizarNoticia);


//Obra
/**
 * Vista Registro Obra
 *
 * @section Obra
 * @type get
 * @url /agregarObra
 */
router.get('/agregarObra', obraController.verRegObra);
/**
 * Vista Obra
 *
 * @section Obra
 * @type get
 * @url /obras
 */
router.get('/obras', obraController.verObra);
/**
 * Vista Actualizar Obra
 *
 * @section Obra
 * @type get
 * @url /editarObra/:external
 */
router.get('/editarObra/:external', obraController.verEditObra);
/**
 * Vista Registro Obra
 *
 * @section Obra
 * @type post
 * @url /registro/guardarObra
 */
router.post('/registro/guardarObra', obraController.registrarObra);
/**
 * Actualiza Obra
 *
 * @section Obra
 * @type post
 * @url /editarObra
 */
router.post('/editarObra', obraController.actualizarObra);

//actor
/**
 * Vista Registro Actor
 *
 * @section Actor
 * @type get
 * @url /registro
 */
router.get('/registro', cuentaController.verRegistro);
/**
 * Vista Registro Actor
 *
 * @section Actor
 * @type get
 * @url /agregarActor
 */
router.get('/agregarActor', actorController.verRegActor);
/**
 * Cerrar Cuenta
 *
 * @section Cuenta
 * @type get
 * @url /cerrar
 */
router.get('/cerrar', cuentaController.cerrar);
/**
 * Actualizar Actor
 *
 * @section Actor
 * @type post
 * @url /registro/guardarActor
 */
router.post('/registro/guardarActor', actorController.agregarActor);
/**
 * Vista todos los Actores
 *
 * @section Actor
 * @type get
 * @url /verActores
 */
router.get('/verActores', actorController.listarActor);
/**
 * Actualiza Actor
 *
 * @section Actor
 * @type post
 * @url /actualizarActor
 */
router.post('/actualizarActor', actorController.actualizarActor);
/**
 * Vista Atualizar Actor
 *
 * @section Actor
 * @type get
 * @url /editarActor/:externalX
 */
router.get('/editarActor/:externalX', actorController.verEditActor);

//reserva
/**
 * Vista Registro Reserva
 *
 * @section Reserva
 * @type get
 * @url /RESERVAR
 */
router.get('/RESERVAR', reservaController.verRegReserva);
/**
 * Registro Reserva
 *
 * @section Reserva
 * @type post
 * @url /registro/guardarReserva
 */
router.post('/registro/guardarReserva', reservaController.registrarReserva);
/**
 * Actualizar Reserva
 *
 * @section Reserva
 * @type post
 * @url /registro/actualizarReserva
 */
router.post('/registro/actualizarReserva', reservaController.modificarReserva);
/**
 * Vista todas Reservas
 *
 * @section Reservas
 * @type get
 * @url /MISRESERVAS
 */
router.get('/MISRESERVAS', reservaController.function);
/**
 * Vista todas Reservas
 *
 * @section Reservas
 * @type get
 * @url /MISRESERVAS
 */
router.get('/reservas', reservaController.function);
/**
 * Vista Actualizar Reservas
 *
 * @section Reservas
 * @type get
 * @url /editarReserva/:external
 */
router.get('/editarReserva/:external', reservaController.verEditarReserva);
/**
 * Cambia estado Reserva
 *
 * @section Reserva
 * @type post
 * @url //editEstado/:external
 */
//  router.post('/editEstado/:external', reservaController.cambiarEstado);

//multimedia
/**
 * Vista Galeria
 *
 * @section Multimedia
 * @type get
 * @url /galeria
 */
router.get('/galeria', multimediaController.verGaleria);
/**
 * Registro Multimedia
 *
 * @section Multimedia
 * @type post
 * @url /galeria/guardarMult
 */
router.post('/galeria/guardarMult', multimediaController.guardarImagenGaleria);

//correo
/**
 * Envia Correo
 *
 * @section Correo
 * @type post
 * @url /enviarCorreo
 */
router.post('/enviarCorreo', mailController.enviarCorreo);

//PDF REPORTE
/**
 * Genera Reporte Reserva
 *
 * @section Reporte
 * @type get
 * @url /comprobantepdf/:external
 */
router.get('/cambiarEstado/:codigo', SW.cambiarEstado);


module.exports = router;
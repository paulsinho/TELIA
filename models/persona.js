module.exports = function (sequelize, Sequelize) { //sequelize es objeto y Sequelize clas
    var rol = require('../models/rol');
    var Rol = new rol(sequelize, Sequelize);
    var Persona = sequelize.define('persona', {
        idPersona: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        cedula: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        nombre: {
            type: Sequelize.STRING(50)
        },
        apellido: {
            type: Sequelize.STRING(50)
        },
        direccion: {
            type: Sequelize.STRING(150)
        },
        telefono: {
            type: Sequelize.STRING
        },
        fecha_Nac: {
            type: Sequelize.DATEONLY
        },
        foto: {
            type: Sequelize.STRING(150)
        },
        sexo: {
            type: Sequelize.BOOLEAN
        },
        external_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        }
    },
            {freezeTableName: true,
                createdAt: 'fecha_registro',
                updatedAt: 'fecha_modificacion'
            });

    Persona.belongsTo(Rol, {//en este modelo se aloja la llave principal de rol(clave foranea)
        foreignKey: 'id_rol', //agregara el ide de rol en el modelo persona
        constraints: false
    });

    Persona.associate = function (models) {//indica que el primary key de este modelo sera llave foranea de  cuenta y actor
        models.persona.hasOne(models.cuenta, {
            foreignKey: 'id_persona'
        });
        models.persona.hasOne(models.actor, {
            foreignKey: 'id_actor',
            primaryKey: true
        });
    };

    return Persona;

};
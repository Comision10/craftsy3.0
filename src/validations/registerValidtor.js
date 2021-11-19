const {body,check} = require('express-validator');
const db = require('../database/models');

module.exports = [

    check('name')
        .notEmpty().withMessage('El nombre es requerido'),

    check('email')
        .notEmpty().withMessage('Debes ingresar tu email').bail()
        .isEmail().withMessage('Email inválido'),

    body('email')
        .custom(value  => {
          return db.User.findOne({
              where : { 
                  email : value
                }
          }).then( user => {
              if(user){
                  return Promise.reject('El email ya se encuentra registrado')
              }
          })
        }),

    check('password')
        .isLength({
            min : 6,
            max : 12
        }).withMessage('La contraseña debe tener un mínimo de 6 y un máximo de 12 caracteres'),
    
    body('password2')
        .custom((value,{req}) => {
            if(value !== req.body.password){
                return false
            }else{
                return true
            }
        }).withMessage('Las contraseñas no coinciden'),

    check('terms')
        .isString('on').withMessage('Debes aceptar los términos y condiciones')
    
]
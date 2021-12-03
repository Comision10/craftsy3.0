const {check} = require('express-validator');

module.exports = [

    check('name')
        .notEmpty().withMessage('El nombre es requerido'),
    
]
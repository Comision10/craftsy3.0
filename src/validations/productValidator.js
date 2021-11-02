const {check} = require('express-validator');

module.exports = [
    check('name')
    .notEmpty().withMessage('El nombre del producto es obligatorio'),

    check('description')
    .notEmpty().withMessage('La descripción es obligatoria').bail()
    .isLength({
        min : 20
    }).withMessage('La descripción debe tener un mímino de 20 caracteres'),

    check('price')
    .isDecimal({
        min: 1
    }).withMessage('Debe un número válido'),

    check('discount')
    .isInt({
        min: 0
    }).withMessage('Debe un número válido'),

    check('category')
    .notEmpty().withMessage('Indicá la categoría'),
]
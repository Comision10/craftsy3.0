const db = require('../database/models');
const {Op,Sequelize} = require('sequelize');

module.exports = {
    index : (req,res) => {
        let ofertas = db.Product.findAll({
            where : {
                discount : {
                    [Op.gte] : 25
                },
                show : true
            },
          /*   order : Sequelize.literal('rand()'), */
            limit : 4,
            include : [
                'images',
                'category'
            ]
        })
        let products = db.Product.findAll({
            where : {
                categoryId : {
                    [Op.like] : 1
                }
            },
            limit : 6,
            include : [
                'images',
                'category'
            ]
        })

        let tutoriales = db.Tutorial.findAll()

        Promise.all([ofertas,products,tutoriales])

        .then(([ofertas,products,tutoriales]) => {
            return res.render('index', { 
                title: 'Craftsy 2.0',
                ofertas,
                products,
                tutoriales
            });
        })
        .catch(error => console.log(error))


      
    },
    admin : (req,res) => {
        let products = db.Product.findAll({
            include : ['images','category']
        })
        let categories = db.Category.findAll()

        Promise.all([products,categories])
            .then(([products,categories]) => {
                return res.render('admin',{
                    title : "Administración",
                    products,
                    categories
                })
            })
            .catch(error => console.log(error))
    
    }
}
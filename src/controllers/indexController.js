const fs = require('fs');
const path = require('path');
let  tutoriales = JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','tutoriales.json'),'utf-8'));

/* base de datos */
const db = require('../database/models');
const {Op,Sequelize} = require('sequelize')

module.exports = {
    index : (req,res) => {
        let ofertas = db.Product.findAll({
            where : {
                discount : {
                    [Op.gte] : 25
                }
            },
            order : Sequelize.literal('rand()'),
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

        Promise.all([ofertas,products])

        .then(([ofertas,products]) => {
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
        return res.render('admin',{
            title : "Administración",
            products : JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','products.json'),'utf-8')),
            categories
        })
    }
}
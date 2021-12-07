const db = require('../database/models');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
let users = require(path.join(__dirname, '../data/users.json'));
const { validationResult } = require('express-validator')

module.exports = {
    register: (req, res) => {
        return res.render('register')
    },
    processRegister: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            const { name, email, password } = req.body;
            db.User.create(
                {
                    name: name.trim(),
                    email: email.trim(),
                    password: bcrypt.hashSync(password, 10),
                    avatar: 'default.png',
                    rolId: 1
                }
            ).then(async user => {
                await db.Address.create({
                    userId: user.id
                })
                req.session.userLogin = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    rol: user.rolId
                }
                return res.redirect('/')
            }).catch(error => console.log(error))

        } else {
            return res.render('register', {
                errores: errors.mapped(),
                old: req.body
            })
        }

    },
    login: (req, res) => {
        return res.render('login')
    },
    processLogin: (req, res) => {
        let errors = validationResult(req);

        if (errors.isEmpty()) {

            db.User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(user => {
                req.session.userLogin = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    rol: +user.rolId
                }
                if (req.body.remember) {
                    res.cookie('craftsyForEver', req.session.userLogin, { maxAge: 1000 * 60 })
                }
                /* CARRITO */
                req.session.carrito = [];
                db.Order.findOne({
                    where: {
                        userId: req.session.userLogin.id,
                        status: 'pending'
                    },
                    include: [
                        {
                            association: 'carts',
                            include: [
                                {
                                    association: 'product',
                                    include: ['category', 'images']
                                }
                            ]
                        }
                    ]
                }).then(order => {
                    if (order) {
                        order.carts.forEach(item => {
                            let product = {
                                id: item.productId,
                                nombre: item.product.name,
                                image: item.product.images[0].file,
                                precio: +item.product.price,
                                categoria: item.product.category.name,
                                cantidad: +item.quantity,
                                total: item.product.price * item.quantity,
                                orderId: order.id
                            }
                            req.session.carrito.push(product)
                        });
                    }
                    return res.redirect('/')
                })
            })


        } else {
            return res.render('login', {
                errores: errors.mapped()
            })
        }
    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/')
    },
    profile: (req, res) => {
        db.User.findByPk(req.session.userLogin.id, {
            include: [{ all: true }]
        })
            .then(user => {
                return res.render('profile', {
                    user
                })
            })
            .catch(error => console.log(error))
    },
    update: (req, res) => {
        let errors = validationResult(req);
        if (errors.isEmpty()) {
            //let hashPass = req.body.password ? bcrypt.hashSync(req.body.password, 10) : user.password;
            db.User.update(
                {
                    name: req.body.name,
                    avatar: req.file ? req.file.filename : req.session.userLogin.avatar,
                },
                {
                    where: {
                        id: req.session.userLogin.id
                    }
                },
            ).then(async () => {
                await db.Address.update(
                    {
                        city: req.body.city,
                        state: req.body.state,
                    },
                    {
                        where: {
                            userId: req.session.userLogin.id
                        }
                    }
                )
                if (req.file) {
                    if (fs.existsSync(path.join(__dirname, '../public/images/users/' + user.avatar)) && user.avatar != "default.png") {
                        fs.unlinkSync(path.join(__dirname, '../public/images/users/' + user.avatar))
                    }
                    req.session.userLogin.avatar = req.file.filename
                }
                req.session.userLogin.name = req.body.name
                return res.redirect('/users/profile')
            }).catch(error => console.log(error))
        } else {
            res.render('profile', {
                user: users.find(user => user.id === req.session.userLogin.id),
                errors: errors.mapped()
            })
        }


    }
}
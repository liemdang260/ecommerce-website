const CartModel = require('../../models/Cart');
const NotLoggedInCartModel = require('../../models/NotloggedInCart');

exports.getLogin = async (req, res) => {
    console.log(req.flash('error'));
    res.render('pages/login');
};

exports.postLogin = (req, res) => {
    try {
        const userCart = CartModel.findOne({
            userId: req.user.id,
        });

        if (req.session.cart) {
            if (!userCart) {
                const createdCart = new CartModel(
                    req.session.cart,
                );
                createdCart.userId = req.user.id;
                createdCart.save();
            } else {
                // Add user's cart to session
                const notLoggedInCart =
                    new NotLoggedInCartModel(
                        req.session.cart,
                    );
                notLoggedInCart.concatCart(userCart);
                req.session.cart = notLoggedInCart;

                // Add session cart to user's cart
                userCart.concatCart(notLoggedInCart);
            }
        }

        // Redirect to the previous URL
        if (req.session.oldUrl) {
            let oldUrl = req.session.oldUrl;
            req.session.oldUrl = '';
            res.redirect(oldUrl);
        } else {
            res.redirect('/');
        }
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};

exports.getRegister = (req, res) => {
    res.render('pages/register');
};

exports.postRegister = async (req, res) => {
    try {
        //If there is a cart session, save it to the user's cart in DB
        if (req.session.cart) {
            const cart = new CartModel(req.session.cart);
            cart.userId = req.user.id;
            cart.save();
        }
        // Redirect to the previous URL
        if (req.session.oldUrl) {
            let oldUrl = req.session.oldUrl;
            req.session.oldUrl = '';
            res.redirect(oldUrl);
        } else {
            res.redirect('/');
        }
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('back');
    }
};

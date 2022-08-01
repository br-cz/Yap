const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        //no await because login requires a callback function
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yap!');
            res.redirect('/restaurants');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Nice to see you again!');
    const redirectUrl = req.session.prevUrl || '/restaurants'; //Allows for better user experience redirecting back to their previous page
    delete req.session.prevUrl; //we don't need this anymore
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Logged out");
      res.redirect('/restaurants');
    })
};

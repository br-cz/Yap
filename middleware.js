module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'Not signed in');
        return res.redirect('/login');
    }
    next();
}
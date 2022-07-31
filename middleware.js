module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //Used for redirecting back to previous page where user was prompted to login
        req.session.prevUrl = req.originalUrl;
        req.flash('error', 'Not signed in');
        return res.redirect('/login');
    }
    next();
}
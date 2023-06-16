export const logout =  (req, res) => {
    req.session.destroy(function (error) {
        if (error) {
            console.error(error);
        } else {
            console.log(req.session);
        }
        
        // Redirection sur page d'accueil
        res.redirect('/');
    });
};
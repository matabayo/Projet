export const connexion = function(req, user) {
    req.session.userId = user.id;
    req.session.role = user.role;
};

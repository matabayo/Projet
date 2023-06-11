export default function(req) {
    req.session.isAdmin = true;
    req.session.isUser = true;
}

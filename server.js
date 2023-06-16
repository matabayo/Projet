import express from "express";
import session from "express-session";
import router from "./routes/router.js";
import parseurl from "parseurl";
import {connexion} from "./config/userSession.js";

const app = express();
const port = 8000;
const hostname = "localhost";

const BASE_URL = `http://${hostname}:${port}`;

app.use(express.static("public"));

app.use(session({
    secret : 'keyboard relou',
    resave : false,
    saveUninitialized : true,
    cookie : {maxAge : 360000}
}));

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('view options', {pretty:true});

app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.use(function(req, res, next) {
    res.locals.connexion = !!req.session.connexion;
    next();
});

app.use(function(req, res, next) {
    const route = parseurl(req);
    const protectedRoutes = [
        '/admin',
        '/add_post',
        '/edit_post',
        'delete_post'
        ];
    
    if(protectedRoutes.indexOf(route) > -1 && !connexion(req)) {
        res.redirect('/');
    }
    
    
    next();
});

// appel du routeur
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log('listening'+PORT+ 'tout est bon');
})
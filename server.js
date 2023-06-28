import express from "express";
import session from "express-session";
import router from "./routes/router.js";
import parseurl from "parseurl";
import dotenv from "dotenv";
import {connexion} from "./config/userSession.js";
dotenv.config;

const app = express();
const port = 8000;
const hostname = "localhost";

const BASE_URL = `http://${hostname}:${port}`;

app.use(express.static("public"));

app.use(session({
    secret : process.env.SECRET,
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
    res.locals = Object.assign(res.locals, req.session);
    next();
});



app.use(function (req, res, next) {
	res.locals.admin = req.session.role === 'admin' ? true : false;
	res.locals.player = req.session.role === 'player' ? true : false;
	next();
});
// app.use( (req,res,next) => {
//     const routeUser = parseurl(req).pathname;
//     const protectedRoutesUser = [
//         '/user',
//         '/createGame',
//         '/game',
//         '/gameType'
        
//     ]
    
//     if(protectedRoutesUser.indexOf(routeUser) > -1 && req.session.role !== 'player') {
//         res.redirect('/');
//     }
//      else {
//         next();
//     }
// })

// app.use(function(req,res, next) {
//     const route = parseurl(req).pathname;

//     const protectedRoutes = ['/admin'];
    

//     if(protectedRoutes.indexOf(route) > -1 && req.session.role !== 'admin') {
//         res.redirect('/');
//     }
//      else {
//         next();
//     }
// })

// appel du routeur
app.use('/', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log('listening'+PORT+ 'tout est bon');
})
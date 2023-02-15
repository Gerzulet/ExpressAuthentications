import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import viewsRoutes from "./routes/views.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import path from 'path'
import passport from 'passport'
import initializePassport from  "./config/passport.config.js";
const app = express();

// Server config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://CoderGermancho:coderBackend2023@codercluster.dzpfie2.mongodb.net/?retryWrites=true&w=majority",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 60*60,
    }),
    secret: "coderhouse",
    resave: false,
    saveUninitialized: false,
  })
);
initializePassport(); 
app.use(passport.initialize())
app.use(passport.session())
mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://CoderGermancho:coderBackend2023@codercluster.dzpfie2.mongodb.net/?retryWrites=true&w=majority" )
  .then(() => console.log("Connected to MongoDB"))

app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'main'
}))
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

app.use("/", viewsRoutes);
app.use("/session", sessionRoutes);
app.use(express.static(path.join(__dirname, '/public')));

app.listen(8080, () => console.log("Server running on port 8080"))

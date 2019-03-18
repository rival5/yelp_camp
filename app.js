require('dotenv').config();

var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose'),
  methodOverride = require('method-override'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  seedDB = require('./seeds');

// requiring routes
var commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

const keys = require('./keys');

var dburl = process.env.DATABASEURL || keys.database.dbURI;
mongoose.connect(dburl, { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); // seed the database
var Campground = require('./models/campground');

// PASSPORT CONFIGURATION
app.use(
  require('express-session')({
    secret: 'i love man utd',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// keeps track if user is logged in or not
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

var port = process.env.PORT || 3000;

// app.listen(port, process.env.IP, function () {
//     console.log("Server Started...");
// });

app.listen(port, function() {
  console.log('server started on port 3000');
});

var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var middleware = require("../middleware");

var multer = require('multer');
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: "viralraval5",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// show all campgrounds
router.get("/campgrounds", function(req, res) {
  // Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: allCampgrounds
      });
    }
  });
});

// show form to create new campground and send data to POST route
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new");
});

//logic of making new campground and redirect to campgrounds page
router.post("/campgrounds", middleware.isLoggedIn, upload.single('image'), function(req, res) {
  // get data from form and add to campgrounds array. push and object
  cloudinary.uploader.upload(req.file.path, function (result) {
    // add cloudinary url for the image to the campground object under image property
    req.body.campground.image = result.secure_url;
    // add author to campground
    req.body.campground.author = {
      id: req.user._id,
      username: req.user.username
    };
    Campground.create(req.body.campground, function (err, campground) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      res.redirect('/campgrounds/' + campground.id);
    });
  });
});

// SHOW - show more info about campground
router.get("/campgrounds/:id", function(req, res) {
  // find campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        // render show template with that campground
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

// EDIT CAMPGROUND ROUTE
router.get(
  "/campgrounds/:id/edit",
  middleware.checkCampgroundOwnership,
  function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      res.render("campgrounds/edit", { campground: foundCampground });
    });
  }
);

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res) {
  // find and update corect campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      // redirect to show page
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DESTROY CAMPGROUND
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err, deleteCampground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

module.exports = router;
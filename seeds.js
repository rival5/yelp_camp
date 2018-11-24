var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
  {
    name: "Cloud's Rest",
    image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas urna neque, ullamcorper vel viverra et, laoreet sed velit. Donec et ultrices turpis. Maecenas nisi leo, auctor vehicula orci sed, facilisis aliquam mauris. Cras augue nibh, laoreet vel turpis at, porta porta est. Proin eu nisi risus. Maecenas eu quam justo. Vivamus a varius nisi. Curabitur suscipit orci sed augue fringilla laoreet. Cras in justo at nisl aliquam malesuada. In convallis imperdiet nibh ut faucibus. Ut tempor commodo arcu, ac suscipit urna sagittis finibus. Praesent lobortis odio massa, sed lobortis orci mattis non. Ut mi urna, accumsan ac est eget, facilisis accumsan libero. Maecenas imperdiet ornare imperdiet. Nulla vitae maximus tortor."
  },
  {
    name: "Desert Mesa",
    image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas urna neque, ullamcorper vel viverra et, laoreet sed velit. Donec et ultrices turpis. Maecenas nisi leo, auctor vehicula orci sed, facilisis aliquam mauris. Cras augue nibh, laoreet vel turpis at, porta porta est. Proin eu nisi risus. Maecenas eu quam justo. Vivamus a varius nisi. Curabitur suscipit orci sed augue fringilla laoreet. Cras in justo at nisl aliquam malesuada. In convallis imperdiet nibh ut faucibus. Ut tempor commodo arcu, ac suscipit urna sagittis finibus. Praesent lobortis odio massa, sed lobortis orci mattis non. Ut mi urna, accumsan ac est eget, facilisis accumsan libero. Maecenas imperdiet ornare imperdiet. Nulla vitae maximus tortor."
  },
  {
    name: "Canyon Floor",
    image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas urna neque, ullamcorper vel viverra et, laoreet sed velit. Donec et ultrices turpis. Maecenas nisi leo, auctor vehicula orci sed, facilisis aliquam mauris. Cras augue nibh, laoreet vel turpis at, porta porta est. Proin eu nisi risus. Maecenas eu quam justo. Vivamus a varius nisi. Curabitur suscipit orci sed augue fringilla laoreet. Cras in justo at nisl aliquam malesuada. In convallis imperdiet nibh ut faucibus. Ut tempor commodo arcu, ac suscipit urna sagittis finibus. Praesent lobortis odio massa, sed lobortis orci mattis non. Ut mi urna, accumsan ac est eget, facilisis accumsan libero. Maecenas imperdiet ornare imperdiet. Nulla vitae maximus tortor."
  }
];

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.deleteMany({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!");
            //add a few campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function (err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    });
    //add a few comments
}

module.exports = seedDB;
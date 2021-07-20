const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const _ = require('lodash');


const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

// MongoDB connection
mongoose.connect('mongodb://localhost/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});
// view engine setup
app.set('view engine', 'ejs');
app.use(express.static('public'));


// collection name is articles
const articleSchema = {
    title: String,
    content: String
  };
  
const Article = mongoose.model("Article", articleSchema);

// implement routes
app.route('/articles')
  .get(function(req, res) {
    Article.find({}, function(err, articles) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(articles);
      }
    });
  })
  .post(function(req, res) {
    const article = new Article(req.body);
    article.save(function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(article);
      }
    });
  })
  .delete(function(req, res) {
    Article.remove({}, function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ message: 'All articles deleted' });
      }
    });
  });
// get a specified article by title
app.route('/articles/:title')
  .get(function(req, res) {
    Article.findOne({ title: req.params.title }, function(err, article) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(article);
      }
    });
  })
// put a specific article by title
  .put(function(req, res) {
    Article.findOne({ title: req.params.title }, function(err, article) {
      if (err) {
        res.status(500).send(err);
      } else {
        article.title = req.body.title;
        article.content = req.body.content;
        article.save(function(err) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.json(article);
          }
        });
      }
    });
  })
// patch a specific article using update
  .patch(function(req, res) {
    Article.update({ title: req.params.title }, req.body, function(err, article) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(article);
      }
    });
  })
// delete a specific article
  .delete(function(req, res) {
    Article.deleteOne({ title: req.params.title }, function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json({ message: 'Article deleted' });
      }
    });
  });

  // .patch(function(req, res) {
  //   Article.findOne({ title: req.params.title }, function(err, article) {
  //     if (err) {
  //       res.status(500).send(err);
  //     } else {
  //       article.title = req.body.title;
  //       article.content = req.body.content;
  //       article.save(function(err) {
  //         if (err) {
  //           res.status(500).send(err);
  //         } else {
  //           res.json(article);
  //         }
  //       });
  //     }
  //   });
  // });




// app.route('/articles/:articleId')
//   .get(function(req, res) {
//     Article.findOne(req.params.articleId, function(err, article) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.json(article);
//       }
//     });
//   })


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
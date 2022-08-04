const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, patchArticleVotesById, getArticles, getCommentsByArticleId } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");

const express = require('express');
const app = express();
app.use(express.json())

//topics
app.get('/api/topics', getTopics);

//articles
app.get('/api/articles',getArticles);
app.get('/api/articles/:article_id/comments',getCommentsByArticleId);
app.get('/api/articles/:article_id',getArticleById);
app.patch('/api/articles/:article_id',patchArticleVotesById);

//users
app.get('/api/users',getUsers);

app.all('*', (req,res) => {
    res.status(404).send({msg:'bad path!'});
})

//error handling
app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg:"Bad request!"});
    } else next(err);
  });

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    }
  });

module.exports = app;
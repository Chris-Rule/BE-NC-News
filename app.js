const { getTopics } = require("./controllers/topics.controller");
const { getArticleById, 
        patchArticleVotesById, 
        getArticles, 
        getCommentsByArticleId, 
        postCommentByArticleId} = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const cors = require('cors');

const express = require('express');
const { getAPIJSON } = require("./controllers/api.controller");
const app = express();
app.use(cors());
app.use(express.json())

//api
app.get('/api',getAPIJSON)

//topics
app.get('/api/topics', getTopics);

//articles
app.get('/api/articles',getArticles);
app.get('/api/articles/:article_id',getArticleById);
app.get('/api/articles/:article_id/comments',getCommentsByArticleId);
app.patch('/api/articles/:article_id',patchArticleVotesById);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

//users
app.get('/api/users',getUsers);

//comments
app.delete('/api/comments/:comment_id', deleteCommentById);

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
    } else next(err);
  });

app.use((err,req,res) => {
  res.status(500).send({msg: "Shouldn't be here"});
})

module.exports = app;
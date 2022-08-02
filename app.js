const { getTopics, getArticleById, patchArticleVotesById } = require("./controllers/topics.controller");
const express = require('express');
const app = express();
app.use(express.json())

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id',getArticleById);

app.patch('/api/articles/:article_id',patchArticleVotesById);

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
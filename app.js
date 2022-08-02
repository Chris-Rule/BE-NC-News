const { getTopics, getArticleById } = require("./controllers/topics.controller");
const express = require('express');
const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id',getArticleById);

app.all('*', (req,res) => {
    res.status(404).send({msg:'bad path!'});
})

//error handling 
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    }
  });

module.exports = app;
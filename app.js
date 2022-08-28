
const { deleteCommentById } = require("./controllers/comments.controller");
const cors = require('cors');

const express = require('express');
const apiRouter = require("./routes/api-router")
const app = express();

app.use(cors());
app.use(express.json())

//routes
app.use('/api',apiRouter);

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
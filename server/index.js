const express = require('express');
const cors = require('cors');
const app = express();
require('./db')
const port = process.env.port || 3500;

const categoriesRouter = require('./routes/category.routes');
const questionRouter = require('./routes/question.routes');

app.use(cors())
app.use(express.json())

app.use('/categories', categoriesRouter);
app.use('/questions', questionRouter);


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
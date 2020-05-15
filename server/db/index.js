const mongoose = require('mongoose');
require('dotenv').config();

const user=process.env.ATLAS_USER;
const pw=process.env.ATLAS_PW;
const cluster=process.env.ATLAS_CLUSTER;
const options=process.env.ATLAS_OPTIONS;
const db=process.env.ATLAS_DB;

console.log(`mongodb+srv://${user}:${pw}@${cluster}${db}${options}`)

const dbUri = `mongodb+srv://${user}:${pw}@${cluster}${db}${options}`;
const dbOptions= { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}

mongoose.connect(dbUri, dbOptions);
const dbConnection = mongoose.connection;
dbConnection.once('open', () => {
  console.log('Connected to MongoDb Successfully');
})

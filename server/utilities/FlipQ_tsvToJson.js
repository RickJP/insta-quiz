importIntoMongo = () => {
  const {exec} = require('child_process');

  const user = process.env.ATLAS_USER;
  const pw = process.env.ATLAS_PW;
  const cluster = process.env.ATLAS_CLUSTER;
  const db = process.env.ATLAS_DB;
  const col = 'questions';

  const file = require('path').join(__dirname, `quiz.txt`);
  const mongoImportCmd = `mongoimport --uri mongodb+srv://${user}:${pw}@${cluster}${db}?w=majority -c ${col} --file ${file} --jsonArray`;

  exec(mongoImportCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

processFile = () => {
  getData((quiz, counter) => {
    writeData(quiz, counter);
    importIntoMongo();
  });
};

writeData = (quiz, counter) => {
  const fileName = 'quiz.txt';
  const fileLocation = require('path').join(__dirname, fileName);

  const writeStream = require('fs').createWriteStream(fileLocation);
  writeStream.write(quiz);
  writeStream.on('finish', () => {
    console.log(`Saved ${counter} questions in ${fileName}`);
  });
  writeStream.end();
};

getData = (callback) => {
  const fileName = 'quiz.tsv';
  const fileLocation = require('path').join(__dirname, fileName);
  const delimeter = '\t';

  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(fileLocation),
  });

  let quiz = [];
  let items = [];
  let counter = 0;

  lineReader.on('error', function (err) {
    res.end('Error occurred: ' + err);
  });

  lineReader.on('line', (line) => {
    console.log(`Converting TSV to JSON with : ${fileName}`);
    let obj = {};
    let incorrect_answers = [];

    // Split the items - Category, Question, and Options (One correct answer & four incorrect)
    items = line.split(delimeter);

    // Add the Category, Question & Correct answer to an object
    objPrev = {
      category: items[0],
      question: items[1],
      correct_answer: items[2],
    };

    // Add the Incorrect Answers to an array
    items.splice(3).map((answer) => {
      incorrect_answers.push(answer);
    });
    // Combine the two object into one, and add it to Quiz array
    obj = Object.assign(objPrev, {incorrect_answers});
    quiz.push(obj);

    counter++;
  });
  lineReader.on('close', () => {
    // Stringify the Quiz array and return it
    callback(JSON.stringify(quiz), counter);
  });
};

module.exports = {processFile};

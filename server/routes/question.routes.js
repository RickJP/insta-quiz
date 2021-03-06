const router = require('express').Router();
const Question = require('../models/question.model');
const { processFile } = require('../utilities/FlipQ_tsvToJson');

// Get a Set Number of Questions
router.get('/', async (req, res) => {
  console.log(req.query.category);
  try {
    const fields = ['-_id'];
    const limit = req.params.limit || 10;
    const skip = req.params.skip || 0;

    console.log('Getting Questions');

    const questions = await Question.find({category: req.query.category})
      .select(fields)
      .limit(limit)
      .skip(skip)
      .sort({category: 'asc'});

    res.json(questions);
  } catch (err) {
    res.status(400).json({
      error: err,
    });
  }
});

// router.get('/', async (req, res) => {
//   try {
//     const questions = await Question.find()
//     res.json(questions)
//   } catch (err) {
//     res.status(400).json({
//       error: err
//     })
//   }
// })

router.get('/import', async (req, res) => {
  try {
    const counter = processFile()
    res.json({ message: `Imported ${counter} Questions` })
  } catch (err) {
    res.status(400).json({ message: err })
  }
});

module.exports = router;

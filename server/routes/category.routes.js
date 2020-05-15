const router = require('express').Router()
const Category = require('../models/category.model');


router.get('/', async (req, res) => {

  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (err) {
    res.status(400).json({
      error: err
    })
  }
})


module.exports = router;
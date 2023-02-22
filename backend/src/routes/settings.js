const router = require('express').Router();

const Settings = require('../controller/settings');
const Api400Error = require('../utils/errors/api400Error');

//update

router.post('/', async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key || !value) {
      throw new Api400Error('key and value are required');
    }
    const isSuccess = await Settings.set(key, value);
    if (isSuccess) {
      res.status(200).json({
        message: 'Settings updated successfully',
      });
    }
  } catch (error) {
    next(error);
  }
});
router.get('/', async (req, res, next) => {
  try {
    const settings = await Settings.getAll();
    res.json({ data: settings });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

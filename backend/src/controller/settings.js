const Setting = require('../models').Setting;

exports.get = async (key) => {
  const setting = await Setting.findOne({
    where: {
      key,
    },
  });
  if (!setting) {
    throw new Error('Not found setting');
  }
  return JSON.parse(setting.value);
};
exports.getAll = async (key) => {
  const setting = await Setting.findAll();

  return setting;
};
exports.set = async (key, value) => {
  try {
    const setting = await Setting.findOne({
      where: {
        key,
      },
    });
    if (!setting) {
      await Setting.create({
        key: key,
        value: JSON.stringify(value),
      });
    } else {
      await Setting.update(
        {
          value: JSON.stringify(value),
        },
        {
          where: { key },
        }
      );
    }
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

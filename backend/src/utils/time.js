const _ = require('lodash');
const moment = require('moment');
require('moment-duration-format');

exports.format = (ttl) => {
  let duration = moment.duration(ttl, 'seconds').format('hh:mm:ss');
  duration = duration.split(':');
  let temp = '';
  if (ttl < 60) {
    temp += `${duration[0]}s`;
  } else if (ttl < 60 * 60) {
    temp += `${_.toNumber(duration[0])}m`;
    temp += duration[1] !== '00' ? `:${duration[1]}s` : '';
  } else {
    temp += `${_.toNumber(duration[0])}h`;
    temp += duration[1] !== '00' ? `:${duration[1]}m` : '';
    temp += duration[2] !== '00' ? `:${duration[2]}s` : '';
  }
  return temp;
};

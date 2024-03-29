const moment = require('moment');
const MomentTimezone = require('moment-timezone');
const redis = require('../utils/redis');
const settings = require('../controller/settings');

module.exports = async ({ userId }) => {
  try {
    const now = moment(MomentTimezone().tz('Asia/Ho_Chi_Minh'));

    const numInteraction = (await redis.get(`NUM_INTERACTION_USER_ID_${userId}`)) || 0;
    // console.log(numInteraction);
    if (numInteraction > 0) {
      redis.set(
        `NUM_INTERACTION_USER_ID_${userId}`,
        numInteraction + 1,
        await redis.getTTL(`NUM_INTERACTION_USER_ID_${userId}`)
      );
      const numInteractionWillBeBlock = await settings.get('SETTING_NUM_INTERACTION_BLOCK');
      if (numInteraction >= numInteractionWillBeBlock) {
        const endMonth = moment(MomentTimezone().tz('Asia/Ho_Chi_Minh')).endOf('month');
        const durationMonth = endMonth.diff(now, 'seconds');
        const numBlockedOfUserAMonth =
          ((await redis.get(`NUM_LIMIT_IS_EXCEEDED_IN_MONTH_BY_USER_ID:${userId}`)) || 0) + 1;
        // console.log(durationMonth);
        await redis.set(`NUM_LIMIT_IS_EXCEEDED_IN_MONTH_BY_USER_ID:${userId}`, numBlockedOfUserAMonth, durationMonth);
        const settingTimeBlock = await settings.get(`SETTING_TIMES_BY_NUM_OF_VIOLATIONS`);
        if (numBlockedOfUserAMonth <= 3)
          redis.set(
            `BLOCK_INTERACTION_USER_ID_${userId}`,
            true,
            60 * 60 * settingTimeBlock[`${numBlockedOfUserAMonth}`]
          );
        if (numBlockedOfUserAMonth > 3)
          redis.set(`BLOCK_INTERACTION_USER_ID_${userId}`, true, 60 * 60 * settingTimeBlock[`3`]);
        redis.del(`NUM_INTERACTION_USER_ID_${userId}`);
      }
    } else await redis.set(`NUM_INTERACTION_USER_ID_${userId}`, numInteraction + 1, 60 * 60);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

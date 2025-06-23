require('../../app/library/log4js').config();

module.exports = (req, res) => {
  try {
    if (req.body.error) {
      // eslint-disable-next-line global-require
      const { getLogger } = require('log4js');
      const logger = getLogger();
      logger.error(req.body.error);
    }
    res.json({ success: true });
  } catch (e) {
    res.json({ error: e });
  }
};

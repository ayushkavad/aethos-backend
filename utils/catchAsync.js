/**
 * This function is a middleware that catches errors and passes them to the next middleware in the chain.
 *
 * @param {function} fn The next middleware in the chain.
 * @returns {function} A middleware that catches errors and passes them to the next middleware in the chain.
 */
 module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
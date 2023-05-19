/**
 * This class provides functions for filtering, sorting, and paginating results from a database.
 */
 class APIFeatures {
  /**
   * Creates a new APIFeatures instance.
   *
   * @param {object} query The database query.
   * @param {string} queryString The query string.
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filters the results based on the query string.
   *
   * @returns {APIFeatures} This object.
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFiedls = ['page', 'sort', 'limit', 'fields'];

    excludeFiedls.forEach((el) => delete queryObj[el]);

    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  /**
   * Sorts the results based on the query string.
   *
   * @returns {APIFeatures} This object.
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  /**
   * Limits the results based on the query string.
   *
   * @returns {APIFeatures} This object.
   */
  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  /**
   * Paginates the results based on the query string.
   *
   * @returns {APIFeatures} This object.
   */
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}

/**
 * Exports the `APIFeatures` class.
 *
 * @type {APIFeatures}
 */
module.exports = APIFeatures;
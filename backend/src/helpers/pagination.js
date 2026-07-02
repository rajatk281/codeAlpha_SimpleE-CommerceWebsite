const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../constants');

const buildPaginationParams = (query) => {
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || DEFAULT_PAGE_SIZE;

  if (page < 1) page = 1;
  if (limit < 1) limit = DEFAULT_PAGE_SIZE;
  if (limit > MAX_PAGE_SIZE) limit = MAX_PAGE_SIZE;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const buildPaginationMeta = (page, limit, totalItems) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = {
  buildPaginationParams,
  buildPaginationMeta,
};

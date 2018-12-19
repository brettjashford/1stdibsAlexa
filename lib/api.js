const fetchGraphQL = require("./fetchGraphQL");

module.exports = config => (options = {}) => {
  const fetchOptions = {
    query: config.query
  };
  if (config.prepareVariables) {
    fetchOptions.variables = config.prepareVariables(options);
  }
  return fetchGraphQL(fetchOptions).then(response =>
    config.formatMessage(response, options, fetchOptions.variables)
  );
};

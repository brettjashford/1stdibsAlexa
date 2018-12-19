require("isomorphic-fetch");

module.exports = function fetchGraphql(options) {
  if (!options.query) {
    return Promise.reject(
      new Error("A query must be specified for GraphQL requests.")
    );
  }
  const payload = {
    query: options.query
  };

  if (options.variables) {
    payload.variables = options.variables;
  }

  return fetch(
    `https://www.1stdibs.com/soa/graphql/?sellerToken=${
      process.env.SELLER_TOKEN
    }`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  )
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    })
    .then(response => response.json());
};

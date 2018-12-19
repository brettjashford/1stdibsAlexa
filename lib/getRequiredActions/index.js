const api = require("../api");
const get = require("lodash.get");
const { getConversationsResponse, getItemsResponse, getTransactionsResponse } = require('./utils');
const { query } = require('./query');

module.exports = api({
  query,
  prepareVariables() {
    return {
      sellerId: process.env.SELLER_ID,
      sellerIdList: [process.env.SELLER_ID]
    };
  },
  formatMessage(response, options, variables) {
    const viewer = get(response, 'data.viewer');

    let conversations = get(viewer, 'conversations');
    let items = get(viewer, 'items');
    let transactions = get(viewer, 'transactions');
    const numberOfRequiredActions = [conversations, items, transactions].reduce(
      (acc, queryResult) => acc + queryResult.totalResults,
      0
    );
    if (!numberOfRequiredActions) {
      return 'You have no required actions at this time';
    }

    return [
        `You have ${numberOfRequiredActions} total required actions.`,
        getConversationsResponse(conversations),
        getItemsResponse(items),
        getTransactionsResponse(transactions),
    ].filter(Boolean).join(' ');
  }
});

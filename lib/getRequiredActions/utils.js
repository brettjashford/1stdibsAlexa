const TRANSACTION_ACTION_REASONS = {
  // not 100% sure these things all mean this, but for demo purposes i think it's okay
  canAccept: 'are buyer orders',
  canProvideQuote: 'need shipment quotes',
  canReview: 'have a 1stdibs shipment quote ready for review',
  canCounter: 'are buyer offers',
  canMarkShipped: 'can be marked as shipped',
  canMarkPickup: 'can be marked as ready for pick up',
};

const ITEM_ACTION_REASONS = {
  ADDITIONAL_DETAILS_REQUESTED: 'Require Additional Details',
  ADDITIONAL_IMAGES_REQUESTED: 'Require Additional Images',
  ATTRIBUTION_VERIFICATION_REQUESTED: 'Require Attribution Verification',
  ENHANCED_IMAGES_REQUESTED: 'Require Enhanced Images',
  GENERAL_RESPONSE: 'Have a general issue',
  PERIOD_VERIFICATION_REQUESTED: 'Require Period Verification',
  RESTRICTED_MATERIALS: 'Contain Restricted Materials',
};

function reasonToCopy(reason) {
  const matchedReason = ITEM_ACTION_REASONS[reason];
  return matchedReason || ITEM_ACTION_REASONS.GENERAL_RESPONSE;
}

function getConversationsResponse(conversations) {
  if (!conversations.totalResults || !conversations.edges) {
    return '';
  }
  const conversationsWithBuyerRequest = conversations.edges.filter(edge => edge.node.hasBuyerRequest);
  return [
    `${conversations.totalResults} conversations require an action.`,
    `${conversationsWithBuyerRequest.length} conversations have a specific buyer request.`
  ].join(' ');
}

function getItemsResponse(items) {
  if (!items.totalResults || !items.edges) {
    return '';
  }

  // map to count the total number of items for each rejection reason
  const rejectionCountMap = items.edges.reduce((rejectionCountMap, edge) => {
    const item = edge.node;
    const sortedReviews = item.reviews.documents
      .filter(review => review.type === 'EXPERT_REVIEW')
      .sort((a, b) => {
        const aModifiedDate = a.modifiedDate;
        const bModifiedDate = b.modifiedDate;
        return dateStringToMilli(bModifiedDate) - dateStringToMilli(aModifiedDate);
      });
    const rejectionReason = reasonToCopy(sortedReviews[0].reasonCode);

    rejectionCountMap[rejectionReason] = (rejectionCountMap[rejectionReason] || 0) + 1;
    return rejectionCountMap;
  }, {});

  return [
    `${items.totalResults} items require an action.`,
    ...Object.keys(rejectionCountMap).map(key =>
      `${rejectionCountMap[key]} items ${key}.`
    )
  ].join(' ');
}

function getTransactionsResponse(transactions) {
  if (!transactions.totalResults || !transactions.edges) {
    return '';
  }

  // map to count the total number of transactions for each rejection reason
  const requiredActionMap = transactions.edges.reduce((requiredActionMap, edge) => {
    const transaction = edge.node;
    if (transaction.canAccept) {
      requiredActionMap.canAccept = (requiredActionMap.canAccept || 0) + 1;
    } else if (transaction.canProvideQuote) {
      requiredActionMap.canProvideQuote = (requiredActionMap.canProvideQuote || 0) + 1;
    } else if (transaction.canReview) {
      requiredActionMap.canReview = (requiredActionMap.canReview || 0) + 1;
    } else if (transaction.canCounter) {
      requiredActionMap.canCounter = (requiredActionMap.canCounter || 0) + 1;
    } else if (transaction.canMarkShipped) {
      requiredActionMap.canMarkShipped = (requiredActionMap.canMarkShipped || 0) + 1;
    } else if (transaction.canMarkPickup) {
      requiredActionMap.canMarkPickup = (requiredActionMap.canMarkPickup || 0) + 1;
    }
    return requiredActionMap;
  }, {});

  return [
    `${transactions.totalResults} transactions require an action.`,
    ...Object.keys(requiredActionMap).map(key =>
      `${requiredActionMap[key]} transactions ${TRANSACTION_ACTION_REASONS[key]}.`
    )
  ].join(' ');
}

module.exports = {
  getConversationsResponse,
  getItemsResponse,
  getTransactionsResponse,
};

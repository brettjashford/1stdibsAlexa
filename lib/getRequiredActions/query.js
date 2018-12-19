const query = `
query loadSellerRequiredActions(
  $sellerId: String!
  $sellerIdList: [String!]
) {
  viewer {
    conversations: conversationsSolr(
        sellerId: $sellerId
        sellerTags: "unanswered"
    ) {
      edges {
        node {
          hasBuyerRequest
        }
      }
      totalResults
    }
    items(
        dealerPk: $sellerIdList
        actionRequired: "true"
        queryTemplate: "dealer.inventory.management"
        includeContextAdmin: true
        sort: "-editDate"
    ) {
      edges {
        node {
          reviews {
            documents {
              modifiedDate
              reasonCode
              type
            }
          }
        }
      }
      totalResults
    }
    transactions(
      sellerId: $sellerIdList
      viewName: "dealer.dealerActionRequired"
      sort: "slaStartDate desc"
    ) {
      edges {
        node {
          canAccept: hasAction(actionCode: "DEALER_ACCEPT_OFFER")
          canProvideQuote: hasAction(actionCode: "DEALER_PROVIDE_QUOTE")
          canReview: hasAction(actionCode: "DEALER_REVIEW_FIRSTDIBS_QUOTE")
          canCounter: hasAction(actionCode: "DEALER_COUNTER_OFFER")
          canMarkShipped: hasAction(actionCode: "DEALER_MARK_SHIPPED")
          canMarkPickup: hasAction(actionCode: "DEALER_MARK_READY_FOR_PICKUP")
        }
      }
      totalResults
    }
  }
}
`;

module.exports = { query };

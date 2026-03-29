// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.patterns.strategy;

import com.auctionsystem.model.Bid;

/**
 * @author Chinmay
 * @description Validates bids using the standard highest-bid rule
 * @pattern Strategy
 * @solid OCP
 */
public class StandardBidValidation implements BidValidationStrategy {
    private String errorMessage;

    @Override
    public boolean validate(Bid bid, Double currentHighestBid) {
        if (currentHighestBid == null) {
            if (bid.getBidAmount() < bid.getItem().getStartingPrice()) {
                errorMessage = "Bid must be at least the starting price";
                return false;
            }
            return true;
        }

        if (bid.getBidAmount() <= currentHighestBid) {
            errorMessage = "Bid must be higher than current highest bid";
            return false;
        }

        return true;
    }

    @Override
    public String getErrorMessage() {
        return errorMessage;
    }
}

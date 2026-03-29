// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.patterns.strategy;

import com.auctionsystem.model.Bid;

/**
 * @author Chinmay
 * @description Validates bids against the minimum increment rule
 * @pattern Strategy
 * @solid OCP
 */
public class MinimumIncrementValidation implements BidValidationStrategy {
    private static final double MINIMUM_INCREMENT = 100.0;
    private String errorMessage;

    @Override
    public boolean validate(Bid bid, Double currentHighestBid) {
        if (currentHighestBid == null) {
            if (bid.getItem() == null || bid.getItem().getStartingPrice() == null) {
                errorMessage = "Item starting price is unavailable";
                return false;
            }
            return bid.getBidAmount() >= bid.getItem().getStartingPrice();
        }

        if (bid.getBidAmount() <= currentHighestBid) {
            errorMessage = "Bid must be higher than current highest bid";
            return false;
        }

        if (bid.getBidAmount() - currentHighestBid < MINIMUM_INCREMENT) {
            errorMessage = String.format("Bid must be at least \u20b9%.2f higher than current bid", MINIMUM_INCREMENT);
            return false;
        }

        return true;
    }

    @Override
    public String getErrorMessage() {
        return errorMessage;
    }
}

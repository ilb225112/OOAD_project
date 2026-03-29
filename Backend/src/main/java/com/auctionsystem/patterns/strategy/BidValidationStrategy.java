// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.patterns.strategy;

import com.auctionsystem.model.Bid;

/**
 * @author Chinmay
 * @description Defines the contract for interchangeable bid validation rules
 * @pattern Strategy
 * @solid OCP
 */
public interface BidValidationStrategy {
    boolean validate(Bid bid, Double currentHighestBid);
    String getErrorMessage();
}

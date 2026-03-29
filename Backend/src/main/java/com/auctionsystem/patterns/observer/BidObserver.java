// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.patterns.observer;

import com.auctionsystem.model.Bid;

/**
 * @author Bhavini
 * @description Defines the observer contract for bid event listeners
 * @pattern Observer
 * @solid ISP
 */
public interface BidObserver {
    void onBidPlaced(Bid bid);
}

// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.patterns.observer;

import com.auctionsystem.model.Bid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Bhavini
 * @description Observes bid events to emit bidder notifications
 * @pattern Observer
 * @solid SRP
 */
public class BidNotificationObserver implements BidObserver {
    private static final Logger logger = LoggerFactory.getLogger(BidNotificationObserver.class);

    @Override
    public void onBidPlaced(Bid bid) {
        logger.info("Notification: New bid of \u20b9{} placed by user {} on item {}",
            bid.getBidAmount(),
            bid.getBidder().getName(),
            bid.getItem().getName());
    }
}

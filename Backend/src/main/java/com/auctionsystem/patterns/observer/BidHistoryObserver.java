// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.patterns.observer;

import com.auctionsystem.model.Bid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Bhavini
 * @description Observes bid events to record bid history activity
 * @pattern Observer
 * @solid SRP
 */
public class BidHistoryObserver implements BidObserver {
    private static final Logger logger = LoggerFactory.getLogger(BidHistoryObserver.class);

    @Override
    public void onBidPlaced(Bid bid) {
        logger.info("Bid History: Auction={}, Item={}, Bidder={}, Amount=\u20b9{}, Time={}",
            bid.getAuction().getAuctionId(),
            bid.getItem().getItemId(),
            bid.getBidder().getUserId(),
            bid.getBidAmount(),
            bid.getBidTime());
    }
}

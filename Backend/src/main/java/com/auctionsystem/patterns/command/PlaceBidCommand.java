// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.patterns.command;

import com.auctionsystem.model.Bid;
import com.auctionsystem.service.BidService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Chirag
 * @description Encapsulates bid placement as an executable command
 * @pattern Command
 * @solid SRP
 */
public class PlaceBidCommand implements BidCommand {

    private static final Logger logger = LoggerFactory.getLogger(PlaceBidCommand.class);

    private final BidService bidService;
    private final Bid bid;
    private boolean executed = false;

    public PlaceBidCommand(BidService bidService, Bid bid) {
        this.bidService = bidService;
        this.bid = bid;
    }

    @Override
    public boolean execute() {
        if (executed) {
            logger.warn("Command already executed for bid on item {}", bid.getItem().getItemId());
            return false;
        }

        boolean success = bidService.placeBid(bid);
        if (success) {
            executed = true;
            logger.info("PlaceBidCommand executed successfully");
        }
        return success;
    }

    @Override
    public boolean undo() {
        if (!executed) {
            logger.warn("Cannot undo - command not executed");
            return false;
        }

        logger.info("PlaceBidCommand undo - would remove bid {}", bid.getBidId());
        executed = false;
        return true;
    }

    @Override
    public String getDescription() {
        return String.format("Place bid of \u20b9%.2f on item %d",
            bid.getBidAmount(),
            bid.getItem().getItemId());
    }

    public Bid getBid() {
        return bid;
    }

    public boolean isExecuted() {
        return executed;
    }
}

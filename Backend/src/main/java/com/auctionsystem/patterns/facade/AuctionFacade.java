// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.patterns.facade;

import com.auctionsystem.dto.BidDTO;
import com.auctionsystem.model.Auction;
import com.auctionsystem.model.Bid;
import com.auctionsystem.service.AuctionService;
import com.auctionsystem.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author Bhavini
 * @description Provides a simplified interface over auction and bid operations
 * @pattern Facade, Repository
 * @solid SRP
 */
@Component
public class AuctionFacade {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private BidService bidService;

    public AuctionDetailsResponse getAuctionDetails(Long auctionId) {
        List<Auction> auctions = auctionService.getUpcomingAuctions();
        Auction auction = auctions.stream()
            .filter(a -> a.getAuctionId().equals(auctionId))
            .findFirst()
            .orElse(null);

        if (auction == null) {
            auctions = auctionService.getLiveAuctions();
            auction = auctions.stream()
                .filter(a -> a.getAuctionId().equals(auctionId))
                .findFirst()
                .orElse(null);
        }

        if (auction == null) {
            auctions = auctionService.getCompletedAuctions();
            auction = auctions.stream()
                .filter(a -> a.getAuctionId().equals(auctionId))
                .findFirst()
                .orElse(null);
        }

        return new AuctionDetailsResponse(auction);
    }

    public BidPlacementResponse placeBidWithValidation(Bid bid) {
        BidDTO currentBid = bidService.getLatestBidForItemInAuction(
            bid.getAuction().getAuctionId(),
            bid.getItem().getItemId()
        );

        boolean success = bidService.placeBid(bid);

        return new BidPlacementResponse(success,
            success ? "Bid placed successfully" : "Failed to place bid");
    }

    public static class AuctionDetailsResponse {
        private Auction auction;

        public AuctionDetailsResponse(Auction auction) {
            this.auction = auction;
        }

        public Auction getAuction() {
            return auction;
        }
    }

    public static class BidPlacementResponse {
        private boolean success;
        private String message;

        public BidPlacementResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }
    }
}

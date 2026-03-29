// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.controller;

/**
 * USE CASE OWNER: Chinmay
 * USE CASE: Bid Management
 * FEATURES:
 *   Major: Place bids, get latest bid for an item, get complete bid history
 *   Minor: Mark items as sold after auction closes
 */

import com.auctionsystem.dto.BidDTO;
import com.auctionsystem.dto.PlaceBidRequest;
import com.auctionsystem.model.*;
import com.auctionsystem.patterns.command.BidCommandInvoker;
import com.auctionsystem.patterns.command.PlaceBidCommand;
import com.auctionsystem.patterns.strategy.MinimumIncrementValidation;
import com.auctionsystem.patterns.strategy.StandardBidValidation;
import com.auctionsystem.service.BidService;
import com.auctionsystem.service.impl.BidServiceImpl;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author Chinmay
 * @description Exposes bid placement, bid history, and sell-item endpoints
 * @pattern Command, Strategy, Observer
 * @solid SRP
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @Autowired
    private BidCommandInvoker bidCommandInvoker;

    @Autowired
    private BidServiceImpl bidServiceImpl;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @GetMapping("/latestBid/{auctionId}/{itemId}")
    public ResponseEntity<BidDTO> getLatestBidForItem(@PathVariable Long auctionId, @PathVariable Long itemId) {
        BidDTO latestBid = bidService.getLatestBidForItemInAuction(auctionId, itemId);

        if (latestBid == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(latestBid);
    }

    @PostMapping("/sellItem/{itemId}")
    public ResponseEntity<String> sellItem(@PathVariable Long itemId, @RequestBody Map<String, Object> bidData) {
        boolean isSold = bidService.sellItem(itemId, bidData);
        return isSold ? ResponseEntity.ok("Item sold successfully")
                : ResponseEntity.badRequest().body("Error selling item");
    }

    @PostMapping("/placeBid")
    public ResponseEntity<String> placeBid(@RequestBody PlaceBidRequest request) {
        PlaceBidCommand command = new PlaceBidCommand(bidService, toBid(request));
        boolean success = bidCommandInvoker.executeCommand(command);
        return success ? ResponseEntity.ok("Bid placed successfully")
                : ResponseEntity.badRequest().body("Bid placement failed");
    }

    @PostMapping("/placeBid/standard")
    public ResponseEntity<String> placeBidWithStandardValidation(@RequestBody PlaceBidRequest request) {
        // Demonstrates that the bid validation strategy can be swapped at runtime.
        bidServiceImpl.setValidationStrategy(new StandardBidValidation());
        try {
            boolean success = bidService.placeBid(toBid(request));
            return success
                ? ResponseEntity.ok("Bid placed successfully using standard validation")
                : ResponseEntity.badRequest().body("Bid placement failed using standard validation");
        } finally {
            bidServiceImpl.setValidationStrategy(new MinimumIncrementValidation());
        }
    }

    @GetMapping("/bidHistory/{auctionId}/{itemId}")
    public ResponseEntity<List<BidDTO>> getBidHistory(@PathVariable Long auctionId, @PathVariable Long itemId) {
        List<BidDTO> bidHistory = bidService.getBidHistory(auctionId, itemId);
        return ResponseEntity.ok(bidHistory);
    }

    private Bid toBid(PlaceBidRequest request) {
        Bid bid = new Bid();
        bid.setBidAmount(request.getBidAmount());

        if (request.getAuctionId() != null) {
            Auction auction = new Auction();
            auction.setAuctionId(request.getAuctionId());
            bid.setAuction(auction);
        }

        if (request.getItemId() != null) {
            Item item = new Item();
            item.setItemId(request.getItemId());
            bid.setItem(item);
        }

        if (request.getBidderId() != null) {
            Users bidder = new Users();
            bidder.setUserId(request.getBidderId());
            bid.setBidder(bidder);
        }

        return bid;
    }
}

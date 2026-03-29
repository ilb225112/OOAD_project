// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.controller;

/**
 * USE CASE OWNER: Brunda
 * USE CASE: Auction Management
 * FEATURES:
 *   Major: Create auctions, retrieve upcoming/live/completed auction listings
 *   Minor: Add items to existing auctions, fetch items by auction ID
 */

import com.auctionsystem.dto.ItemDTO;
import com.auctionsystem.model.*;
import com.auctionsystem.patterns.facade.AuctionFacade;
import com.auctionsystem.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @author Brunda
 * @description Exposes auction creation, listing, and item retrieval endpoints
 * @pattern Facade, Factory, Builder
 * @solid SRP
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private AuctionFacade auctionFacade;

    @GetMapping("/upcoming")
    public List<Auction> getUpcomingAuctions() {
        return auctionService.getUpcomingAuctions();
    }

    @GetMapping("/live")
    public List<Auction> getLiveAuctions() {
        return auctionService.getLiveAuctions();
    }

    @GetMapping("/completed")
    public List<Auction> getCompletedAuctions() {
        return auctionService.getCompletedAuctions();
    }

    @PostMapping("/createAuction")
    public ResponseEntity<Auction> createAuction(@RequestBody Auction auction) {
        return new ResponseEntity<>(auctionService.createAuction(auction), HttpStatus.CREATED);
    }

    @PostMapping("/addItem/{auctionId}")
    public ResponseEntity<ItemDTO> addItemToAuction(@PathVariable Long auctionId, @RequestBody Item item) {
        return new ResponseEntity<>(auctionService.addItemToAuction(auctionId, item), HttpStatus.CREATED);
    }

    @GetMapping("/auctionItems/{auctionId}")
    public List<ItemDTO> getItemsByAuctionId(@PathVariable Long auctionId) {
        return auctionService.getItemsByAuctionId(auctionId);
    }

    @GetMapping("/details/{auctionId}")
    public ResponseEntity<AuctionFacade.AuctionDetailsResponse> getAuctionDetails(@PathVariable Long auctionId) {
        AuctionFacade.AuctionDetailsResponse response = auctionFacade.getAuctionDetails(auctionId);
        if (response.getAuction() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/auctions/{auctionId}/status
     * Body: { "status": "LIVE" | "UPCOMING" | "COMPLETED" }
     * Allows the admin to manually promote or demote an auction's status.
     */
    @PutMapping("/{auctionId}/status")
    public ResponseEntity<Auction> updateAuctionStatus(
            @PathVariable Long auctionId,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Auction updated = auctionService.updateStatus(auctionId, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

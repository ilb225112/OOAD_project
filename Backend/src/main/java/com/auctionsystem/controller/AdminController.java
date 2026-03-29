// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.controller;

/**
 * USE CASE OWNER: Bhavini
 * USE CASE: Admin Management
 * FEATURES:
 *   Major: View all registered bidders for an auction
 *   Minor: Delete/remove a bidder from an auction
 */

import com.auctionsystem.service.AdminService;
import com.auctionsystem.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author Bhavini
 * @description Exposes admin-facing endpoints for monitoring auctions and users
 * @pattern Facade, Repository
 * @solid SRP
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/bidders/{auctionId}")
    public List<BidderDTO> getRegisteredBidders(@PathVariable Long auctionId) {
        return adminService.getRegisteredBidders(auctionId);
    }

    @DeleteMapping("/deleteBidder/{auctionId}/{userId}")
    public void deleteBidder(@PathVariable Long auctionId, @PathVariable Long userId) {
        adminService.deleteBidderFromAuction(auctionId, userId);
    }
}

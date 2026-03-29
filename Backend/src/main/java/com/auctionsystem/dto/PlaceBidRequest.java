// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.dto;

import com.auctionsystem.model.Auction;
import com.auctionsystem.model.Item;
import com.auctionsystem.model.Users;

/**
 * @author Chinmay
 * @description Captures bid placement payloads using flat ids with backward-compatible nested fallbacks
 * @pattern Command, DTO
 * @solid SRP
 */
public class PlaceBidRequest {

    private Long auctionId;
    private Long itemId;
    private Long bidderId;
    private Double bidAmount;

    // Backward-compatible nested payload support for existing clients.
    private Auction auction;
    private Item item;
    private Users bidder;

    public Long getAuctionId() {
        return auctionId != null ? auctionId : auction != null ? auction.getAuctionId() : null;
    }

    public void setAuctionId(Long auctionId) {
        this.auctionId = auctionId;
    }

    public Long getItemId() {
        return itemId != null ? itemId : item != null ? item.getItemId() : null;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getBidderId() {
        return bidderId != null ? bidderId : bidder != null ? bidder.getUserId() : null;
    }

    public void setBidderId(Long bidderId) {
        this.bidderId = bidderId;
    }

    public Double getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(Double bidAmount) {
        this.bidAmount = bidAmount;
    }

    public Auction getAuction() {
        return auction;
    }

    public void setAuction(Auction auction) {
        this.auction = auction;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public Users getBidder() {
        return bidder;
    }

    public void setBidder(Users bidder) {
        this.bidder = bidder;
    }
}

// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.model;

import jakarta.persistence.*;
import java.util.Date;

/**
 * @author Chinmay
 * @description Represents a bid placed on an auction item
 * @pattern Repository
 * @solid SRP
 */
@Entity
@Table(name = "bid")
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bidId;

    private Double bidAmount;

    @Temporal(TemporalType.TIMESTAMP)
    private Date bidTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bidder_id", nullable = false)
    private Users bidder;

    public Bid() {}

    public Long getBidId() { return bidId; }
    public void setBidId(Long bidId) { this.bidId = bidId; }

    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }

    public Date getBidTime() { return bidTime; }
    public void setBidTime(Date bidTime) { this.bidTime = bidTime; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public Auction getAuction() { return auction; }
    public void setAuction(Auction auction) { this.auction = auction; }

    public Users getBidder() { return bidder; }
    public void setBidder(Users bidder) { this.bidder = bidder; }
}

// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

/**
 * @author Brunda
 * @description Represents an item listed inside an auction
 * @pattern Builder, Repository
 * @solid SRP
 */
@Entity
@Table(name = "item")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    private String name;

    @Column(length = 1000)
    private String description;

    private Double startingPrice;

    // "AVAILABLE", "SOLD", "UNSOLD"
    private String status;

    private String imageUrl;

    @JsonBackReference("auction-items")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id")
    private Auction auction;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_bidder_id")
    private Users winnerBidder;

    public Item() {}

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getStartingPrice() { return startingPrice; }
    public void setStartingPrice(Double startingPrice) { this.startingPrice = startingPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Auction getAuction() { return auction; }
    public void setAuction(Auction auction) { this.auction = auction; }

    public Users getWinnerBidder() { return winnerBidder; }
    public void setWinnerBidder(Users winnerBidder) { this.winnerBidder = winnerBidder; }
}

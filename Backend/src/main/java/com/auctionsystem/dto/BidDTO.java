// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.dto;

import java.util.Date;

/**
 * @author Chinmay
 * @description Carries bid details between backend and client layers
 * @pattern Adapter
 * @solid SRP
 */
public class BidDTO {

    private Long bidId;
    private Double bidAmount;
    private Date bidTime;
    private Long itemId;
    private Long auctionId;
    private Long bidderId;
    private String bidderName;

    public BidDTO() {}

    public Long getBidId() { return bidId; }
    public void setBidId(Long bidId) { this.bidId = bidId; }

    public Double getBidAmount() { return bidAmount; }
    public void setBidAmount(Double bidAmount) { this.bidAmount = bidAmount; }

    public Date getBidTime() { return bidTime; }
    public void setBidTime(Date bidTime) { this.bidTime = bidTime; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Long getAuctionId() { return auctionId; }
    public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }

    public Long getBidderId() { return bidderId; }
    public void setBidderId(Long bidderId) { this.bidderId = bidderId; }

    public String getBidderName() { return bidderName; }
    public void setBidderName(String bidderName) { this.bidderName = bidderName; }
}

// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.dto;

import java.util.Date;
import java.util.List;
/**
 * @author Chirag
 * @description Carries registered auction details for bidder dashboards
 * @pattern Adapter
 * @solid ISP
 */
public class BidderAuctionDTO {

    private Long auctionId;
    private String auctionName;
    private String auctionType;
    private Date auctionDate;
    private String status;
    private List<ItemDTO> items;

    public BidderAuctionDTO() {}

    public Long getAuctionId() { return auctionId; }
    public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }

    public String getAuctionName() { return auctionName; }
    public void setAuctionName(String auctionName) { this.auctionName = auctionName; }

    public String getAuctionType() { return auctionType; }
    public void setAuctionType(String auctionType) { this.auctionType = auctionType; }

    public Date getAuctionDate() { return auctionDate; }
    public void setAuctionDate(Date auctionDate) { this.auctionDate = auctionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<ItemDTO> getItems() { return items; }
    public void setItems(List<ItemDTO> items) { this.items = items; }
}

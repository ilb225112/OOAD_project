// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.dto;

import com.auctionsystem.model.Item;

/**
 * @author Brunda
 * @description Carries auction item data to the client layer
 * @pattern Adapter
 * @solid SRP
 */
public class ItemDTO {

    private Long itemId;
    private String name;
    private String description;
    private Double startingPrice;
    private String status;
    private String imageUrl;
    private Long auctionId;

    public ItemDTO() {}

    public ItemDTO(Item item) {
        this.itemId = item.getItemId();
        this.name = item.getName();
        this.description = item.getDescription();
        this.startingPrice = item.getStartingPrice();
        this.status = item.getStatus();
        this.imageUrl = item.getImageUrl();
        if (item.getAuction() != null) {
            this.auctionId = item.getAuction().getAuctionId();
        }
    }

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

    public Long getAuctionId() { return auctionId; }
    public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }
}

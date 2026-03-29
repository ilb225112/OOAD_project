// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.patterns.builder;

import com.auctionsystem.constants.ItemStatus;
import com.auctionsystem.model.Auction;
import com.auctionsystem.model.Item;
import com.auctionsystem.model.Users;

/**
 * @author Brunda
 * @description Builds Item objects through a fluent construction API
 * @pattern Builder
 * @solid SRP
 */
public class ItemBuilder {
    private Item item;

    public ItemBuilder() {
        this.item = new Item();
        this.item.setStatus(ItemStatus.AVAILABLE.getValue());
    }

    public ItemBuilder withName(String name) {
        this.item.setName(name);
        return this;
    }

    public ItemBuilder withDescription(String description) {
        this.item.setDescription(description);
        return this;
    }

    public ItemBuilder withStartingPrice(Double startingPrice) {
        this.item.setStartingPrice(startingPrice);
        return this;
    }

    public ItemBuilder withImageUrl(String imageUrl) {
        this.item.setImageUrl(imageUrl);
        return this;
    }

    public ItemBuilder withAuction(Auction auction) {
        this.item.setAuction(auction);
        return this;
    }

    public ItemBuilder withStatus(ItemStatus status) {
        this.item.setStatus(status.getValue());
        return this;
    }

    public ItemBuilder withWinner(Users winner) {
        this.item.setWinnerBidder(winner);
        this.item.setStatus(ItemStatus.SOLD.getValue());
        return this;
    }

    public Item build() {
        validateItem();
        return this.item;
    }

    private void validateItem() {
        if (item.getName() == null || item.getName().trim().isEmpty()) {
            throw new IllegalStateException("Item name is required");
        }
        if (item.getStartingPrice() == null || item.getStartingPrice() <= 0) {
            throw new IllegalStateException("Starting price must be greater than 0");
        }
        if (item.getAuction() == null) {
            throw new IllegalStateException("Item must be associated with an auction");
        }
    }

    public static ItemBuilder builder() {
        return new ItemBuilder();
    }
}

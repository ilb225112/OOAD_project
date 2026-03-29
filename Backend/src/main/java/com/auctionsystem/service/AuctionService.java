// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.service;

import com.auctionsystem.dto.ItemDTO;
import com.auctionsystem.model.Auction;
import com.auctionsystem.model.Item;

import java.util.List;

/**
 * @author Brunda
 * @description Defines the auction and item business operations
 * @pattern Factory, Builder, Repository
 * @solid SRP
 */
public interface AuctionService {

    List<Auction> getUpcomingAuctions();

    List<Auction> getLiveAuctions();

    List<Auction> getCompletedAuctions();

    Auction createAuction(Auction auction);

    ItemDTO addItemToAuction(Long auctionId, Item item);

    List<ItemDTO> getItemsByAuctionId(Long auctionId);

    Auction updateStatus(Long auctionId, String status);
}

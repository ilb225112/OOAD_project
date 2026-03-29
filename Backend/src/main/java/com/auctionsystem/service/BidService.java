// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.service;

import com.auctionsystem.dto.BidDTO;
import com.auctionsystem.model.Bid;

import java.util.List;
import java.util.Map;

/**
 * @author Chinmay
 * @description Defines the bidding operations used by controllers and facades
 * @pattern Strategy, Observer, Command, Repository
 * @solid SRP
 */
public interface BidService {

    boolean placeBid(Bid bid);

    BidDTO getLatestBidForItemInAuction(Long auctionId, Long itemId);

    List<BidDTO> getBidHistory(Long auctionId, Long itemId);

    boolean sellItem(Long itemId, Map<String, Object> bidData);
}

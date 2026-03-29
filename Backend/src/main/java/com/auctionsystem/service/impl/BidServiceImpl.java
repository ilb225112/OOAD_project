// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.service.impl;

import com.auctionsystem.dto.BidDTO;
import com.auctionsystem.model.Auction;
import com.auctionsystem.model.Bid;
import com.auctionsystem.model.Item;
import com.auctionsystem.model.Users;
import com.auctionsystem.patterns.observer.BidHistoryObserver;
import com.auctionsystem.patterns.observer.BidNotificationObserver;
import com.auctionsystem.patterns.observer.BidObserver;
import com.auctionsystem.patterns.strategy.BidValidationStrategy;
import com.auctionsystem.patterns.strategy.MinimumIncrementValidation;
import com.auctionsystem.repository.AuctionRepository;
import com.auctionsystem.repository.BidRepository;
import com.auctionsystem.repository.ItemRepository;
import com.auctionsystem.repository.UserRepository;
import com.auctionsystem.service.BidService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * @author Chinmay
 * @description Implements bid validation, placement, history, and sell-item workflows
 * @pattern Strategy, Observer, Command, Repository
 * @solid OCP
 */
@Service
public class BidServiceImpl implements BidService {

    private static final Logger logger = LoggerFactory.getLogger(BidServiceImpl.class);

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    // Observers for the Observer Pattern
    private final List<BidObserver> observers = new ArrayList<>();

    // Strategy for bid validation
    private BidValidationStrategy validationStrategy = new MinimumIncrementValidation();

    public void setValidationStrategy(BidValidationStrategy strategy) {
        this.validationStrategy = strategy;
    }

    public void addObserver(BidObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(BidObserver observer) {
        observers.remove(observer);
    }

    private void notifyObservers(Bid bid) {
        for (BidObserver observer : observers) {
            observer.onBidPlaced(bid);
        }
    }

    @Override
    @Transactional
    public boolean placeBid(Bid bid) {
        if (bid == null) {
            logger.warn("Bid is null");
            return false;
        }
        if (bid.getItem() == null || bid.getItem().getItemId() == null) {
            logger.warn("Bid has no item");
            return false;
        }
        if (bid.getAuction() == null || bid.getAuction().getAuctionId() == null) {
            logger.warn("Bid has no auction");
            return false;
        }
        if (bid.getBidder() == null || bid.getBidder().getUserId() == null) {
            logger.warn("Bid has no bidder");
            return false;
        }
        if (bid.getBidAmount() == null || bid.getBidAmount() <= 0) {
            logger.warn("Invalid bid amount: {}", bid.getBidAmount());
            return false;
        }

        Optional<Auction> auctionOpt = auctionRepository.findById(bid.getAuction().getAuctionId());
        if (auctionOpt.isEmpty()) {
            logger.warn("Auction not found: {}", bid.getAuction().getAuctionId());
            return false;
        }

        Optional<Item> itemOpt = itemRepository.findById(bid.getItem().getItemId());
        if (itemOpt.isEmpty()) {
            logger.warn("Item not found: {}", bid.getItem().getItemId());
            return false;
        }

        Optional<Users> bidderOpt = userRepository.findById(bid.getBidder().getUserId());
        if (bidderOpt.isEmpty()) {
            logger.warn("Bidder not found: {}", bid.getBidder().getUserId());
            return false;
        }

        Auction auction = auctionOpt.get();
        Item item = itemOpt.get();
        Users bidder = bidderOpt.get();

        if (item.getAuction() == null || !auction.getAuctionId().equals(item.getAuction().getAuctionId())) {
            logger.warn("Item {} does not belong to auction {}", item.getItemId(), auction.getAuctionId());
            return false;
        }

        bid.setAuction(auction);
        bid.setItem(item);
        bid.setBidder(bidder);

        // Fetch current highest bid for validation
        Optional<Bid> latestBidOpt = bidRepository.findLatestBidForItemInAuction(
            bid.getAuction().getAuctionId(),
            bid.getItem().getItemId()
        );
        Double currentHighest = latestBidOpt.map(Bid::getBidAmount).orElse(null);

        // Apply Strategy Pattern validation
        if (!validationStrategy.validate(bid, currentHighest)) {
            logger.warn("Bid validation failed: {}", validationStrategy.getErrorMessage());
            return false;
        }

        bid.setBidTime(new Date());
        observers.clear();
        observers.add(new BidHistoryObserver());
        observers.add(new BidNotificationObserver());

        try {
            bidRepository.save(bid);
            logger.info("Bid saved: ₹{} on item {}", bid.getBidAmount(), bid.getItem().getItemId());
            notifyObservers(bid);  // Observer Pattern notification
            return true;
        } catch (Exception e) {
            logger.error("Failed to save bid", e);
            return false;
        }
    }

    @Override
    public BidDTO getLatestBidForItemInAuction(Long auctionId, Long itemId) {
        return bidRepository.findLatestBidForItemInAuction(auctionId, itemId)
            .map(this::toDTO)
            .orElse(null);
    }

    @Override
    public List<BidDTO> getBidHistory(Long auctionId, Long itemId) {
        List<Bid> bids = bidRepository
            .findByAuction_AuctionIdAndItem_ItemIdOrderByBidAmountDesc(auctionId, itemId);
        List<BidDTO> result = new ArrayList<>();
        for (Bid bid : bids) {
            result.add(toDTO(bid));
        }
        return result;
    }

    @Override
    @Transactional
    public boolean sellItem(Long itemId, Map<String, Object> bidData) {
        Optional<Item> itemOpt = itemRepository.findById(itemId);
        if (itemOpt.isEmpty()) {
            logger.warn("Item not found: {}", itemId);
            return false;
        }

        Item item = itemOpt.get();

        try {
            Long winnerUserId = Long.valueOf(bidData.get("userId").toString());
            Optional<Users> winnerOpt = userRepository.findById(winnerUserId);
            if (winnerOpt.isEmpty()) {
                logger.warn("Winner user not found: {}", winnerUserId);
                return false;
            }
            item.setWinnerBidder(winnerOpt.get());
            item.setStatus("SOLD");
            itemRepository.save(item);
            logger.info("Item {} marked as SOLD to user {}", itemId, winnerUserId);
            return true;
        } catch (Exception e) {
            logger.error("Failed to sell item {}", itemId, e);
            return false;
        }
    }

    private BidDTO toDTO(Bid bid) {
        BidDTO dto = new BidDTO();
        dto.setBidId(bid.getBidId());
        dto.setBidAmount(bid.getBidAmount());
        dto.setBidTime(bid.getBidTime());
        if (bid.getItem() != null) dto.setItemId(bid.getItem().getItemId());
        if (bid.getAuction() != null) dto.setAuctionId(bid.getAuction().getAuctionId());
        if (bid.getBidder() != null) {
            dto.setBidderId(bid.getBidder().getUserId());
            dto.setBidderName(bid.getBidder().getName());
        }
        return dto;
    }
}

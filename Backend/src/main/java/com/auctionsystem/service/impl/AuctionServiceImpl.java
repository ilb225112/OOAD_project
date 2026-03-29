// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.service.impl;

import com.auctionsystem.constants.ItemStatus;
import com.auctionsystem.dto.ItemDTO;
import com.auctionsystem.model.Auction;
import com.auctionsystem.model.Item;
import com.auctionsystem.patterns.builder.ItemBuilder;
import com.auctionsystem.patterns.factory.AuctionFactory;
import com.auctionsystem.repository.AuctionRepository;
import com.auctionsystem.repository.ItemRepository;
import com.auctionsystem.service.AuctionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author Brunda
 * @description Implements auction creation, item creation, and auction item retrieval
 * @pattern Factory, Builder, Repository
 * @solid SRP
 */
@Service
public class AuctionServiceImpl implements AuctionService {

    private static final Logger logger = LoggerFactory.getLogger(AuctionServiceImpl.class);

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Override
    public List<Auction> getUpcomingAuctions() {
        return auctionRepository.findByStatus("UPCOMING");
    }

    @Override
    public List<Auction> getLiveAuctions() {
        return auctionRepository.findByStatus("LIVE");
    }

    @Override
    public List<Auction> getCompletedAuctions() {
        return auctionRepository.findByStatus("COMPLETED");
    }

    @Override
    @Transactional
    public Auction createAuction(Auction auction) {
        if (auction.getName() == null || auction.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Auction name is required");
        }
        if (auction.getAuctionDate() == null) {
            throw new IllegalArgumentException("Auction date is required");
        }
        if (auction.getAuctionType() == null) {
            throw new IllegalArgumentException("Auction type is required");
        }

        int duration = (auction.getDurationMinutes() != null && auction.getDurationMinutes() > 0)
            ? auction.getDurationMinutes() : 60;

        Auction createdAuction = AuctionFactory.createAuction(
            auction.getName(),
            auction.getAuctionType(),
            auction.getAuctionDate(),
            duration
        );

        // Preserve current default behavior while routing construction through the factory.
        if (auction.getStatus() == null || auction.getStatus().trim().isEmpty()) {
            createdAuction.setStatus("UPCOMING");
        } else {
            createdAuction.setStatus(auction.getStatus());
        }

        createdAuction.setItems(auction.getItems());
        createdAuction.setRegisteredBidders(auction.getRegisteredBidders());

        Auction saved = auctionRepository.save(createdAuction);
        logger.info("Created auction '{}' with id {}", saved.getName(), saved.getAuctionId());
        return saved;
    }

    @Override
    @Transactional
    public ItemDTO addItemToAuction(Long auctionId, Item item) {
        Optional<Auction> auctionOpt = auctionRepository.findById(auctionId);
        if (auctionOpt.isEmpty()) {
            throw new IllegalArgumentException("Auction not found with id: " + auctionId);
        }

        if (item.getName() == null || item.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Item name is required");
        }
        if (item.getStartingPrice() == null || item.getStartingPrice() <= 0) {
            throw new IllegalArgumentException("Starting price must be greater than 0");
        }

        ItemBuilder builder = new ItemBuilder()
            .withName(item.getName())
            .withDescription(item.getDescription())
            .withStartingPrice(item.getStartingPrice())
            .withImageUrl(item.getImageUrl())
            .withAuction(auctionOpt.get());

        if (item.getStatus() != null && !item.getStatus().trim().isEmpty()) {
            builder.withStatus(ItemStatus.valueOf(item.getStatus().trim().toUpperCase()));
        }

        Item saved = itemRepository.save(builder.build());
        logger.info("Added item '{}' to auction {}", saved.getName(), auctionId);
        return new ItemDTO(saved);
    }

    @Override
    public List<ItemDTO> getItemsByAuctionId(Long auctionId) {
        return itemRepository.findByAuction_AuctionId(auctionId)
            .stream()
            .map(ItemDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Auction updateStatus(Long auctionId, String status) {
        Auction auction = auctionRepository.findById(auctionId)
            .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + auctionId));
        String upper = status.toUpperCase();
        auction.setStatus(upper);
        // Record when the auction went live so clients can compute remaining time accurately
        if ("LIVE".equals(upper) && auction.getStartedAt() == null) {
            auction.setStartedAt(new java.util.Date());
        }
        Auction saved = auctionRepository.save(auction);
        logger.info("Auction {} status updated to {}", auctionId, upper);
        return saved;
    }
}

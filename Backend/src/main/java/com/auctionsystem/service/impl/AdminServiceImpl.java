// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.service.impl;

import com.auctionsystem.dto.BidderDTO;
import com.auctionsystem.model.Auction;
import com.auctionsystem.model.Users;
import com.auctionsystem.repository.AuctionRepository;
import com.auctionsystem.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author Bhavini
 * @description Implements admin monitoring and bidder management workflows
 * @pattern Facade, Repository, Observer
 * @solid SRP
 */
@Service
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    @Autowired
    private AuctionRepository auctionRepository;

    @Override
    public List<BidderDTO> getRegisteredBidders(Long auctionId) {
        Optional<Auction> auctionOpt = auctionRepository.findById(auctionId);
        if (auctionOpt.isEmpty() || auctionOpt.get().getRegisteredBidders() == null) {
            return new ArrayList<>();
        }
        return auctionOpt.get().getRegisteredBidders().stream().map(user -> {
            BidderDTO dto = new BidderDTO();
            dto.setUserId(user.getUserId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteBidderFromAuction(Long auctionId, Long userId) {
        Optional<Auction> auctionOpt = auctionRepository.findById(auctionId);
        if (auctionOpt.isEmpty()) {
            logger.warn("Auction not found: {}", auctionId);
            return;
        }
        Auction auction = auctionOpt.get();
        List<Users> bidders = auction.getRegisteredBidders();
        if (bidders == null) return;

        boolean removed = bidders.removeIf(u -> u.getUserId().equals(userId));
        if (removed) {
            auctionRepository.save(auction);
            logger.info("Removed user {} from auction {}", userId, auctionId);
        } else {
            logger.warn("User {} was not registered for auction {}", userId, auctionId);
        }
    }
}

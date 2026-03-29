// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.service.impl;

import com.auctionsystem.dto.AllUsersDTO;
import com.auctionsystem.dto.BidderAuctionDTO;
import com.auctionsystem.dto.ItemDTO;
import com.auctionsystem.dto.UserDetailsDTO;
import com.auctionsystem.model.Auction;
import com.auctionsystem.model.Users;
import com.auctionsystem.repository.AuctionRepository;
import com.auctionsystem.repository.ItemRepository;
import com.auctionsystem.repository.UserRepository;
import com.auctionsystem.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author Chirag
 * @description Implements registration, authentication, profile, and bidder workflows
 * @pattern Repository, Command
 * @solid DIP
 */
@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public String registerUser(Users user) {
        if (user == null) {
            throw new IllegalArgumentException("User payload cannot be null");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return "Email already in use";
        }

        user.setRole("BIDDER");
        saveUser(user);
        return "Registration successful";
    }

    @Override
    @Transactional
    public void saveUser(Users user) {
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        // Hash password with BCrypt before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        logger.info("Registered new user: {}", user.getEmail());
    }

    @Override
    public Optional<Users> findByEmailAndPassword(String email, String password) {
        Optional<Users> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt;
        }
        logger.warn("Login failed for email: {}", email);
        return Optional.empty();
    }

    @Override
    public UserDetailsDTO getUserDetails(Long userId) {
        return userRepository.findById(userId).map(user -> {
            UserDetailsDTO dto = new UserDetailsDTO();
            dto.setUserId(user.getUserId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
            dto.setPhone(user.getPhone());
            return dto;
        }).orElse(null);
    }

    @Override
    public List<AllUsersDTO> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            AllUsersDTO dto = new AllUsersDTO();
            dto.setUserId(user.getUserId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Auction> getUnregisteredAuctions(Long userId) {
        // Include both UPCOMING and LIVE so users can browse and register for live auctions
        List<Auction> allVisible = new ArrayList<>();
        allVisible.addAll(auctionRepository.findByStatus("UPCOMING"));
        allVisible.addAll(auctionRepository.findByStatus("LIVE"));

        Optional<Users> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return allVisible;

        List<Long> registeredIds = userOpt.get().getRegisteredAuctions() == null
            ? new ArrayList<>()
            : userOpt.get().getRegisteredAuctions().stream()
                .map(Auction::getAuctionId)
                .collect(Collectors.toList());

        return allVisible.stream()
            .filter(a -> !registeredIds.contains(a.getAuctionId()))
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void registerBidder(Long userId, Long auctionId) {
        Users user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        Auction auction = auctionRepository.findById(auctionId)
            .orElseThrow(() -> new IllegalArgumentException("Auction not found: " + auctionId));

        List<Users> bidders = auction.getRegisteredBidders();
        if (bidders == null) bidders = new ArrayList<>();

        boolean alreadyRegistered = bidders.stream()
            .anyMatch(b -> b.getUserId().equals(userId));
        if (!alreadyRegistered) {
            bidders.add(user);
            auction.setRegisteredBidders(bidders);
            auctionRepository.save(auction);
            logger.info("User {} registered for auction {}", userId, auctionId);
        } else {
            logger.warn("User {} already registered for auction {}", userId, auctionId);
        }
    }

    @Override
    public List<BidderAuctionDTO> getRegisteredAuctionsWithStatus(Long userId) {
        Optional<Users> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || userOpt.get().getRegisteredAuctions() == null) {
            return new ArrayList<>();
        }
        return userOpt.get().getRegisteredAuctions().stream().map(auction -> {
            BidderAuctionDTO dto = new BidderAuctionDTO();
            dto.setAuctionId(auction.getAuctionId());
            dto.setAuctionName(auction.getName());
            dto.setAuctionType(auction.getAuctionType() == null ? null : auction.getAuctionType().name());
            dto.setAuctionDate(auction.getAuctionDate());
            dto.setStatus(auction.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ItemDTO> getPurchasedItems(Long userId, Long auctionId) {
        return itemRepository.findByAuction_AuctionId(auctionId).stream()
            .filter(item -> item.getWinnerBidder() != null
                && item.getWinnerBidder().getUserId().equals(userId))
            .map(ItemDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public String changePassword(Long userId, String oldPassword, String newPassword) {
        Optional<Users> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return "User not found";
        }
        Users user = userOpt.get();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return "Old password is incorrect";
        }
        if (newPassword == null || newPassword.isBlank() || newPassword.length() < 6) {
            return "New password must be at least 6 characters";
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        logger.info("Password updated for user {}", userId);
        return "Password updated successfully";
    }
}

// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.service;

import com.auctionsystem.dto.AllUsersDTO;
import com.auctionsystem.dto.BidderAuctionDTO;
import com.auctionsystem.dto.ItemDTO;
import com.auctionsystem.dto.UserDetailsDTO;
import com.auctionsystem.model.Auction;
import com.auctionsystem.model.Users;

import java.util.List;
import java.util.Optional;

/**
 * @author Chirag
 * @description Defines the user and bidder business operations
 * @pattern Repository, Command
 * @solid ISP
 */
public interface UserService {

    boolean existsByEmail(String email);

    String registerUser(Users user);

    void saveUser(Users user);

    Optional<Users> findByEmailAndPassword(String email, String password);

    UserDetailsDTO getUserDetails(Long userId);

    List<AllUsersDTO> getAllUsers();

    List<Auction> getUnregisteredAuctions(Long userId);

    void registerBidder(Long userId, Long auctionId);

    List<BidderAuctionDTO> getRegisteredAuctionsWithStatus(Long userId);

    List<ItemDTO> getPurchasedItems(Long userId, Long auctionId);

    String changePassword(Long userId, String oldPassword, String newPassword);
}

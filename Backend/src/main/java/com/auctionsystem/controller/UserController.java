// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.controller;

/**
 * USE CASE OWNER: Chirag
 * USE CASE: User Management
 * FEATURES:
 *   Major: User registration, login authentication, profile/details retrieval
 *   Minor: Register for auctions, view purchased items, change password
 */

import com.auctionsystem.dto.*;
import com.auctionsystem.model.*;
import com.auctionsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * @author Chirag
 * @description Exposes registration, login, profile, and bidder actions
 * @pattern Repository
 * @solid SRP
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Users user) {
        String response = userService.registerUser(user);
        return "Registration successful".equals(response)
            ? ResponseEntity.ok(response)
            : ResponseEntity.badRequest().body(response);
    }

    /**
     * Login user with BCrypt password verification
     */
    @PostMapping("/login")
    public ResponseEntity<UserDetailsDTO> loginUser(@RequestBody Users loginRequest) {
        Optional<Users> userOpt = userService.findByEmailAndPassword(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        );

        if (userOpt.isPresent()) {
            UserDetailsDTO userResponse = userService.getUserDetails(userOpt.get().getUserId());
            return ResponseEntity.ok(userResponse);
        }
        return ResponseEntity.badRequest().body(null);
    }

    @GetMapping("/all")
    public List<AllUsersDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/unregistered/{userId}")
    public List<Auction> getUnregisteredAuctions(@PathVariable Long userId) {
        return userService.getUnregisteredAuctions(userId);
    }

    @PostMapping("/registerAuction")
    public ResponseEntity<String> registerForAuction(@RequestBody Map<String, Long> requestData) {
        Long userId = requestData.get("userId");
        Long auctionId = requestData.get("auctionId");

        userService.registerBidder(userId, auctionId);
        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/registered/{userId}")
    public List<BidderAuctionDTO> getRegisteredAuctions(@PathVariable Long userId) {
        return userService.getRegisteredAuctionsWithStatus(userId);
    }

    @GetMapping("/purchases/{userId}/{auctionId}")
    public List<ItemDTO> getPurchasedItems(@PathVariable Long userId, @PathVariable Long auctionId) {
        return userService.getPurchasedItems(userId, auctionId);
    }

    @PostMapping("/changePassword/{userId}")
    public ResponseEntity<String> changePassword(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request)
    {
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        String response = userService.changePassword(userId, oldPassword, newPassword);

        if (response.equals("Password updated successfully")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}

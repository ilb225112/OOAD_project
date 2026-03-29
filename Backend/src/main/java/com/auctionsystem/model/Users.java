// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

/**
 * @author Chirag
 * @description Represents a registered user in the auction system
 * @pattern Repository
 * @solid SRP
 */
@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    // "BIDDER" or "ADMIN"
    private String role;

    private String phone;

    @JsonIgnore
    @ManyToMany(mappedBy = "registeredBidders", fetch = FetchType.LAZY)
    private List<Auction> registeredAuctions;

    public Users() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public List<Auction> getRegisteredAuctions() { return registeredAuctions; }
    public void setRegisteredAuctions(List<Auction> registeredAuctions) { this.registeredAuctions = registeredAuctions; }
}

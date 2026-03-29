// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * @author Brunda
 * @description Represents an auction persisted in the system
 * @pattern Factory, Repository
 * @solid SRP
 */
@Entity
@Table(name = "auction")
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auctionId;

    private String name;

    @Enumerated(EnumType.STRING)
    private AuctionType auctionType;

    @Temporal(TemporalType.TIMESTAMP)
    private Date auctionDate;

    // "UPCOMING", "LIVE", "COMPLETED"
    private String status;

    @Column(name = "duration_minutes", columnDefinition = "INT DEFAULT 60")
    private Integer durationMinutes = 60;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "started_at")
    private Date startedAt;  // set when status → LIVE; used to compute remaining time

    @JsonManagedReference("auction-items")
    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Item> items;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "auction_bidders",
        joinColumns = @JoinColumn(name = "auction_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<Users> registeredBidders;

    public Auction() {}

    public Long getAuctionId() { return auctionId; }
    public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public AuctionType getAuctionType() { return auctionType; }
    public void setAuctionType(AuctionType auctionType) { this.auctionType = auctionType; }

    public Date getAuctionDate() { return auctionDate; }
    public void setAuctionDate(Date auctionDate) { this.auctionDate = auctionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getDurationMinutes() { return durationMinutes != null ? durationMinutes : 60; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Date getStartedAt() { return startedAt; }
    public void setStartedAt(Date startedAt) { this.startedAt = startedAt; }

    public List<Item> getItems() { return items; }
    public void setItems(List<Item> items) { this.items = items; }

    public List<Users> getRegisteredBidders() { return registeredBidders; }
    public void setRegisteredBidders(List<Users> registeredBidders) { this.registeredBidders = registeredBidders; }
}

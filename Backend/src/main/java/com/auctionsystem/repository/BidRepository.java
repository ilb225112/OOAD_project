// @owner Chinmay
// @feature Bid engine, live bidding, and host flow
package com.auctionsystem.repository;

import com.auctionsystem.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author Chinmay
 * @description Persists and queries Bid entities
 * @pattern Repository
 * @solid SRP
 */
@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByAuction_AuctionIdAndItem_ItemIdOrderByBidAmountDesc(Long auctionId, Long itemId);

    @Query("SELECT b FROM Bid b WHERE b.auction.auctionId = :auctionId AND b.item.itemId = :itemId ORDER BY b.bidAmount DESC LIMIT 1")
    Optional<Bid> findLatestBidForItemInAuction(@Param("auctionId") Long auctionId, @Param("itemId") Long itemId);

}

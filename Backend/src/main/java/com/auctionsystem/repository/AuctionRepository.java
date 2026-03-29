// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.repository;

import com.auctionsystem.model.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Brunda
 * @description Persists and queries Auction entities
 * @pattern Repository
 * @solid SRP
 */
@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {

    List<Auction> findByStatus(String status);
}

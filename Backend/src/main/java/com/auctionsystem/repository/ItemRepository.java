// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.repository;

import com.auctionsystem.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Brunda
 * @description Persists and queries Item entities
 * @pattern Repository
 * @solid SRP
 */
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByAuction_AuctionId(Long auctionId);
}

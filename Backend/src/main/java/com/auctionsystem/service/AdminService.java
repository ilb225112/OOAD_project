// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.service;

import com.auctionsystem.dto.BidderDTO;

import java.util.List;

/**
 * @author Bhavini
 * @description Defines the admin business operations exposed to controllers
 * @pattern Facade, Repository
 * @solid ISP
 */
public interface AdminService {

    List<BidderDTO> getRegisteredBidders(Long auctionId);

    void deleteBidderFromAuction(Long auctionId, Long userId);
}

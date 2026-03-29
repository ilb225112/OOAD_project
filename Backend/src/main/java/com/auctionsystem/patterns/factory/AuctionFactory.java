// @owner Brunda
// @feature Auction creation and item browsing
package com.auctionsystem.patterns.factory;

import com.auctionsystem.model.Auction;
import com.auctionsystem.model.AuctionType;
import java.util.Date;

/**
 * @author Brunda
 * @description Creates Auction objects with type-specific defaults
 * @pattern Factory
 * @solid OCP
 */
public class AuctionFactory {

    public static Auction createAuction(String name, AuctionType type, Date date) {
        return createAuction(name, type, date, 60);
    }

    public static Auction createAuction(String name, AuctionType type, Date date, int durationMinutes) {
        Auction auction = new Auction();
        auction.setName(name);
        auction.setAuctionType(type);
        auction.setAuctionDate(date);
        auction.setDurationMinutes(durationMinutes);
        return auction;
    }

    public static Auction createCricketAuction(String name, Date date) {
        return createAuction(name, AuctionType.CRICKET, date);
    }

    public static Auction createAntiquesAuction(String name, Date date) {
        return createAuction(name, AuctionType.ANTIQUES, date);
    }

    public static Auction createRealEstateAuction(String name, Date date) {
        return createAuction(name, AuctionType.REAL_ESTATE, date);
    }

    public static Auction createKabaddiAuction(String name, Date date) {
        return createAuction(name, AuctionType.KABADDI, date);
    }
}

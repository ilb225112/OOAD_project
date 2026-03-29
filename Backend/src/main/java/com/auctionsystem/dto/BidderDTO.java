// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.dto;

/**
 * @author Bhavini
 * @description Carries bidder summary data for admin monitoring screens
 * @pattern Adapter, Facade
 * @solid ISP
 */
public class BidderDTO {

    private Long userId;
    private String name;
    private String email;

    public BidderDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}

// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.dto;

/**
 * @author Bhavini
 * @description Carries summarized user data for admin views
 * @pattern Adapter, Facade
 * @solid ISP
 */
public class AllUsersDTO {

    private Long userId;
    private String name;
    private String email;
    private String role;

    public AllUsersDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

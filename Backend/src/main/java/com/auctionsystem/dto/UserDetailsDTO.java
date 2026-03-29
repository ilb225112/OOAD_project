// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.dto;

/**
 * @author Chirag
 * @description Carries authenticated user profile details to clients
 * @pattern Adapter
 * @solid ISP
 */
public class UserDetailsDTO {

    private Long userId;
    private String name;
    private String email;
    private String role;
    private String phone;

    public UserDetailsDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}

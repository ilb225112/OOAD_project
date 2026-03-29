// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.config;

import com.auctionsystem.model.Users;
import com.auctionsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * @author Chirag
 * @description Seeds initial application data needed at startup
 * @pattern Singleton, Repository
 * @solid SRP
 */
@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@auction.com";

        if (!userRepository.existsByEmail(adminEmail)) {
            Users admin = new Users();
            admin.setName("Admin User");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("AUCTIONEER");
            userRepository.save(admin);
            logger.info("✅ Default admin account created: {}", adminEmail);
        } else {
            logger.info("ℹ️ Admin account already exists: {}", adminEmail);
        }
    }
}

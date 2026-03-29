// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.repository;

import com.auctionsystem.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * @author Chirag
 * @description Persists and queries Users entities
 * @pattern Repository
 * @solid SRP
 */
@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Users> findByEmailAndRole(String email, String role);
}

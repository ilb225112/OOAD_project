// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author Bhavini
 * @description Bootstraps the Spring Boot auction application
 * @pattern Singleton
 * @solid SRP
 */
@SpringBootApplication
public class AuctionSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuctionSystemApplication.class, args);
	}

}

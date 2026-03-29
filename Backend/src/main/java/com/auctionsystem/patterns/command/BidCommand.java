// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.patterns.command;

/**
 * @author Chirag
 * @description Defines the contract for bid-related command objects
 * @pattern Command
 * @solid ISP
 */
public interface BidCommand {

    boolean execute();

    boolean undo();

    String getDescription();
}

// @owner Chirag
// @feature Registration, login, profile, and purchases
package com.auctionsystem.patterns.command;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Stack;

/**
 * @author Chirag
 * @description Executes bid commands and tracks command history
 * @pattern Command
 * @solid SRP
 */
@Component
public class BidCommandInvoker {

    private static final Logger logger = LoggerFactory.getLogger(BidCommandInvoker.class);

    private final Stack<BidCommand> commandHistory = new Stack<>();
    private final Stack<BidCommand> undoneCommands = new Stack<>();

    public boolean executeCommand(BidCommand command) {
        boolean success = command.execute();

        if (success) {
            commandHistory.push(command);
            undoneCommands.clear();
            logger.info("Command executed: {}", command.getDescription());
        } else {
            logger.warn("Command execution failed: {}", command.getDescription());
        }

        return success;
    }

    public boolean undo() {
        if (commandHistory.isEmpty()) {
            logger.warn("No commands to undo");
            return false;
        }

        BidCommand command = commandHistory.pop();
        boolean success = command.undo();

        if (success) {
            undoneCommands.push(command);
            logger.info("Command undone: {}", command.getDescription());
        } else {
            commandHistory.push(command);
            logger.warn("Undo failed: {}", command.getDescription());
        }

        return success;
    }

    public boolean redo() {
        if (undoneCommands.isEmpty()) {
            logger.warn("No commands to redo");
            return false;
        }

        BidCommand command = undoneCommands.pop();
        boolean success = command.execute();

        if (success) {
            commandHistory.push(command);
            logger.info("Command redone: {}", command.getDescription());
        } else {
            undoneCommands.push(command);
            logger.warn("Redo failed: {}", command.getDescription());
        }

        return success;
    }

    public Stack<BidCommand> getCommandHistory() {
        return new Stack<BidCommand>() {{
            addAll(commandHistory);
        }};
    }

    public void clearHistory() {
        commandHistory.clear();
        undoneCommands.clear();
        logger.info("Command history cleared");
    }

    public int getHistorySize() {
        return commandHistory.size();
    }
}

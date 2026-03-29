// @owner Bhavini
// @feature Admin monitoring and dashboards
package com.auctionsystem.constants;

/**
 * @author Bhavini
 * @description Defines the lifecycle values used for auction items
 * @pattern Builder
 * @solid OCP
 */
public enum ItemStatus {
    AVAILABLE("AVAILABLE"),
    SOLD("SOLD"),
    UNSOLD("UNSOLD");

    private final String value;

    ItemStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}

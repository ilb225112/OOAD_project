// @owner Brunda, Bhavini
// @feature Auction creation and admin monitoring
package com.auctionsystem.patterns.adapter;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * @author Brunda, Bhavini
 * @description Adapts date values between internal and external representations
 * @pattern Adapter
 * @solid OCP
 */
public class DateAdapter {

    private final Date date;

    public DateAdapter(Date date) {
        this.date = date;
    }

    public boolean isPast() {
        return date.before(new Date());
    }

    public boolean isFuture() {
        return date.after(new Date());
    }

    public boolean isWithin24Hours() {
        Date now = new Date();
        long diffInMillis = Math.abs(date.getTime() - now.getTime());
        long hours = TimeUnit.MILLISECONDS.toHours(diffInMillis);
        return hours <= 24;
    }

    public long getHoursUntil() {
        Date now = new Date();
        long diffInMillis = date.getTime() - now.getTime();
        return TimeUnit.MILLISECONDS.toHours(diffInMillis);
    }

    public long getDaysUntil() {
        Date now = new Date();
        long diffInMillis = date.getTime() - now.getTime();
        return TimeUnit.MILLISECONDS.toDays(diffInMillis);
    }

    public String formatForDisplay() {
        SimpleDateFormat formatter = new SimpleDateFormat("MMM dd, yyyy HH:mm");
        return formatter.format(date);
    }

    public String formatForAPI() {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
        return formatter.format(date);
    }

    public Date getDate() {
        return date;
    }

    public static DateAdapter of(Date date) {
        return new DateAdapter(date);
    }
}

// @owner Chinmay
// @feature Live bidding and host/sell flow
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { BID_PATH, AUCTION_PATH } from "../constant";
import { useParams } from "react-router-dom";

const Host = () => {
    const { auctionId } = useParams();
    const [items, setItems] = useState([]);
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [currentBid, setCurrentBid] = useState(null);

    // timer = null  → not started (waiting for admin click)
    // timer = N     → counting down from N seconds
    // timer = 0     → expired (auto-sell triggered)
    const [timer, setTimer] = useState(null);
    const [timerRunning, setTimerRunning] = useState(false);

    const [allSold, setAllSold] = useState(false);
    const [isSelling, setIsSelling] = useState(false);
    const [auctionDuration, setAuctionDuration] = useState(60); // minutes, from backend
    const [auctionMarkedLive, setAuctionMarkedLive] = useState(false);

    // Stable refs — avoid stale closures inside setInterval callbacks
    const itemsRef = useRef([]);
    const currentItemIndexRef = useRef(0);
    const currentBidRef = useRef(null);
    const allSoldRef = useRef(false);
    const timerRef = useRef(null);          // holds the setInterval ID
    const autoSellFiredRef = useRef(false); // prevent double auto-sell on expiry

    itemsRef.current = items;
    currentItemIndexRef.current = currentItemIndex;
    currentBidRef.current = currentBid;
    allSoldRef.current = allSold;

    // ── 1. Fetch auction details (durationMinutes + auto-start if LIVE) ─────
    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const resp = await axios.get(`${AUCTION_PATH}/details/${auctionId}`);
                const auction = resp.data?.auction;
                if (auction?.durationMinutes) {
                    setAuctionDuration(auction.durationMinutes);
                }
                if (auction?.status === "LIVE") {
                    setAuctionMarkedLive(true);
                    autoSellFiredRef.current = false;

                    // Compute remaining seconds from when auction actually went LIVE
                    const totalSeconds = (auction.durationMinutes ?? 60) * 60;
                    let remaining = totalSeconds;
                    if (auction.startedAt) {
                        const elapsed = Math.floor((Date.now() - new Date(auction.startedAt).getTime()) / 1000);
                        remaining = Math.max(0, totalSeconds - elapsed);
                    }
                    setTimer(remaining);
                    setTimerRunning(true);
                }
            } catch (err) {
                console.error("Error fetching auction details:", err);
            }
        };
        fetchAuction();
    }, [auctionId]);

    // ── 2. Fetch non-sold items on mount ─────────────────────────────────────
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${AUCTION_PATH}/auctionItems/${auctionId}`);
                const availableItems = response.data.filter(item => item.status !== "SOLD");
                if (availableItems.length === 0) {
                    setAllSold(true);
                } else {
                    setItems(availableItems);
                    // ⚠️ Do NOT set timer here — admin must click Start
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, [auctionId]);

    // ── 3. Sell item (called by button OR timer expiry) ───────────────────────
    const sellItem = useCallback(async () => {
        if (allSoldRef.current || isSelling) return;

        const idx = currentItemIndexRef.current;
        const currentItems = itemsRef.current;
        if (!currentItems[idx]) return;

        if (!currentBidRef.current) {
            // No bids — skip to next without selling (or alert)
            alert("No bids on this item. Skipping to next.");
            const nextIndex = idx + 1;
            if (nextIndex < currentItems.length) {
                setCurrentItemIndex(nextIndex);
                setCurrentBid(null);
                setTimer(null);
                setTimerRunning(false);
            } else {
                try {
                    await axios.put(`${AUCTION_PATH}/${auctionId}/status`, { status: "COMPLETED" });
                } catch (e) {
                    console.error("Failed to mark auction completed:", e);
                }
                setAllSold(true);
            }
            return;
        }

        setIsSelling(true);
        // Stop the countdown while processing
        clearInterval(timerRef.current);
        setTimerRunning(false);

        try {
            await axios.post(`${BID_PATH}/sellItem/${currentItems[idx].itemId}`, {
                userId: currentBidRef.current.bidderId,
                bidAmount: currentBidRef.current.bidAmount,
            });

            const nextIndex = idx + 1;
            if (nextIndex < currentItems.length) {
                // Advance to next item — timer resets to null (admin must click Start)
                setCurrentItemIndex(nextIndex);
                setCurrentBid(null);
                setTimer(null);
                autoSellFiredRef.current = false;
            } else {
                // All items sold → mark auction COMPLETED
                try {
                    await axios.put(`${AUCTION_PATH}/${auctionId}/status`, { status: "COMPLETED" });
                } catch (e) {
                    console.error("Failed to mark auction completed:", e);
                }
                setAllSold(true);
            }
        } catch (error) {
            console.error("Error selling item:", error);
            alert("Failed to mark item as sold.");
            // Restart timer where it left off if sell failed
            setTimerRunning(true);
        } finally {
            setIsSelling(false);
        }
    }, [auctionId, isSelling]);

    // ── 4. "Start Bidding" — begin countdown for current item ────────────────
    const handleStart = useCallback(async () => {
        if (timerRunning) return;

        // Mark auction LIVE on first start
        if (!auctionMarkedLive) {
            try {
                await axios.put(`${AUCTION_PATH}/${auctionId}/status`, { status: "LIVE" });
                setAuctionMarkedLive(true);
            } catch (e) {
                console.error("Failed to mark auction live:", e);
            }
        }

        autoSellFiredRef.current = false;
        setTimer(auctionDuration * 60);
        setTimerRunning(true);
    }, [auctionId, auctionDuration, auctionMarkedLive, timerRunning]);

    // ── 5. The countdown itself ───────────────────────────────────────────────
    useEffect(() => {
        if (!timerRunning || timer === null || allSold) return;

        // Clear any running interval before starting a new one
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    // Fire auto-sell exactly once
                    if (!autoSellFiredRef.current) {
                        autoSellFiredRef.current = true;
                        sellItem();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    // Only restart the interval when timerRunning flips or item changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerRunning, currentItemIndex, allSold]);

    // ── 6. Poll latest bid every 3 s ─────────────────────────────────────────
    useEffect(() => {
        if (items.length === 0 || allSold) return;

        const fetchLatestBid = async () => {
            const idx = currentItemIndexRef.current;
            const currentItems = itemsRef.current;
            if (!currentItems[idx]) return;
            try {
                const response = await axios.get(
                    `${BID_PATH}/latestBid/${auctionId}/${currentItems[idx].itemId}`
                );
                const latestBid = response.data;
                if (latestBid && latestBid.bidAmount) {
                    setCurrentBid(prev => {
                        if (!prev || latestBid.bidAmount > prev.bidAmount) return latestBid;
                        return prev;
                    });
                }
            } catch {
                // 204 No Content = no bids yet — ignore
            }
        };

        fetchLatestBid();
        const id = setInterval(fetchLatestBid, 3000);
        return () => clearInterval(id);
    }, [currentItemIndex, items, auctionId, allSold]);

    // ── Render: All items sold ────────────────────────────────────────────────
    if (allSold) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg-primary)] p-6">
                <div className="bg-[var(--color-bg-card)] p-12 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-lg)] text-center">
                    <div className="inline-block p-4 bg-[var(--color-success)]/20 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">All Items Sold!</h2>
                    <p className="text-[var(--color-text-secondary)]">Auction completed successfully</p>
                </div>
            </div>
        );
    }

    // ── Render: Loading ───────────────────────────────────────────────────────
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg-primary)]">
                <div className="loading-spinner mb-4"></div>
                <h2 className="text-[var(--color-text-secondary)] text-xl">Loading items...</h2>
            </div>
        );
    }

    const currentItem = items[currentItemIndex];
    const displayMinutes = timer !== null ? Math.floor(timer / 60) : auctionDuration;
    const displaySeconds = timer !== null ? String(timer % 60).padStart(2, '0') : '00';
    const isTimeLow = timer !== null && timerRunning && timer < 30;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-bg-primary)] p-6">
            <div className="mb-6 text-center">
                <div className="inline-block p-3 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-xl)] mb-3 shadow-[var(--shadow-neu-md)]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">Live Auction Panel</h2>
                <p className="text-[var(--color-text-secondary)]">Item {currentItemIndex + 1} of {items.length}</p>
            </div>

            <div className="bg-[var(--color-bg-card)] shadow-[var(--shadow-neu-lg)] rounded-[var(--radius-2xl)] p-8 w-full max-w-2xl space-y-6">

                {/* Item info */}
                <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">{currentItem.name}</h3>
                    <p className="text-[var(--color-text-secondary)]">{currentItem.description}</p>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                    <div className="bg-[var(--color-bg-inset)] p-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] flex items-center justify-between">
                        <span className="text-[var(--color-text-secondary)]">Current Bid:</span>
                        <span className="text-2xl font-bold text-[var(--color-success)]">
                            ₹{currentBid ? currentBid.bidAmount.toLocaleString() : currentItem.startingPrice.toLocaleString()}
                        </span>
                    </div>

                    <div className="bg-[var(--color-bg-inset)] p-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] flex items-center justify-between">
                        <span className="text-[var(--color-text-secondary)]">Current Bidder:</span>
                        <span className="text-lg font-semibold text-[var(--color-info)]">
                            {currentBid ? currentBid.bidderName : "No bids yet"}
                        </span>
                    </div>

                    <div className="bg-[var(--color-bg-inset)] p-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] flex items-center justify-between">
                        <span className="text-[var(--color-text-secondary)]">Time Remaining:</span>
                        <span className={`text-2xl font-bold font-mono ${isTimeLow ? "text-[var(--color-error)] animate-pulse" : timerRunning ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"}`}>
                            {timer === null ? `${auctionDuration}:00` : `${displayMinutes}:${displaySeconds}`}
                        </span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                    {/* START button — only shown when timer not running */}
                    {!timerRunning && (
                        <button
                            onClick={handleStart}
                            disabled={isSelling}
                            className="w-full bg-gradient-to-br from-[var(--color-success)] to-emerald-600 text-white py-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-md)] hover:shadow-[var(--shadow-neu-hover)] transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {timer === null ? "▶ Start Bidding" : "▶ Resume"}
                        </button>
                    )}

                    {/* SELL button — always available once timer has started */}
                    {timerRunning && (
                        <button
                            onClick={sellItem}
                            disabled={isSelling || !currentBid}
                            className="w-full bg-gradient-to-br from-[var(--color-error)] to-red-700 text-white py-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-md)] hover:shadow-[var(--shadow-neu-hover)] active:shadow-[var(--shadow-neu-active)] transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSelling ? "Processing..." : "✓ Mark as Sold & Next Item"}
                        </button>
                    )}

                    {timerRunning && !currentBid && (
                        <p className="text-center text-sm text-[var(--color-text-muted)]">
                            Waiting for first bid…
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Host;

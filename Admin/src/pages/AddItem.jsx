import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AUCTION_PATH } from "../constant";

const AddItem = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newItem = { name, description, startingPrice };

    try {
      const response = await fetch(`${AUCTION_PATH}/addItem/${auctionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        toast.success("Item added successfully!");
        setName("");
        setDescription("");
        setStartingPrice("");
      } else {
        toast.error("Failed to add item");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex justify-center items-center p-4">
      <div className="bg-[var(--color-bg-card)] p-8 rounded-[var(--radius-2xl)] shadow-[var(--shadow-neu-lg)] w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] rounded-[var(--radius-xl)] mb-3 shadow-[var(--shadow-neu-md)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Add Item to Auction</h2>
          <p className="text-[var(--color-text-secondary)] mt-1">Auction ID: {auctionId}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[var(--color-text-primary)] font-medium mb-2">Item Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-medium mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition resize-none"
              placeholder="Enter item description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-[var(--color-text-primary)] font-medium mb-2">Starting Price</label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-[var(--color-bg-inset)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-md)] focus:outline-none focus:shadow-[var(--shadow-neu-inset-lg)] focus:ring-1 focus:ring-[var(--color-accent-primary)] transition"
              placeholder="Enter starting price"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 bg-[var(--color-bg-inset)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-inset-sm)] hover:shadow-[var(--shadow-neu-inset-md)] transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-br from-[var(--color-accent-gradient-start)] to-[var(--color-accent-gradient-end)] text-white py-3 rounded-[var(--radius-lg)] shadow-[var(--shadow-neu-md)] hover:shadow-[var(--shadow-neu-hover)] active:shadow-[var(--shadow-neu-active)] transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;

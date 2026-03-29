import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Route, createRoutesFromElements } from 'react-router';

import Login from './pages/Login';
import CreateAuction from './pages/CreateAuction';
import AddItem from './pages/AddItem';
import AuctionItems from './pages/AuctionItems';
import LiveAuction from './pages/LiveAuctions';
import Host from './pages/Host';
import UpcomingBidder from './pages/UpcomingBidder';
import CompletedBidder from './pages/CompletedBidder';
import LiveBidder from './pages/LiveBidder';
import CompletedAuction from './pages/CompletedAuction';
import UpcomingAuctions from './pages/UpcomingAuctions';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>
            <Route path='/login' element={<Login/>} />
            <Route path='/createAuction' element={<CreateAuction/>}/>
            <Route path='/addItem/:auctionId' element={<AddItem/>}/>
            <Route path='/nextAuctions' element={<UpcomingAuctions/>} />
            <Route path='/upcomingAuctions' element={<UpcomingAuctions/>} />
            <Route path='/liveAuctions' element={<LiveAuction/>} />
            <Route path='/completedAuctions' element={<CompletedAuction/>} />

            <Route path='/host/:auctionId' element={<Host/>} />

            <Route path='/auction-items/:auctionId/:auctionName' element={<AuctionItems/>} />
            <Route path='/upcoming-bidder/:auctionId/:auctionName' element={<UpcomingBidder/>} />
            <Route path='/live-bidder/:auctionId/:auctionName' element={<LiveBidder/>} />
            <Route path='/completed-bidder/:auctionId/:auctionName' element={<CompletedBidder/>} />

            
        </Route>
    )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

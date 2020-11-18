import React from 'react';
import { ObserveAuctionItem ,AuctionItem, BidderAuctionItem } from './AuctionItem';

const ObserveAuctionCard = (props) => {
  // auction card for observers which can cancel the observation on the card
  const auctionComponent = props.auction.map((auctionInfo) =>
    <div className="col-md-4" key={auctionInfo.id}>
      <ObserveAuctionItem
        src={auctionInfo.src}
        address={auctionInfo.address}
        bedroom={auctionInfo.bedroom}
        bath={auctionInfo.bath}
        garage={auctionInfo.garage}
        id={auctionInfo.id}
        bid={auctionInfo.bid}
        status={auctionInfo.status}
      />
      <br />
      <br />
    </div>
  )
  return (
    <div className="auction-cards-container mx-auto">
      <br />
      <div className="container-fluid justify-content-center">
        <div className="row">
          {auctionComponent}
        </div>
      </div>
    </div>
  );
}

const AuctionCard = (props) => {
        // auction card for searching
        const auctionComponent = props.auction.map((auctionInfo) =>  
          <div className="col-md-4" key={auctionInfo.id}>
              <AuctionItem 
                src={auctionInfo.src}
                address={auctionInfo.address}
                bedroom={auctionInfo.bedroom}
                bath={auctionInfo.bath}
                garage={auctionInfo.garage}
                id={auctionInfo.id}
                bid={auctionInfo.bid}
                status={auctionInfo.status}
                role={auctionInfo.identify}
              />
            {/* status used to indicate the auction's status, including for sale, finished and sold 
                role indicates different user types on the card */}
            <br />
            <br />
            </div>
        )
        return (
          <div className="auction-cards-container mx-auto">
            <br />
            <div className="container-fluid justify-content-center">
              <div className="row">
                {auctionComponent}
              </div>
            </div>
          </div>
        ); 
}

const BidderAuctionCard = (props) => {
  // auction cards for bidders, which contains last bid price
  const auctionComponent = props.auction.map((auctionInfo) =>
    <div className="col-md-4" key={auctionInfo.id}>
      <BidderAuctionItem
        src={auctionInfo.src}
        address={auctionInfo.address}
        bedroom={auctionInfo.bedroom}
        bath={auctionInfo.bath}
        garage={auctionInfo.garage}
        id={auctionInfo.id}
        bid={auctionInfo.bid}
        status={auctionInfo.status}
        lastbid={auctionInfo.lastprice}
      />
      <br />
      <br />
    </div>

  )
  return (
    <div className="auction-cards-container mx-auto">
      <br />
      <div className="container-fluid justify-content-center">
        <div className="row">
          {auctionComponent}
        </div>
      </div>
    </div>
  );
}

export { ObserveAuctionCard, AuctionCard, BidderAuctionCard };


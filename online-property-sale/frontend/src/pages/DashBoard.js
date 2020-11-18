import React, { useState, useEffect } from 'react'
import { ObserveAuctionCard,
        AuctionCard,
        BidderAuctionCard } from '../components/AuctionCard'
import { Card } from 'react-bootstrap'
import { Alert } from 'antd'

function CurrentBid() {
    // show bidded auctions which have not been completed
    const [display, setDisplay] = useState([]);
    const [loading, setLoading] = useState(true)
    const email = localStorage.getItem("emailaddr")

    useEffect(() => {

        const fetchInfo = () => fetch("http://127.0.0.1:5050/currentbid/" + email)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setDisplay(data.result)
                setLoading(false);
            })
            .catch(e => console.log("error", e));
        fetchInfo()

    }, [email]);

    return (
        <div>
            {loading ? <h6>Loading...</h6> :
                <div>
                    <h2 className="signin-container" style={{ textAlign: "center" }}>
                        My Placed Bid</h2>
                    <br />
                    <h4 style={{ marginLeft: "80px" }}>In Progress Auction</h4>
                    <br />
                    <Card sytle={{ margin: "auto" }}>
                        {display.length ? <BidderAuctionCard auction={display} /> :
                            <p style={{ marginTop: "20px", textAlign: "center", color: "lightgrey", fontSize: "15px" }}>--no result--</p>
                        }

                    </Card>
                </div>
            }
        </div>
    )
}

function CurrentObserve() {
    // show the observed auctions that have not been finished
    const [display, setDisplay] = useState([]);
    const [loading, setLoading] = useState(true)
    const email = localStorage.getItem("emailaddr")

    useEffect(() => {

        const fetchInfo = () => fetch("http://127.0.0.1:5050/currentobserve/" + email)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setDisplay(data.result)
                setLoading(false);
            })
            .catch(e => console.log("error", e));
        fetchInfo()

    }, [email]);

    return (
        <div>
            {loading ? <h6>Loading...</h6> :
                <div>
                    <h2 className="signin-container" style={{ textAlign: "center" }}>
                        My Observed Properties</h2>
                    <br />
                    <h4 style={{ marginLeft: "80px" }}>In Progress Auction</h4>
                    <br />
                    <Card sytle={{ margin: "auto" }}>
                        {display.length ? <ObserveAuctionCard auction={display} /> :
                            <p style={{ marginTop: "20px", textAlign: "center", color: "lightgrey", fontSize: "15px" }}>--no result--</p>
                        }

                    </Card>
                </div>
            }
        </div>
    )
}

function CurrentPost() {
    // show the posted auctions which have not been finished
    const [display, setDisplay] = useState([]);
    const [loading, setLoading] = useState(true)
    const email = localStorage.getItem("emailaddr")

    useEffect(() => {

        const fetchInfo = () => fetch("http://127.0.0.1:5050/currentpost/" + email)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setDisplay(data.result)
                setLoading(false);
            })
            .catch(e => console.log("error", e));
        fetchInfo()

    }, [email]);

    return (
        <div>
            {loading ? <h6>Loading...</h6> :
                <div>
                    <h2 className="signin-container" style={{ textAlign: "center" }}>
                        My Posted Properties</h2>
                    <br />
                    <div className="row">
                        <h4 className="col-md-2"style={{ marginLeft: "80px" }}>In Progress Auction</h4>
                        <Alert className="col-md-6" style={{ width: "100%"}}
                            message="Warning"
                            description="If you want to change the auction details, you need to contact us by email (FVC5@gmail.com)."
                            type="warning"
                            showIcon
                            closable
                        />
                    </div>
                    
                    <br />
                    <Card sytle={{ margin: "auto" }}>
                        {display.length ? <AuctionCard auction={display} /> :
                            <p style={{ marginTop: "20px", textAlign: "center", color: "lightgrey", fontSize: "15px" }}>--no result--</p>
                        }

                    </Card>
                </div>
            }
        </div>
    )
}

function HistoryBid() {
    // show the completed bidded auctions
    const [display, setDisplay] = useState([]);
    const [loading, setLoading] = useState(true)
    const email = localStorage.getItem("emailaddr")

    useEffect(() => {

        const fetchInfo = () => fetch("http://127.0.0.1:5050/historybid/" + email)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setDisplay(data.result)
                setLoading(false);
            })
            .catch(e => console.log("error", e));
        fetchInfo()

    }, [email]);

    return (
        <div>
            {loading ? <h6>Loading...</h6> :
                <div>
                    <h2 className="signin-container" style={{ textAlign: "center" }}>
                        My Placed Bid</h2>
                    <br />
                    <h4 style={{ marginLeft: "80px" }}>Completed Auction</h4>
                    <br />
                    <Card sytle={{ margin: "auto" }}>
                        {display.length ? <BidderAuctionCard auction={display} /> :
                            <p style={{ marginTop: "20px", textAlign: "center", color: "lightgrey", fontSize: "15px" }}>--no result--</p>
                        }

                    </Card>
                </div>
            }
        </div>
    )
}

function HistoryObserve() {
    // show the completed observed auctions
    const [display, setDisplay] = useState([]);
    const [loading, setLoading] = useState(true)
    const email = localStorage.getItem("emailaddr")

    useEffect(() => {

        const fetchInfo = () => fetch("http://127.0.0.1:5050/historyobserve/" + email)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setDisplay(data.result)
                setLoading(false);
            })
            .catch(e => console.log("error", e));
        fetchInfo()

    }, [email]);

    return (
        <div>
            {loading ? <h6>Loading...</h6> :
                <div>
                    <h2 className="signin-container" style={{ textAlign: "center" }}>
                        My Observed Properties</h2>
                    <br />
                    <h4 style={{ marginLeft: "80px" }}>Completed Auction</h4>
                    <br />
                    <Card sytle={{ margin: "auto" }}>
                        {display.length ? <AuctionCard auction={display} /> :
                            <p style={{ marginTop: "20px", textAlign: "center", color: "lightgrey", fontSize: "15px" }}>--no result--</p>
                        }

                    </Card>
                </div>
            }
        </div>
    )
}

function HistoryPost() {
    // show the completed posted auctions
    const [display, setDisplay] = useState([]);
    const [loading, setLoading] = useState(true)
    const email = localStorage.getItem("emailaddr")

    useEffect(() => {

        const fetchInfo = () => fetch("http://127.0.0.1:5050/historypost/" + email)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setDisplay(data.result)
                setLoading(false);
            })
            .catch(e => console.log("error", e));
        fetchInfo()

    }, [email]);

    return (
        <div>
            {loading ? <h6>Loading...</h6> :
                <div>
                    <h2 className="signin-container" style={{ textAlign: "center" }}>
                        My Posted Properties</h2>
                    <br />
                    <h4 style={{ marginLeft: "80px" }}>Completed Auction</h4>
                    <br />
                    <Card sytle={{ margin: "auto" }}>
                        {display.length ? <AuctionCard auction={display} /> :
                            <p style={{ marginTop: "20px", textAlign: "center", color: "lightgrey", fontSize: "15px" }}>--no result--</p>
                        }

                    </Card>
                </div>
            }
        </div>
    )
}


export { CurrentBid, CurrentObserve, CurrentPost, HistoryObserve, HistoryPost, HistoryBid }
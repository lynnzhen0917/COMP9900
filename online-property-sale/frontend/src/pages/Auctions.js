import React, { useState, useEffect } from 'react'
import { Carousel, Tabs, Tab, Card  } from 'react-bootstrap';
import { Descriptions, Statistic, Timeline } from 'antd';
import { isLoggedIn } from '../components/auth.js'
import { Success, WarningLogin } from '../components/Modal'
import { modifyProject } from '../components/actions.js';

const { Countdown } = Statistic;

// refer to bootstrap card / tabs / carousel component 
// refer to antd countdown / timeline / description component

export default function Auctions(props) {
    // this function will show the auction details and the page will be refreshed every 8s
    // the user can become a bidder or observer after completing the profile
    // bidder, observer, seller can see the bid history, a common user cannot
    // after the auction is finished, the users cannot make a new bid or become a observer

    // the backend data using get method
    const [info, setInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    // set the bidprice obtained from backend
    const [bidprice, setBidprice] = useState([])
    // set the observer button in different status
    const [cancel, setCancel] = useState(false)
    const id = props.match.params.id

    // show modal if user who wants to become a bidder does not log in
    const [show1, setShow1] = useState(false)
    const handleShow1 = () => setShow1(true)
    const handleClose1 = () => setShow1(false)

    // show modal if user who wants to become an observer does not log in
    const [show2, setShow2] = useState(false)
    const handleShow2 = () => setShow2(true)
    const handleClose2 = () => setShow2(false)


    useEffect(() => {

        const fetchInfo = () => fetch("http://127.0.0.1:5050/auctions/id=" + id)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setInfo(data);
                setBidprice(data.bidprice)
                setLoading(false);
                localStorage.setItem("endtime",data.endtime)
            })
                .catch(e=>console.log("error", e));
        fetchInfo()

        const interval = setInterval(() => {
            // refresh the page to get the up-to-date data every 8s
            if (new Date() >= new Date(localStorage.getItem("endtime"))) {
                fetch("http://127.0.0.1:5050/auctions/id=" + id, {
                    method: "POST",
                    body: JSON.stringify(
                        { "finish": 1, }
                    ),

                }).then(res => res.json())
                    .then(data => {
                        console.log(data.finish)
                    }).catch(err => console.log(err));
                clearInterval(interval)
            } else {
                fetchInfo()
            }

        }, 8000)
        return () => {  
            clearInterval(interval)
            }
    }, [id]);
    
    const cancelObserve = (e) => {
        e.preventDefault();
        // if the observer is not interested in the auction, he can cancel observe
        modifyProject(id, localStorage.getItem("emailaddr"), "", "cancelobserve")
        setCancel(true)
    }

    var reverseprice = []
    const timeline = (props) => {
        
        for (var i=props.length-2;i>=0;i--) {
            reverseprice.push(props[i])
        }
    }

    timeline(bidprice)
    
    return (
        <div>
            {loading ? (
                <h6>Loading...</h6>
            ) : 
            <div className="auc-container">

                    <div className="leftside">
                        <Card>
                            <div className="leftside-wrapper">
                                <div className="aucphoto-wrapper" style={{background:"#000000"}}>
                                    <Carousel>
                                        {info.pic.map((p) => 
                                    <Carousel.Item key={p}>
                                            <div className="photo-wrapper">
                                                    <img
                                                        className="w-100"
                                                        src={p}
                                                        alt="slides"
                                                    />
                                            </div>        
                                    </Carousel.Item>
                            )}

                                    </Carousel>
                                </div>

                                <br />
                                <br />
                                {/* seller cannot see the become bidder and observer button */}
                                {info.mail === localStorage.getItem("emailaddr")||new Date() >= new Date(info.endtime) ? <div></div>:
                                
                                <div className="auc-button" align="center">
                                    {new Date() >= new Date(info.starttime) ?
                                    <div className="auc-button1">
                                        {/* check whether the user is logged in.
                                            if not, he must log in to join as bidder
                                            if the user has placed a bid, the button will change to make a new bid
                                            */}
                                            
                                            {isLoggedIn() ? <a href={"/become-bidder/id=" + id}>
                                            
                                            {info.bidlist.indexOf(localStorage.getItem("emailaddr")) === -1 ?
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-lg"
                                                >Join as Bidder</button>:
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-lg"
                                                    >Make a new bid</button>
                                        }
                                            </a> :
                                            <div>
                                                 <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-lg"
                                                    onClick={handleShow1}
                                                >Join as Bidder</button>
                                                <WarningLogin show={show1} handleClose={handleClose1} role="a bidder"/>
                                                </div>
                                            }
                                        </div>
                                        :<div className="auc-button1"> 
                                        
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-lg"
                                            disabled
                                            data-toggle="tooltip" data-placement="top" title="Auction not start yet!"
                                         >Join as Bidder</button>
                                         </div>}
                                    {/* same as bidder
                                        check login
                                        if the user is an observer for this auction, the button will change to cancel observe
                                        */}
                                    {info.observerlist.indexOf(localStorage.getItem("emailaddr"))>-1?
                                            <div>
                                            <div className="auc-button1">
                                                
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-lg"
                                                        onClick={cancelObserve}

                                                    >Cancel Observe</button>

                                            </div>
                                                {cancel && <Success body="canceled" link={"/auctions/id=" + id} button="Refresh" other={true} />}
                                             </div>:
                                    <div className="auc-button1">
                                                {isLoggedIn() ? <a href={"/become-observer/id=" + id}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary btn-lg"


                                                    >Join as Observer</button>
                                                </a> :
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary btn-lg"
                                                            onClick={handleShow2}
                                                        >Join as Observer</button>
                                                        <WarningLogin show={show2} handleClose={handleClose2} role="an observer" />
                                                    </div>
                                                }
                                                
                                        </div> }
                                </div>
                                }
                                <br />
                                <br />
                                <div>
                                    {/* refer to antd descriptions */}
                                    <h4><span className="badge badge-pill badge-secondary">Property Info</span></h4>
                                    <br />
                                    <Descriptions bordered>
                                        <Descriptions.Item label="Property Type">{info.protype}</Descriptions.Item>
                                        <Descriptions.Item label="Land Size">{info.land} m<sup>2</sup></Descriptions.Item>
                                        <Descriptions.Item label="House Size">{info.house} m<sup>2</sup></Descriptions.Item>
                                        <Descriptions.Item label="Bedroom">{info.bed}</Descriptions.Item>
                                        <Descriptions.Item label="Bathroom">{info.bath}</Descriptions.Item>
                                        <Descriptions.Item label="Garage">{info.garage}</Descriptions.Item>
                                        <Descriptions.Item label="Auction-start">{info.starttime}</Descriptions.Item>
                                        <Descriptions.Item label="Auction-end" span={2}>
                                            {info.endtime}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Address" span={3}>{info.addr}</Descriptions.Item>
                                        <Descriptions.Item label="City">{info.city}</Descriptions.Item>
                                        <Descriptions.Item label="State">{info.state}</Descriptions.Item>
                                        <Descriptions.Item label="Zip">{info.zipcode}</Descriptions.Item>
                                        <Descriptions.Item label="Details">
                                            {info.details}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </div>
                                <br />
                                <br />
                            </div>
                        </Card>
                    </div>

                    <div className="rightside">
                       {/* refer to bootstrap card/tabs, antd countdown/timeline
                           show the bidhistory for bidder, seller and observer
                           */}
                        <Card>
                            <Card.Body>
                                <Tabs variant="pills" defaultActiveKey="Info" id="uncontrolled-tab-example">
                                    <Tab eventKey="Info" title="Details" align="center">
                            
                                        <label className="countdown-title">Auction Countdown</label>
                                        {new Date() >= new Date(info.starttime) ?
                                        <div className="countdown-wrapper">
                                            <Countdown value={info.endtime} format="D [day] H [hour] m [min] s [sec]" />
                                        </div>
                                        :<p style={{
                                            textAlign:"center", fontSize:"20px"}}><i className="far fa-clock fa-lg" ></i> Not start yet!</p>}
                                        <div className="rightside-wrapper">
                                            {info.bidder === 1 ? 
                                                <button type="button" className="btn btn-outline-secondary btn-lg btn-block" disabled>{info.bidder} Bidder </button> :
                                                <button type="button" className="btn btn-outline-secondary btn-lg btn-block" disabled>{info.bidder} Bidders </button>
                                            }
                                            {info.observer === 1 ?
                                                <button type="button" className="btn btn-outline-secondary btn-lg btn-block" disabled>{info.observer} Observer </button> :
                                                <button type="button" className="btn btn-outline-secondary btn-lg btn-block" disabled>{info.observer} Observers </button>
                                        }
                                            <br />
                                            <br />
                                            <br />
                                            <div>
                                                <h3>CURRENT BID</h3>
                                                <br />
                                                <button type="button" className="btn btn-warning btn-block" disabled><h1>${bidprice.length?bidprice[bidprice.length - 1][2]:0}</h1></button>
                                            </div>
                                        </div>
                                       
                                    </Tab>
                                    {(info.bidlist.indexOf(localStorage.getItem("emailaddr"))===-1 &&
                                    info.observerlist.indexOf(localStorage.getItem("emailaddr"))===-1 &&
                                        info.mail !== localStorage.getItem("emailaddr"))?
                                        <Tab eventKey="history" title="Bid History" disabled={true}>

                                        </Tab>
                                        : <Tab eventKey="history" title="Bid History" disabled={false}>
                                            <div className="timeline">
                                                {bidprice.length !== 0 ?
                                                    <Timeline>
                                                        <Timeline.Item>
                                                            <h5 style={{}}>
                                                                ${bidprice[bidprice.length - 1][2]}
                                                            </h5>
                                                            <p style={{ color: "grey" }}>
                                                                {bidprice[bidprice.length - 1][1]}
                                                            </p>
                                                        </Timeline.Item>
                                                        {reverseprice.map((time) =>
                                                            <Timeline.Item key={time[2]} color="gray">
                                                                <h5>
                                                                    ${time[2]}
                                                                </h5>
                                                                <p style={{ color: "grey" }}>
                                                                    {time[1]}
                                                                </p>
                                                            </Timeline.Item>

                                                        )}
                                                    </Timeline>
                                                    : <h3 align="center">No bid right now</h3>
                                                }

                                            </div>

                                        </Tab>
                                }
                                    
                                </Tabs>
                            </Card.Body>  
                        </Card>
                    </div>



                </div>
                }
        </div>
        
    
        
    )
}
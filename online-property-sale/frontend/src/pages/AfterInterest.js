import React, { useState, useEffect } from 'react'
import { Success, Warning } from '../components/Modal'
import moment from 'moment'
import Alerts from '../components/Alerts'
import { modifyProject } from '../components/actions'

function BecomeBidder(props) {
    // If a user wants to become a bidder:
    // this function will check the authorization (the profile is complete)
    // check whether the new bid is larger than the previous bid + $10000
    const [amount, setAmount] = useState("")
    const [addr, setAddr] = useState("")
    const [previousprice, setPreviousprice] = useState("")
    const id = props.match.params.id
    const [success, setSuccess] = useState(false)
    const [show, setShow] = useState(false)
    const [alert, setAlert] = useState("")


    useEffect(() => {
        const fetchInfo = () => fetch("http://127.0.0.1:5050/auctions/id=" + id)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data)
                setAddr(data.addr)
                data.bidprice.length
                    ? setPreviousprice(data.bidprice[data.bidprice.length - 1][2]) 
                    : setPreviousprice(0)
            }).catch(e => console.log("error", e));

        fetchInfo()

    },[id]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let url = "http://localhost:5050/placebid";
        let formData = new FormData();
        var myDate = moment().format("YYYY-MM-DD HH:mm:ss");
        let a = parseInt(amount)

        if (isNaN(a)|| a < parseInt(previousprice)+10000){
            setAlert(`Please enter an amount larger than $${parseInt(previousprice) + 10000}`)
        } else {
            formData.append("emailaddr", localStorage.getItem("emailaddr"))
            formData.append("id", id)
            formData.append("amount", amount)
            formData.append("timestamp", myDate)

            fetch(url, {
                method: "POST",
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    if (data.msg === "Success") {
                        setSuccess(true)
                        setAlert("")
                    } else {
                        setShow(true)
                        setAlert("")
                    }
                    
                    console.log(data)
                }).catch(err => console.log(err));
            fetch("http://localhost:5050/placebid",{
                method: "PUT",
                body: JSON.stringify(
                    {"email": localStorage.getItem("emailaddr"),
                    "id":id,
                    "amount":amount,
                    "timestamp":myDate
                }
                ),
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                }).catch(err => console.log(err));
            
        }
    }

    return (
        <div className="becomebidder">
            <h1 style={{
              textAlign:"center", color:"rgb(46, 146, 204)"}}
              >Join as Bidder</h1>
            <h4 style={{
              textAlign:"center", color:"rgb(54, 105, 134)"}}>
                {addr}
                {/* {console.log(this.props.match.params.id)} */}
        </h4>
        <br />
            <p style={{
              textAlign:"center", fontSize:"16px"}}>
                Place a bid above ${previousprice} (at least add $10000) to participate in this auction!
            <br />
            NOTE: Once you have placed a bid for this auction, you cannot retrieve your bid.
        </p>
        <br />
                <form>
                <div className="bidamount-container">
                <label style={{textAlign:"center",fontWeight:"bold",fontSize:"18px",color:"rgb(46, 146, 204)"}}>  
                    Bid Amount
                    <label className="text-danger">*</label>:</label>
                    {alert && <Alerts msg={alert} />}
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text">$</span>
                    </div>
                    <input
                        type="text"
                        name="amount"
                        placeholder={"above "+(parseInt(previousprice)+10000)}
                        value={amount}
                        onChange={e=>setAmount(e.target.value)}
                        className="form-control"
                    ></input>
                    <div className="input-group-append">
                        <span className="input-group-text">.00</span>
                    </div>
                
            </div>
                    
            </div>
            
            <br />
            <div className="auc-button" align="center">
                <div className="auc-button1">
                <a href={"/auctions/id="+id}>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg"

                        >Cancel</button>
                </a>
                </div>
                <div className="auc-button1">
                    <button
                        type="button"
                        className="btn btn-warning btn-lg"
                        onClick={handleSubmit}
                    >Submit</button>
                </div>
                
                
            </div>
            </form>
            {success ? <Success body={"placed a bid of $"+amount+" for this property"}
                                    link={"/auctions/id="+id}
                                    onClick={handleSubmit}
                                    button="back"
                                    other={false} />
                : <Warning show={show} />}
        </div>
    )
}

function BecomeObserver(props) {
    // If a user want to become an observer:
    // this function will send the auction id and user's info to the backend

    const [addr, setAddr] = useState("")
    const [previousprice, setPreviousprice] = useState("")
    const id = props.match.params.id
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        const fetchInfo = () => fetch("http://127.0.0.1:5050/auctions/id=" + id)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data)
                setAddr(data.addr)
                data.bidprice.length
                    ? setPreviousprice(data.bidprice[data.bidprice.length - 1][2])
                    : setPreviousprice(0)
            }).catch(e => console.log("error", e));

        fetchInfo()

    }, [id]);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        modifyProject(id, localStorage.getItem("emailaddr"), "", "follow")
        setSuccess(true)
    }
    
    return (
        <div className="becomebidder">
            <h1 style={{
              textAlign:"center", color:"rgb(46, 146, 204)"}}
              >Join as Observer</h1>
            <h5 style={{
              textAlign:"center", color:"rgb(54, 105, 134)"}}>
                {addr}
                {/* {console.log(this.props.match.params.id)} */}
            </h5>
            <br />
            <h4 style={{textAlign:"center",color:"darkorange"}}
            >Warning! Observers cannot bid<br />
            Only qualified buyers can bid on this property</h4>
            <br />
            <p style={{
              textAlign:"center", fontSize:"16px"}}>
                This property is for sale and may sell at any time. If you are interested in this property then you may place a bid<br />
            of ${parseInt(previousprice)+10000} or more to register as a bidder.
            <br />
            </p>
        <br />
            
            <div className="auc-button" align="center">
                <div className="auc-button1">
                <a href={"/auctions/id="+id}>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg"

                        >Cancel</button>
                </a>
                </div>
                <div className="auc-button1">
                    <button
                        type="button"
                        className="btn btn-warning btn-lg"
                        onClick={handleSubmit}
                    >Join as Observer</button>
                </div>
                
            </div>
            {success && <Success body={"followed this property"}
                link={"/auctions/id=" + id}
                button="Back"
                other={false} />}
        </div>
    )
}

export { BecomeBidder, BecomeObserver };
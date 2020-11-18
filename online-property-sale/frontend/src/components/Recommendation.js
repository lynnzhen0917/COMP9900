import React, { useEffect, useState } from 'react'
import { isLoggedIn } from './auth'
import { Card } from 'react-bootstrap'
import { AuctionCard } from './AuctionCard'

// refer to the bootstrap Card component

const Recommend = () => {
    // give recommendations for users based on their search history
    const [display, setDisplay] = useState([]);
    const [loading, setLoading] = useState(true)
    const email = localStorage.getItem("emailaddr")

    useEffect(() => {
        if (isLoggedIn()) {
            const fetchInfo = () => fetch("http://127.0.0.1:5050/recommend/" + email)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    setDisplay(data)
                    setLoading(false);
                })
                .catch(e => console.log("error", e));
            fetchInfo()
        } 

    }, [email]);

    return (
        <div style={{marginBottom:"2rem"}}>
            
            
            {isLoggedIn() && <div>
                    { loading ? <h6>Loading...</h6> :
               
                     <Card 
            style={{ margin:"auto", width: "1470px", justifyContent:"center"}}
            >
                <Card.Body>
                            <Card.Title as="h4" style={{marginLeft:"50px"}}>Recommendation</Card.Title>
                            {display.result.length ? <AuctionCard auction={display.result} /> :
                             display.message === "No Search History" ?
                                <p style={{ textAlign: "center", color: "lightgrey", fontSize: "15px" }}>-- Oops! It seems like you have not searched any auctions before! --</p>:
                                <p style={{ textAlign: "center", color: "lightgrey", fontSize: "15px" }}>-- Sorry! Currently we do not have any recommendation for you... --</p>
                            }  
                </Card.Body> 
            </Card>
            }
            </div>}
        </div> 
    )
}

export default Recommend


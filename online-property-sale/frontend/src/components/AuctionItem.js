import React, {useState} from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import { modifyProject } from './actions'
import { Tag } from 'antd'
import { ConfirmCancel } from './Modal'

// refer to the bootstrap Card and Button component
// refer to the antd Tag component

function ObserveAuctionItem(props) {
  
  const [show, setShow] = useState(false)
  // show confirm modal if the user wants to cancel the observe
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const cancelObserve = (e) => {
    e.preventDefault();
    // send email addr and auction id to the backend to modify the database
    modifyProject(props.id, localStorage.getItem("emailaddr"), "/currentobserve", "cancelobserve")
  }

  return (
      // different card wrapper to indicate different status of the auction
      // this card contains cancel observe button compared to other cards
      <Card className="card p-1 bg-warning">
        <div className="overflow" style={{"margin": "auto"}}>
        <Card.Header>
         <h6 style={{ textAlign: "center", color: "white" }}>For Sale</h6>
        </Card.Header>
        
          <a href={"/auctions/id="+props.id}>
          <Card.Img style={{ width: "413px", height: "280px" }} src={props.src} className="card-img-top" alt="cover" />
          </a>
        </div>
        <div>
          <ListGroup className="list-group list-group-flush">
            <ListGroupItem className="list-group-item  text-center">
              <h3>Current Bid: $ {props.bid}</h3>
            </ListGroupItem>
          <ListGroupItem className="list-group-item">
            <div style={{ height: "40px" }}>
              {props.address}
              </div>
              
              <br />
              <br />
              <div className="row">
                <div className="col-md-6">
                  <Button 
                  variant="outline-danger"
                  onClick={handleShow}
                  >
                    Cancel Observe
                  </Button>
                </div>
              
              <ConfirmCancel show={show} handleClose={handleClose} cancelObserve={cancelObserve} />

                <div className="col-md-6">
                <h6 style={{textAlign:"end"}}>
                  <i className="fas fa-bed" />
                    {" "}{props.bedroom}{" "}
                  <i className="fas fa-bath" />
    {" "}{props.bath}{" "}
                  <i className="fas fa-car" />
    {" "}{props.garage}{" "}
                </h6>
                </div>
              </div>
              
            </ListGroupItem>
          </ListGroup>
        </div>
      </Card>

    );
}

function AuctionItem(props) {
  // common card showed in the homepage
  // for search result, it will show a label which indiciate the user's role for this auction
  return (
  <div>
      {props.status === 2 ?
    <Card className="card p-1 bg-warning">
      <Card.Header>
        <h6 style={{textAlign:"center", color:"white"}}>For Sale</h6>
      </Card.Header>
          <div className="overflow" style={{ "margin": "auto" }}>
        <a href={"/auctions/id=" + props.id}>
              <Card.Img style={{ width: "413px", height:"280px"}} src={props.src} className="card-img-top" alt="cover" />
              <Card.ImgOverlay style={{marginTop:"50px"}}>
                {props.role === 3 ? 
                  <Tag color="#1E8449">
                    bidder
                  </Tag> :
                  props.role === 2 ? 
                    <Tag color="#AF601A">
                      observer
                  </Tag> :
                  props.role === 1 ?
                      <Tag color="#cd201f">
                        seller
                  </Tag> : <div></div>
                }
              </Card.ImgOverlay>
        </a>
      </div>
      <div>
        <ListGroup className="list-group list-group-flush">
          <ListGroupItem className="list-group-item  text-center">
            <h3>Current Bid: $ {props.bid}</h3>
          </ListGroupItem>
          <ListGroupItem className="list-group-item">
                <div style={{ height: "40px" }}>
            {props.address}
            </div>
            <br />
            <br />
                <h6 style={{ textAlign: "end" }}>
                  <i className="fas fa-bed" />
                  {' '}{props.bedroom}{' '}
                  <i className="fas fa-bath" />
                  {' '}{props.bath}{' '}
                  <i className="fas fa-car" />
                  {' '}{props.garage}{' '}
                </h6>

          </ListGroupItem>
        </ListGroup>
      </div>
    </Card>
    :<Card className="card p-1 bg-dark">
    <Card.Header>
      {props.status === 1 ? <h6 style={{textAlign:"center", color:"white"}}>Sold</h6>:
      <h6 style={{textAlign:"center", color:"white"}}>Finished</h6>}
    </Card.Header>
          <div className="overflow" style={{ "margin": "auto" }}>
      <a href={"/auctions/id=" + props.id}>
              <Card.Img style={{ width: "413px", height: "280px" }} src={props.src} className="card-img-top" alt="cover" />
              <Card.ImgOverlay style={{ marginTop: "50px" }}>
                {props.role === 3 ?
                  <Tag color="#1E8449">
                    bidder
                  </Tag> :
                  props.role === 2 ?
                    <Tag color="#AF601A">
                      observer
                  </Tag> :
                    props.role === 1 ?
                      <Tag color="#cd201f">
                        seller
                  </Tag> : <div></div>
                }
              </Card.ImgOverlay>
      </a>
    </div>
    <div>
      <ListGroup className="list-group list-group-flush">
        <ListGroupItem className="list-group-item  text-center">
          
            {props.status === 1 ? <h3>Sold: $ {props.bid}</h3> :
              <h3>Last Bid: $ {props.bid}</h3>}
          
        </ListGroupItem>
        <ListGroupItem className="list-group-item">
                <div style={{ height: "40px" }}>
          {props.address}
          </div>
          <br />
          <br />
              <h6 style={{ textAlign: "end" }}>
                <i className="fas fa-bed" />
                {' '}{props.bedroom}{' '}
                <i className="fas fa-bath" />
                {' '}{props.bath}{' '}
                <i className="fas fa-car" />
                {' '}{props.garage}{' '}
              </h6>

        </ListGroupItem>
      </ListGroup>
    </div>
</Card>}
</div>
  );
}

function BidderAuctionItem(props) {
  // add the last bid the bidder placed on the card
  // shown in the dashboard
  return (
    <div>
    {props.status === 2 ?
    <Card className="card p-1 bg-warning">
      <Card.Header>
       <h6 style={{ textAlign: "center", color: "white" }}>For Sale</h6> 
      </Card.Header>
          <div className="overflow" style={{ "margin": "auto" }}>
        <a href={"/auctions/id=" + props.id}>
              <Card.Img style={{ width: "413px", height: "280px" }} src={props.src} className="card-img-top" alt="cover" />
        </a>
      </div>
      <div>
        <ListGroup className="list-group list-group-flush">
          <ListGroupItem className="list-group-item  text-center">
            <h3>Current Bid: $ {props.bid}</h3> 
          </ListGroupItem>
          <ListGroupItem className="list-group-item">
            <div style={{height:"40px"}}>
                  {props.address}
            </div>
            
            <br />
            <br />
            <h6 style={{ textAlign: "end" }}>
              <i className="fas fa-bed" />
              {' '}{props.bedroom}{' '}
              <i className="fas fa-bath" />
              {' '}{props.bath}{' '}
              <i className="fas fa-car" />
              {' '}{props.garage}{' '}
            </h6>

          </ListGroupItem>
        </ListGroup>
      </div>
      <Card.Footer>
  <h6 style={{textAlign:"center"}}>My Last Bid: ${props.lastbid}</h6>
      </Card.Footer>
    </Card>

  : <Card className="card p-1 bg-dark">
  <Card.Header>
    {props.status === 1 ? <h6 style={{ textAlign: "center", color: "white" }}>Sold</h6> :
        <h6 style={{ textAlign: "center", color: "white" }}>Finished</h6>}
  </Card.Header>
          <div className="overflow" style={{ "margin": "auto" }}>
    <a href={"/auctions/id=" + props.id}>
              <Card.Img style={{ width: "413px", height: "280px" }} src={props.src} className="card-img-top" alt="cover" />
    </a>
  </div>
  <div>
    <ListGroup className="list-group list-group-flush">
      <ListGroupItem className="list-group-item  text-center">
        {props.status === 1 ? <h3>Sold: $ {props.bid}</h3> :
            <h3>Last Bid: $ {props.bid}</h3>}

      </ListGroupItem>
      <ListGroupItem className="list-group-item">
                <div style={{ height: "40px" }}>
        {props.address}
        </div>
        <br />
        <br />
        <h6 style={{ textAlign: "end" }}>
          <i className="fas fa-bed" />
          {' '}{props.bedroom}{' '}
          <i className="fas fa-bath" />
          {' '}{props.bath}{' '}
          <i className="fas fa-car" />
          {' '}{props.garage}{' '}
        </h6>

      </ListGroupItem>
    </ListGroup>
  </div>
  <Card.Footer>
<h6 style={{textAlign:"center",color:"white"}}>My Last Bid: ${props.lastbid}</h6>
  </Card.Footer>
</Card>
}
</div>
  );
}

export { ObserveAuctionItem, AuctionItem, BidderAuctionItem }
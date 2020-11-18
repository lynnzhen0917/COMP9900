import React, { useState} from 'react'
import { AuctionCard } from './AuctionCard'
import { Card } from 'react-bootstrap'
import { DatePicker } from 'antd';

// refer to the antd DatePicker component
// refer to the bootstrap Card component

export default function SearchBox() {
  // 7 different filters which can be freely combined
  const [addr, setAddr] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bath, setBath] = useState("");
  const [garage, setGarage] = useState("");
  const [state, setState] = useState("");
  const [auctstart, setAuctstart] = useState("");
  const [auctend, setAuctend] = useState("");
  const [filterDisplay, setFilterDisplay] = useState([]);

  const handleChange = e => {
    const {value, name} = e
    // console.log(value, name)
    if (name === "addr") {
      setAddr(value);
    }else if (name === "bedroom") {
      setBedroom(value);
    }else if (name === "bath") {
      setBath(value);
    }else if (name === "garage") {
      setGarage(value);
    }else if (name === "state") {
      setState(value);
    }
  };

  
  const handleClick = (e) => {
    e.preventDefault();
    let url = "http://localhost:5050";
    let formData = new FormData();
    formData.append("addr", addr);
    formData.append("bedroom", bedroom);
    formData.append("bath", bath);
    formData.append("garage", garage);
    formData.append("state", state);
    formData.append("auctstart", auctstart);
    formData.append("auctend", auctend);
    formData.append("emailaddr", localStorage.getItem("emailaddr"));
    
    // send to the backend to get the search result
    fetch(url, {
      method: "Post",
      body: formData,
    }).then((res) => res.json())
      .then((data) => {
        console.log(data)
        setFilterDisplay(data.a)
      })
      .catch((err) => console.log(err));
    
};


  return (
        <div className="searchbar-container">
          <Card>
            <Card.Body>
              <form>
                <div className = "form-row">
                  <div className = "form-group col-md-6">
                    <label className = "ad-text3">Address</label>
                    <input value={addr}
                      name = "addr"
                      onChange={e=>handleChange(e.target)}
                      className="btn btn-outline-secondary form-control"
                      aria-label="Search"
                      style={{height:"50px"}}
                    />
                  </div>

                  <div className = "form-group col-md-3">
                    <label className = "ad-text3">Starting date</label>
                      <DatePicker
                      onChange={(e,dataString)=>setAuctstart(dataString)} 
                      className="react-datepicker-wrapper"
                      style={{height:"50px"}}
                    />
                      {console.log (auctstart)}
                  </div>
                  <div className="form-group col-md-3">
                    <label className="ad-text3">Closing date</label>
                    <DatePicker
                      onChange={(e, dataString) => setAuctend(dataString)}
                      className="react-datepicker-wrapper"
                      style={{ height: "50px" }}
                    />
                  </div>
                </div>
                <br/>
                <div className = "form-row">
                  <div className = "form-group col-md-3">
                    <label className = "ad-text4">Number of Bedroom</label>
                    <input value={bedroom}
                      name = "bedroom"
                      onChange={e=>handleChange(e.target)}
                      className="btn btn-outline-warning form-control"
                      aria-label="Search"
                    />
                  </div>
                  
                  <div className = "form-group col-md-3">
                    <label className = "ad-text4">Number of Bathroom</label>
                    <input value={bath}
                      name = "bath"
                      onChange={e=>handleChange(e.target)}
                      className="btn btn-outline-warning form-control"
                      aria-label="Search"
                    />
                  </div>
                  <div className = "form-group col-md-3">
                    <label className = "ad-text4">Number of Garage</label> 
                    <input value={garage}
                      name = "garage"
                      onChange={e=>handleChange(e.target)}
                      className="btn btn-outline-warning form-control"
                      aria-label="Search"
                    />
                  </div>

                  <div className = "form-group col-md-3">
                    <label className = "ad-text4">State</label> 
                    <select  type = "text"
                      className="btn btn-outline-warning form-control"
                      value={state}
                      name="state"
                      onChange = {e=>handleChange(e.target)}>
                        <option value="">Please select</option>
                        <option value="VIC">VIC</option>
                        <option value="TAS">TAS</option>
                        <option value="NSW">NSW</option>
                        <option value="QLD">QLD</option>
                        <option value="SA">SA</option>
                        <option value="WA">WA</option>
                        <option value="ACT">ACT</option>
                        <option value="NT">NT</option>
                        <option value="JBT">JBT</option>
                    </select>
                  </div>

                  
                  <br />
                  <br/>

                </div>
                <br/>

                <div>
                  <button
                    className="btn btn-warning btn-lg btn-block"
                    type="button"
                    onClick={handleClick}
                  >
                    Search
                    </button>
                </div>
              </form>
            </Card.Body>
            
          </Card>
          <br />
          <br />
      {filterDisplay.length ? <AuctionCard auction={filterDisplay} /> :
        <p style={{ marginTop: "30px", marginBottom: "100px", textAlign: "center", color: "lightgrey", fontSize: "20px" }}>--no result--</p>
      }
      </div>
  );
};

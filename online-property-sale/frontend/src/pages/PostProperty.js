import React,{ Component } from 'react'
import FileBase64 from 'react-file-base64'
import PictureWall from '../components/UploadPics';
import { DatePicker, Alert } from 'antd';
import { Card } from 'react-bootstrap'
import { Success, Warning } from '../components/Modal'
import Alerts from '../components/Alerts'

const { RangePicker } = DatePicker;

// refer to the bootstrap card component
// refer to the antd PictureWall / DatePicker / Alert component

class PostProperty extends Component {
  // upload details of the auction
  constructor(props) {
    super(props);
    this.state = {
      emailaddr: localStorage.getItem("emailaddr"),
      paddr: "",
      city:"",
      state:"",
      zip:"",
      bed: "",
      bath: "",
      type: "",
      garage: "",
      auctstart: "",
      auctend: "",
      price: "",
      file: [],
      auc:[],
      landsize:"",
      housesize:"",
      details:"",
      success: false,
      picturewall: [],
      id: "",
      show: false,
      msg: "",
      filevalidataion: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectTime = this.handleSelectTime.bind(this);
  }

  
  handlepostProperty = (e) => {
    // if post successfully, the backend will return an auction id
    // otherwise raise alert
    e.preventDefault();
    if (this.state.filevalidataion) {
      let url = "http://localhost:5050/newpost";
      let formData = new FormData();
      let data = this.state;
      for (let name in data) {
        if (name === 'file') {
          for (var i = 0; i < data[name].length; i++) {
            // console.log(data[name][i])
            formData.append('file', data[name][i].base64)
          }

        } else if (name === 'picturewall') {
          for (var j = 0; j < data[name].length; j++) {
            // console.log(data[name][j].preview)
            formData.append('picturewall', data[name][j].mybase64)
          }
        }
        else {
          formData.append(name, data[name]);
        }

      }
      fetch(url, {
        method: "POST",
        body: formData,

      }).then(res => res.json())
        .then(data => {
          if (data.message === "post successfully") {
            this.setState({
              id: data.lastid,
              success: true
            })
          } else if (data.message === "Please upload profile") {
            this.setState({ show: true })
          } else {
            this.setState({
              msg: data.message
            })
          }
          console.log(data)
        }).catch(err => console.log(err));
    }
    
}

  getFiles(file) {
    // verify the valid file (including file type, file size and file number)
    var fileTypes = [".jpg", ".png", ".pdf"];
    var fileMaxSize = 2048;
    var isverified = false;
    this.setState( { filevalidataion: false })
    if (file.length>9) {
      this.setState({
        msg: 'Upload too many files. The maximum number of files is 9'
      })
    } else {
      for (var i = 0; i < file.length; i++) {
        var fileName = file[i].name;
        var fileSize = parseInt(file[i].size);
        // console.log(fileName, fileSize)
        if (fileSize > fileMaxSize) {
          this.setState({
            msg: 'The file size is too large. The maximum size of files is 2048 kb'
          })
         
        } else {
          if (fileName) {
            var fileEnd = fileName.substring(fileName.indexOf("."));
            if (fileTypes.indexOf(fileEnd) === -1) {
              this.setState({
                msg: "File type is not acceptable"
              })
            } else {
              isverified = true
            }
          }
        } 
      }
    }
    if (isverified) {
      this.setState({ 
        file: file,
        msg: "",
        filevalidataion: true
       })
    }
    
  }

  pictureChange(pic) {
    this.setState({ picturewall: pic })
    // console.log(this.state.picturewall)
  }

  handleSelectTime = (value,dateString) => {
      this.setState({
        auctstart: dateString[0],
        auctend:dateString[1]
      }) 
      // console.log(this.state.auctstart)
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name==="file") {
      this.setState({
        [name]: target.files,
      })
    } else {
      this.setState({
        [name]: value,
      })
    }
    // console.log(this.state.auc)
    // console.log(this.state.file,this.state.emailaddr, this.state.pwd, this.state.birthd, this.state.birthm, this.state.birthy, this.state.phone, this.state.chgpwd, this.state.cowd, this.state.cnb, this.state.expdate, this.state.csv);
  };

  render() {
    return (
      <div className = "property-container">
        <div key={+new Date() + Math.random()}></div>
        <h1>Post New Property</h1>
        <form>
          <br />
          {this.state.msg && <Alerts msg={this.state.msg} />}
            <div>
            <label>Property Address</label>
            <input
              type="text"
              name="paddr"
              value={this.state.paddr}
              onChange={this.handleChange}
              className="form-control"
            ></input>
            </div>
          <br />
          <div className="form-row">
          <div className="form-group col-md-6">
            <label>City</label>
            <input  type="text"
              name="city"
              value={this.state.city}
              onChange={this.handleChange}
              className="form-control"></input>
          </div>
          <div className="form-group col-md-4">
            <label>State</label>
            <select  type = "text"
                  className="custom-select mr-sm-2"
                  value={this.state.state}
                  onChange={this.handleChange}
                  name="state">
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
          <div className="form-group col-md-2">
            <label>Zip</label>
            <input  type="text"
              name="zip"
              value={this.state.zip}
              onChange={this.handleChange}
              className="form-control"></input>
            </div>
          <br />
        </div>
          <div className="row">
            <div className="col">
              <label>Number of Bedroom</label>
              <input
                type="text"
                name="bed"
                value={this.state.bed}
                onChange={this.handleChange}
                className="form-control"
              ></input>
            </div>

            <div className="col">
              <label>Number of Bathroom</label>
              <input
                type="text"
                name="bath"
                value={this.state.bath}
                onChange={this.handleChange}
                className="form-control"
              ></input>
            </div>
          </div>

          <br/>

          <div className="row">
            <div className="col">
            <label>Type</label>
                <select
                  type="text"
                  className="custom-select mr-sm-2"
                  value={this.state.type}
                  onChange={this.handleChange}
                  name="type">
                  <option value="">Please select</option>
                  <option value="house">House</option>
                  <option value="unit">Unit</option>
                  <option value="townhouse">Town house</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="flat">Flat</option>
                  <option value="studio">Studio</option>
                  <option value="warehouse">Warehouse</option>
                </select>
            </div>

              <br/>
            <div className="col">
            <label>Number of Garage</label>
              <select
                type="text"
                className="custom-select mr-sm-2"
                value={this.state.garage}
                onChange={this.handleChange}
                name="garage"
              >
                <option value="">Please select</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col">
              <label>Land Size</label>
              <div className="input-group mb-3">
              <input
                className="form-control"
                type="text"
                name="landsize"
                value={this.state.landsize}
                onChange={this.handleChange}
              ></input>
              <div className="input-group-append">
                <span className="input-group-text">m<sup>2</sup></span>
              </div>
              </div>
            </div>
            <div className="col">
              <label>House Size</label>
              <div className="input-group mb-3">
              <input
                className="form-control"
                type = "text"
                name = "housesize"
                value = {this.state.housesize}
                onChange = {this.handleChange}
              ></input>
              <div className="input-group-append">
                <span className="input-group-text">m<sup>2</sup></span>
              </div>
            </div>
            </div>

          </div>

          <div method="POST" 
          encType="multipart/form-data"
          >
            <div className="form-group">
              <label>Property Owner Certification</label>
              <br />
              <FileBase64
                multiple={true}
                onDone={this.getFiles.bind(this)} 
                />
                
              <small className="form-text text-muted">Please upload your Property certification, it must be in .jpg/.png/.pdf</small>
              <small className="form-text text-muted">We'll never share your information with anyone else.</small>
            </div>
          </div>
          <br />

          <div method="POST"
            encType="multipart/form-data"
            className="photo-form"
          > 
            <Card className="photo-form">
              <Card.Header>Photos of Property</Card.Header>
              <Card.Body>
                <Card.Title></Card.Title>
                <PictureWall
                  onDone={this.pictureChange.bind(this)}
                />

              </Card.Body>
            </Card>
          
          </div>
          <br />
          <label>Auction Duration</label>
          <RangePicker showTime onChange={this.handleSelectTime} className="react-datepicker-wrapper"/>
          <br />
          <br/>

          <div>
            <label>Reverse Price</label>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="text"
                name="price"
                value={this.state.price}
                onChange={this.handleChange}
                className="form-control"
              ></input>
              <div className="input-group-append">
                <span className="input-group-text">.00</span>
              </div>
            </div>
            
            <small className="form-text text-muted">We will never show the reverse price to the bidders and observers.</small>
          </div>
         
          <br />

          <div className="form-group">
            <label>Details</label>
            <textarea
                type="text"
                name="details"
                value={this.state.details}
                onChange={this.handleChange}
                className="form-control"
                rows="7"></textarea>
          </div>
          <Alert
            message="Warning"
            description="Once you post the auction, you cannot change the details unless you contact us by email (FVC5@gmail.com)."
            type="warning"
            showIcon
            closable
          />

          <br />
          <button
            type="submit"
          className="btn btn-primary btn-lg btn-block"
          onClick={this.handlepostProperty}
          >
            Post
          </button>
          
        </form>
        {this.state.success ? <Success body="posted your property" link={"/auctions/id="+this.state.id} button="View details" other={false} /> 
        : <Warning show={this.state.show} />}
      </div>
    )   
  }
}
export default PostProperty
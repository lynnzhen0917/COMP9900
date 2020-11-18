import React,{ Component } from 'react'
import FileBase64 from 'react-file-base64'
import { birthyear, birthmonth, birthday } from '../components/birthInfo'
import { Success } from '../components/Modal'
import Alerts from '../components/Alerts'

const judgeItem = (props) => {
  // used to set the previous (default) value in the form
  const x = localStorage.getItem(props)
  return x === "null" ? "" : x
}


class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailaddr: localStorage.getItem("emailaddr"),
      fname: localStorage.getItem("firstname"),
      lname: localStorage.getItem("lastname"),
      birthy: judgeItem("birthyear"),
      birthm: judgeItem("birthmonth"),
      birthd: judgeItem("birthday"),
      phone: judgeItem("phone"),
      chgpwd: "",
      cpwd: "",
      cnb: judgeItem("card"),
      expdate: judgeItem("expdate"),
      csv: judgeItem("csv"),
      file: [],
      success: false,
      msg: "",
      filevalidataion: true,
      auth: 0,
      flength: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }



  handleProfile = (e) => {
    e.preventDefault();
    // if the new profile is submitted, the previous value will be changed and store in localStorage
    if (this.state.filevalidataion) {
      let url = "http://localhost:5050/profile";
      let formData = new FormData();
      let data = this.state;
      for (let name in data) {
        if (name === 'file') {
          for (var i = 0; i < data[name].length; i++) {
            console.log(data[name][i])
            formData.append('file', data[name][i].base64)
          }
        } else {
          formData.append(name, data[name]);
        }

      }
      fetch(url, {
        method: "POST",
        body: formData,

      }).then(res => res.json())
        .then(data => {
          console.log(data)
          localStorage.setItem('success', data.message);
          localStorage.setItem('msg', data.msg);
          localStorage.setItem('emailaddr', this.state.emailaddr);
          localStorage.setItem('firstname', data.userfirst);
          localStorage.setItem('lastname', data.userlast);
          localStorage.setItem('birthyear', data.birthyear);
          localStorage.setItem('birthmonth', data.birthmonth);
          localStorage.setItem('birthday', data.birthday);
          localStorage.setItem('phone', data.phone);
          localStorage.setItem('expdate', data.expdate);
          localStorage.setItem('card', data.card);
          localStorage.setItem('csv', data.csv);
          if (localStorage.getItem("msg") === "password changed") {
            localStorage.setItem('success', data.msg);
            window.location.replace("/signin")
          }
          else {
            if (localStorage.getItem("success") === "signin successfully") {
              this.setState({
                success: true,
                msg: ""
              })
            } else {
              this.setState({
                msg: data.message
              })
            }

          }
        }).catch(err => console.log(err));

    }
    
};


  getFiles(file) {
    // verify the valid file (including file type, file size and file number)
    var fileTypes = [".jpg", ".png", ".pdf"];
    var fileMaxSize = 1024;
    var isverified = false;
    this.setState({ filevalidataion: false })
    if (file.length>3) {
      this.setState({
        msg: 'Upload too many files. The maximum number of files is 3'
      })
    } else {
      for (var i = 0; i < file.length; i++) {
        var fileName = file[i].name;
        var fileSize = parseInt(file[i].size);
        console.log(fileName, fileSize)
        if (fileSize > fileMaxSize) {
          this.setState({
            msg: 'The file size is too large. The maximum size of files is 1024 kb'
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
   console.log(this.state.file,this.state.emailaddr, this.state.pwd, this.state.birthd, this.state.birthm, this.state.birthy, this.state.phone, this.state.chgpwd, this.state.cowd, this.state.cnb, this.state.expdate, this.state.csv);
  };

  componentDidMount() {
    // get authentication status when refresh the webpage
    // if authentication is verified, the user can join as seller and bidder
    // if the user has not uploaded the identication, this is a button for him to upload files
    fetch("http://127.0.0.1:5050/checkAuth/" + this.state.emailaddr)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        this.setState({
          auth: data.checkAuth,
          flength: data.files_length
        })

      })
      .catch(e => console.log("error", e));
  }


  render() {

    return (
      <div className = "profile-container">
        <h1>Profile</h1>
        <form>
          <br />
          {this.state.msg && <Alerts msg={this.state.msg} />}
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Email</label>

            <div className="col-sm-10">
              <input  
              type="text" 
              className="form-control" 
              disabled="disabled"
              value={localStorage.getItem("emailaddr")} />
    </div>
            </div>
          <div className = "row">
            <div className = "col">

              <label>First name</label>
              <input
                type = "text"
                name = "fname"
                value = {this.state.fname}
                onChange = {this.handleChange}
                className = "form-control"
              ></input>
            </div>
            <div className = "col">
              <label>Last name</label>
              <input
                type = "text"
                name = "lname"
                value = {this.state.lname}
                onChange = {this.handleChange}
                className = "form-control"
              ></input>
            </div>
          </div>

          <br/>

          <label>Date of Birth</label>
          <div>
            <div className="form-row">
              <div className="col">
                <select
                  type = "text"
                  className="custom-select mr-sm-2"
                  value={this.state.birthy}
                  onChange={this.handleChange}
                  name="birthy"
                >
                  <option value="">year</option>
                  {birthyear.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>

              <div className="col">
                <select
                  type = "text"
                  className="custom-select mr-sm-2"
                  value={this.state.birthm}
                  onChange={this.handleChange}
                  name="birthm"
                >
                  <option value="">month</option>
                  {birthmonth.map(month => <option key={month} value={month}>{month}</option>)}
                </select>
              </div>
              <div className="col">
                <select
                  type = "text"
                  className="custom-select mr-sm-2"
                  value={this.state.birthd}
                  onChange={this.handleChange}
                  name="birthd"
                >
                  <option value="">day</option>
                  {birthday.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
            </div>

            <br/>
            <label>Phone</label>
            <input
              type = "text"
              name = "phone"
              value = {this.state.phone}
              onChange = {this.handleChange}
              className = "form-control"
            ></input>
          </div>
          <br />
          <div method="POST" 
          encType="multipart/form-data"
          >
            <div className="form-group">
              <label>Real-Name Authentication</label>
              <br />
              {/* check whether the user has already uploaded the identification
                  if he/she has uploaded, the file will be checked manually
                  */}
              
              {this.state.flength===0 ?
              <div>
                  <FileBase64
                    multiple={true}
                    onChange={this.verifyfile}
                    onDone={this.getFiles.bind(this)}
                  />
                  <small className="form-text text-muted">Please upload your ID photo, and it must be in .jpg/.png/.pdf </small>

              </div>
               : this.state.auth===0 ? 
                  <p className="text-danger"><i className="fas fa-chalkboard-teacher" /> Already uploaded! Waiting for verification...</p>: 
                  <p className="text-success"><i className="fas fa-thumbs-up" /> Your identification has been verified!</p>}
              <small className="form-text text-muted">We'll never share your ID information with anyone else.</small>
            </div>
          </div>
          
       
          <div>
            <label>Change password</label> 
            <input
                type = "password"
                name = "chgpwd"
                value = {this.state.chgpwd}
                onChange = {this.handleChange}
                className = "form-control"
              ></input>
          </div>
          
          <br/>
          <div>
            <label>Confirm password</label>
            <input
                type = "password"
                name = "cpwd"
                value = {this.state.cpwd}
                onChange = {this.handleChange}
                className = "form-control"
              ></input>
          </div>
          
          <br/>
          <h5>Payment details </h5>           
          <br/>
          <div>
            <label>Card number</label>
            <input
                type = "text"
                name = "cnb"
                value = {this.state.cnb}
                onChange = {this.handleChange}
                className = "form-control"
              ></input>
          </div>

          <br/>
          <div>
            <label>Expired date</label>
            <input
                type = "text"
                name = "expdate"
                value = {this.state.expdate}
                onChange = {this.handleChange}
                className = "form-control"
                placeholder="mm/yy"
              ></input>
          </div>
          
          <br/>
          <div>
            <label>CSV</label>
            <input
                type = "text"
                name = "csv"
                value = {this.state.csv}
                onChange = {this.handleChange}
                className = "form-control"
                placeholder="3-digit number"
              ></input>
          </div>
          <br/>
          <button
            type="submit"
          className="btn btn-primary btn-lg btn-block"
          onClick={this.handleProfile}
          >
            Save
          </button>

        </form>
        {this.state.success && <Success body="updated your profile" link="/" button="Back to Home" other={false} />}
      </div>
    )   
  }
}
export default Profile


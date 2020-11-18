import React, { Component } from 'react'
import Alerts from '../components/Alerts'
import { birthyear, birthmonth, birthday } from '../components/birthInfo'
import { PolicyAlert, Success } from '../components/Modal'
import { Button } from 'react-bootstrap'

class Register extends Component {
  // register function
  constructor() {
    super();
    this.state = {
      emailaddr: "",
      pwd: "",
      cpwd: "",
      fname: "",
      lname: "",
      birthy: "",
      birthm: "",
      birthd: "",
      privacy: false,
      regis: false,
      msg: "",
      
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleRegistration = (e) => {
      // if sign up successfully, it will show a successful modal and jump to the signin page
      e.preventDefault();
      let url = "http://localhost:5050/register";
      let formData = new FormData();
      let data = this.state;
      for (let name in data) {
        formData.append(name, data[name]);
      }
      fetch(url, {
        method: "POST",
        body: formData,
      }).then((res) => res.json())
        .then((data) => {
          localStorage.setItem("success", data.message);

          if (
            localStorage.getItem("success") === "Signup successfully."
          ) {
            this.setState( {
              regis: true,
              msg: "",
            } )
          } else {
            this.setState({ msg: data.message})
          }
        })
        .catch((err) => console.log(err));
  };

  handleChange = (event) => {
    const { value, name, type, checked } = event.target;
    type === "checkbox" ? 
    this.setState({
      [name]: checked,
    }) : this.setState({
      [name]: value,
    });

    console.log(this.state.emailaddr, this.state.pwd,this.state.privacy);
  };

  render() {
    return (
      <div className="signin-container" style={{ width: "30rem"}}>
        <h1>Sign Up</h1>
        <form>
          {this.state.msg && <Alerts msg={this.state.msg} />}
          <div className="form-group">
            <label>Email address</label>
            <label className="text-danger">*</label>
            
            <input
              type="email"
              name="emailaddr"
              value={this.state.emailaddr}
              onChange={this.handleChange}
              className="form-control"
              placeholder="name@example.com"
            ></input>
            </div>
          <div className="form-group">
            <label>Password</label>
            <label className="text-danger">*</label>
            <input
              type="password"
              name="pwd"
              placeholder="not less than 6 characters"
              value={this.state.pwd}
              onChange={this.handleChange}
              className="form-control"
            ></input>
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <label className="text-danger">*</label>
            <input
              type="password"
              name="cpwd"
              placeholder="repeat the password above"
              value={this.state.cpwd}
              onChange={this.handleChange}
              className="form-control"
            ></input>
          </div>
          <label>Real Name</label>
          <label className="text-danger">*</label>
          <div className="form-row">
            <div className="col">
              <input
                type="text"
                name="fname"
                value={this.state.fname}
                onChange={this.handleChange}
                className="form-control"
                placeholder="First name"
              ></input>
            </div>
            <div className="col">
              <input
                type="text"
                name="lname"
                value={this.state.lname}
                onChange={this.handleChange}
                className="form-control"
                placeholder="Last name"
              ></input>
              <br />
            </div>
          </div>
          <label>Date of Birth</label>
          <div className="form-row">
            <div className="col">
              <select
                className="custom-select mr-sm-2"
                type="text"
                onChange={this.handleChange}
                value={this.state.birthy}
                name="birthy"
              >
                <option value="">year</option>
                {birthyear.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>

            <div className="col">
              <select
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
          <br />
          
          <div className="form-group form-check"> 
            <input type="checkbox" 
            className="form-check-input" 
            name="privacy"
            checked={this.state.privacy}
            onChange={this.handleChange}
            />
            <label className="form-check-label">
              I have read and agree to <PolicyAlert /></label>
          </div>
        
          
          <Button
            type="submit"
            variant="primary"
            onClick={this.handleRegistration}
            className="btn btn-primary btn-lg btn-block"
          >
            Register
          </Button>
          <br />
        </form>
        {this.state.regis && <Success body="signed up" link="/signin" button="Sign In" other={false} />}
      </div>
    );
  }
}
export default Register;
import React, { Component } from 'react'
import Alerts from '../components/Alerts'
import { Form, Button } from 'react-bootstrap'

// refer to the bootstrap Form and Button component

class SignIn extends Component {
  // signin function
  // will check the password and email address
  constructor(props) {
    super(props);

    this.state = {
      emailaddr: "",
      pwd: "",
      fail: false,
      msg: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleSignIn = (e) => {
    e.preventDefault();
    let url = "http://localhost:5050/signin";
    let formData = new FormData();
    let data = this.state;
    for (let name in data) {
      formData.append(name, data[name]);
    }

    fetch(url, {
      method: "POST",
      body: formData,
    }).then(res => res.json())
      .then(data => {
        localStorage.setItem('success', data.message);
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
        if (localStorage.getItem("success") === "signin successfully") {
          window.location.replace("/")
        } else {
          this.setState(
            { fail: true, 
              msg: "Please check the email address and password!"
            })
          // alert(data.message)
        }
      }).catch(err => console.log(err));
  }

  handleChange = (event) => {
    const target = event.target;
    const {value, name, type, checked} = target;
    type === "checkbox" ?
    this.setState({
      [name]: checked,
    }) : this.setState({
      [name]: value,
    });
  };

  render() {
    return (
      <div className="signin-container" style={{ width: "20rem" }}>
        <h1>Sign In</h1>
        {this.state.fail && <Alerts msg={this.state.msg} />}
        <Form>
          <div className="form-signin">
            <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="emailaddr"
              value={this.state.emailaddr}
              onChange={this.handleChange}
              className="form-control"
              placeholder="name@example.com"
            ></Form.Control>
            </Form.Group>
          </div>
          <div className="form-signin">
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="pwd"
                placeholder="Password"
                value={this.state.pwd}
                onChange={this.handleChange}
                className="form-control"
              ></Form.Control>
            </Form.Group>
            
            <br />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            onClick={this.handleSignIn}
            className="btn btn-primary btn-lg btn-block"
          >
            Submit
          </Button>
          <a href="/register">
            <Button type="button" variant="link" className="btn btn-link btn-block">
              Do not have an account? Register!
            </Button>
          </a>
        </Form>
      </div>
    );
  }
}
export default SignIn;
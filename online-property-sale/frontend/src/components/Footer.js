import React, { Component } from 'react'

class Footer extends Component {
    render() {
        return (
          <div>
            
            <footer style={{
              textAlign:"center", color:"white",
              background:"grey", position: "fixed",
              bottom: "0", width:"100%",
              height: "50px",
              zIndex: "999",
              }}>
              <div>
                <div>© 2020 Copyright FVC5</div>
                <div>contact: FVC5@gmail.com</div>
              </div>
            </footer>
          </div>

        );
    }
}

export default Footer;

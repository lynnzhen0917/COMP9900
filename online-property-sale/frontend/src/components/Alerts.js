import React from 'react'
import { Alert } from 'react-bootstrap'

// refer to the bootstrap Alert component

// used to alert users something wrong when registration, login and posting
const Alerts = (props) => {
    return (
        // catch the error message from backend and render to the website
        <Alert variant="danger" style={{ fontSize: "16px" }}>
            Error: {props.msg}

        </Alert>
        
   
    )
}

export default Alerts
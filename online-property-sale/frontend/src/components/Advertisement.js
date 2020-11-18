import React from 'react'

// on the top of the homepage
// beautify the homepage
const Advertisement = () => {
    return (
        
        <div className="ad-container">
            {/* some slogan */}
            <figure className="ad-img-container">
                <img  className="mw-100" src="images/img-11.jpg" alt="advertisement" />
            </figure>
            <h1 className="ad-text1">Excellent Property Auction Platform</h1>
            <h1 className="ad-text2">Start your journey now!</h1>
        </div>
    )
}

export default Advertisement
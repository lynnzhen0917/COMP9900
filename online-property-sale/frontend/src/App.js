/*
  App.js contains all the pages and corresponding functions of online-property-sale project
  Team member of FVC5:
  Anqige Wu   z5199351@ad.unsw.edu.au z5199351 Developer/Master
  Yuchen Yang z5189310@ad.unsw.edu.au z5189310 Developer
  Rong Zhen   z5225226@ad.unsw.edu.au z5225226 Developer
  Dan Su      z5226694@ad.unsw.edu.au z5226694 Developer
  Jiaqi Sun   z5233100@ad.unsw.edu.au z5233100 Developer
*/
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Auctions from './pages/Auctions'
import Register from './pages/Register'
import Profile from './pages/Profile'
import PostProperty from './pages/PostProperty'
import Footer from './components/Footer'
import { BecomeBidder, BecomeObserver } from './pages/AfterInterest'
import { CurrentBid, CurrentObserve, CurrentPost, 
        HistoryObserve, HistoryPost, HistoryBid } from './pages/DashBoard'

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/signin" component={SignIn} />
          <Route path="/auctions/id=:id" component={Auctions} />
          <Route path="/register" component={Register} />
          <Route path="/profile" component={Profile} />
          <Route path="/currentpost" component={CurrentPost} />
          <Route path="/currentbid" component={CurrentBid} />
          <Route path="/currentobserve" component={CurrentObserve} />
          <Route path="/historypost" component={HistoryPost} />
          <Route path="/historybid" component={HistoryBid} />
          <Route path="/historyobserve" component={HistoryObserve} />
          <Route path="/newpost" component={PostProperty} />
          <Route path="/become-bidder/id=:id" component={BecomeBidder} />
          <Route path="/become-observer/id=:id" component={BecomeObserver} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

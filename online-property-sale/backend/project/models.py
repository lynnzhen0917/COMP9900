from flask_login import UserMixin
from . import db
# -----------------------------------------------------------------------
# Database for the users and auctions, this two table can be connected by
# the email of user. We use sqlite as the database and flask-sqlalchemy to
# operate the database.
# -----------------------------------------------------------------------
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy, user_id
    email = db.Column(db.String(100), unique=True) # user_email
    password = db.Column(db.String(100)) # password encoded using hash method
    firstname = db.Column(db.String(1000)) # first name
    lastname = db.Column(db.String(1000)) # lastname
    birthmonth =  db.Column(db.String(100)) # month of birthday
    birthyear = db.Column(db.String(100)) # year of birthday
    birthday = db.Column(db.String(100)) # day of birthday
    phone =  db.Column(db.String(1000)) # phone number
    card = db.Column(db.String(1000)) # card number
    expdate = db.Column(db.String(1000)) # expire date of card
    csv = db.Column(db.String(100)) # csv number of card
    profile = db.Column(db.String(10000)) # user real name Authentication
    bidhistory = db.Column(db.String(10000)) # user bid history
    observehistory = db.Column(db.String(10000)) # user observe history
    searchhistory = db.Column(db.String(100000)) # save the last ten search records
    search = db.Column(db.Integer) # check whether the user searched before
    checkAuth = db.Column(db.Integer) # manual review and modification

class Auction(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy, auction_id
    email = db.Column(db.String(100), unique=True) # user's email who post the auction
    proaddr = db.Column(db.String(1000)) # property's address
    numOfBed = db.Column(db.String(100)) # number of bedrooms
    numOfBath = db.Column(db.String(100)) # number of bathrooms
    protype =  db.Column(db.String(100)) # type of property
    numOfGarage = db.Column(db.String(100)) # number of garage
    certification = db.Column(db.String(10000)) # the certification of property
    pic = db.Column(db.String(10000)) # property pictures using base64
    land = db.Column(db.String(100)) # land area
    house = db.Column(db.String(100)) # house area
    starttime =  db.Column(db.String(100)) # aution duration
    endtime = db.Column(db.String(100)) 
    reprice = db.Column(db.String(1000)) #reserve price
    city = db.Column(db.String(100)) 
    state = db.Column(db.String(100))
    zipcode = db.Column(db.String(100))
    details = db.Column(db.String(10000))
    bidder = db.Column(db.String(10000)) # bidders list
    observer = db.Column(db.String(10000)) # observers list
    bidprice = db.Column(db.String(10000)) # all bid history
    finish = db.Column(db.Integer) # finish state

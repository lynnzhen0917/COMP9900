# -------------------------------------------------------------
# auth.py
# Here is the all functions of backend for the team FVC5
# Anqige Wu   z5199351@ad.unsw.edu.au z5199351 Developer/Master
# Yuchen Yang z5189310@ad.unsw.edu.au z5189310 Developer
# Rong Zhen   z5225226@ad.unsw.edu.au z5225226 Developer
# Dan Su      z5226694@ad.unsw.edu.au z5226694 Developer
# Jiaqi Sun   z5233100@ad.unsw.edu.au z5233100 Developer
# ---------------------------------------------------------------
import os
from flask import request, jsonify,send_from_directory
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from flask_login import login_user, logout_user, login_required
from .models import User,Auction
from . import db, create_app
import re
import json
import smtplib
from email.mime.text import MIMEText
from email.header import Header
import time
import datetime
import random


app = create_app()
db = SQLAlchemy(app)

# send email function here using qq mail as our host mail
def sendmail(email,msgs):
    from_addr = '634036964@qq.com' 
    password = 'navupimcscckbeii'
    to_addr = email  
    smtp_server = 'smtp.qq.com' 
    msgContent = msgs
    msg = MIMEText(msgContent, 'plain', 'utf-8')
    msg['Subject'] = 'FVC5 Negotiation'
    msg['Content-Type'] = 'Text/HTML'
    msg['From'] = from_addr
    msg['To'] = to_addr

    try:
        server = smtplib.SMTP_SSL(smtp_server, 465)
        server.set_debuglevel(1)

        server.login(from_addr, password)
        server.sendmail(from_addr, [to_addr], msg.as_string())
        server.quit()
        print ('Send Success')

    except smtplib.SMTPException:
        print ('Send Failed')
# ------------------------------------------------------------------------------
# Login page
# In this function, we will get the email and password from frontend. Search the
# email from database and determine whether it exists. If it exists, compare whether 
# the password is consistent. If yes, using flask_login to login and return 200.
# If no, return 400 and send a message which content is 'Login Fail'.
# -------------------------------------------------------------------------------
@app.route('/signin', methods=['POST'])
def login_post():
    email = request.form.get('emailaddr')
    password = request.form.get('pwd')
    remember = True if request.form.get('remember') else False
    user = User.query.filter_by(email=email).first()
    # check if user actually exists
    # take the user supplied password, hash it, and compare it to the hashed password in database
    if not user or not check_password_hash(user.password, password):
        return jsonify(success=False,message='Login Fail'),400  # if user doesn't exist or password is wrong, reload the page
    # if the above check passes, then we know the user has the right credentials
    login_user(user, remember=remember)
    return jsonify(success=True,message='signin successfully',userfirst=user.firstname, 
        userlast=user.lastname, birthyear=user.birthyear, birthmonth=user.birthmonth,
        birthday=user.birthday,phone = user.phone,expdate = user.expdate,card = user.card,csv=user.csv),200

# ------------------------------------------------------------------------------
# Signup page
# In this function, we will get the register details from frontend. And add the new
# user to the database.
# -------------------------------------------------------------------------------

@app.route('/register', methods=['POST'])
def signup_post():
    email = request.form.get('emailaddr')
    firstname = request.form.get('fname')
    lastname = request.form.get('lname')
    password = request.form.get('pwd')
    confirm = request.form.get('cpwd')
    birthyear = request.form.get('birthy')
    birthmonth = request.form.get('birthm')
    birthday = request.form.get('birthd')
    privacy = request.form.get('privacy')
    if password == '' or confirm == '' or firstname == '' or lastname == '' or email == '':
        # check whether the required information is complete
        # if not, return 400 and get a warning
        return jsonify(success=False,message='Please enter specific content.'),400
    # if all the required information is complete, check the format
    # email format must be xxxxxx@xxxx.xxx
    mail = re.compile('^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$')
    if not re.search(mail,email):
        # if the format requirements are not meet,return 400 and get a warning
        return jsonify(succes=False,message='Email must be xxxxxxx@xxxx.xxxx'),400
    user = User.query.filter_by(
        email=email).first()  # if this returns a user, then the email already exists in database
    if user:  # if a user is found, we want to redirect back to signup page so user can try again
        return jsonify(succes=False,message='This email already exists.'),400
    # the minimum length of password must be 6
    if len(password) < 6:
        return jsonify(succes=False,message='The length of password must not less than 6 characters.'),400
    # the confirm password and password must same
    if confirm != password:
        return jsonify(succes=False,message='Different password. Please confirm.'),409
    # privacy policy must be read
    if privacy == 'false':
        return jsonify(success=False,message='Please read the Privacy Policy.'),400
    # if the above check passes, create new user with the form data and add it to the database.
    new_user = User(email=email, firstname=firstname,lastname=lastname, password=generate_password_hash(password, method='sha256'),birthyear = birthyear,birthmonth=birthmonth,birthday=birthday,bidhistory='[]',observehistory='[]',searchhistory='[]',search=0,checkAuth=0)

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()
    return jsonify(succes=True,message='Signup successfully.'),200

# ------------------------------------------------------------------------------
# CheckAuth function
# In this function, we will check whether the authentication has been identified
# manually. 
# -------------------------------------------------------------------------------

@app.route('/checkAuth/<email>', methods=['GET'])
def checkAuth(email):
    user = User.query.filter_by(email=email).first()
    checkAuth = user.checkAuth
    if user.profile != None:
        files_length = len(eval(user.profile))
    else:
        files_length = 0
    return jsonify(checkAuth=checkAuth,files_length = files_length),200

# ------------------------------------------------------------------------------
# profile page
# In this function, we will get the user profile from frontend. And add the infor-
# mation to the database. If an information already exists, it will show in the page.
# User can change the information in the page.
# -------------------------------------------------------------------------------

@app.route('/profile', methods=['POST'])
def profile():
    email = request.form.get('emailaddr')
    fname = request.form.get('fname')
    lname = request.form.get('lname')
    birthyear = request.form.get('birthy')
    birthmonth = request.form.get('birthm')
    birthday = request.form.get('birthd')
    phone = request.form.get('phone')
    changePass = request.form.get('chgpwd')
    cpwd = request.form.get('cpwd')
    card = request.form.get('cnb')
    expdate = request.form.get('expdate')
    csv = request.form.get('csv')
    f = request.form.getlist('file') # get the list of real-name Authentication files which are base64.
    file_string = str(f)
    # using email get from frontend to connect the database
    # and then check the format of input information.
    # if the format is correct, set the value into database
    user = User.query.filter_by(email=email).first()
    msg = ""
    user.firstname=fname
    user.lastname = lname
    user.birthday = birthday
    user.birthmonth = birthmonth
    user.birthyear = birthyear
    user.phone = phone
    checkAuth = user.checkAuth
    # csv number must be three digitals
    # card number must be digital
    cardmatch = re.compile('^\d*$')
    if not re.search(cardmatch,card):
        return jsonify(success=False,message='Card number must be integers!'),400
    else:
        user.card = card
    # csv number must be three digitals
    csvmatch = re.compile('^[0-9][0-9][0-9]$')
    if (len(csv) == 3 and re.search(csvmatch,csv)) or len(csv) == 0:
        user.csv = csv
    else:
        return jsonify(success=False,message='CSV must be 3 integers!'),400
    # expire date must be month/year
    edate = re.compile('^(0[1-9]|1[0-2])/([0-9][0-9])$')
    if re.search(edate,expdate) or len(expdate) == 0:
        user.expdate = expdate
    else:
        return jsonify(succes=False,message='Expried Date must be mm/yy!'),400
    # changed password must not equal to previous password and must equal to confirm password
    # also the minimum length of  changed password must be 6
    if changePass != "" and not check_password_hash(user.password, changePass) and changePass == cpwd and len(changePass) >= 6:
        user.password = generate_password_hash(changePass, method='sha256')
        msg = "password changed"
    elif (len(changePass) < 6 and changePass != "") or changePass != cpwd:
        return jsonify(success=False,message='Check password again!'),400
    if f != []:
        user.profile = file_string
    # if the above check passes, we update the user table in database.
    # users can update their profile multiple times.
    db.session.merge(user)
    db.session.commit()
    return jsonify(succes=True,message='signin successfully',userfirst=user.firstname, 
        userlast=user.lastname, birthyear=user.birthyear, birthmonth=user.birthmonth,
        birthday=user.birthday,phone = user.phone,expdate = user.expdate,card = user.card,csv=user.csv,msg=msg,f =f,checkAuth=checkAuth),200

# ------------------------------------------------------------------------------
# Join as a bidder page
# In this function, we get the email, auction id, bid price and bid time from
# frontend. Only users who have completed all profiles can place the bid. After
# bidding successfully, we add the bid history to both auction table and user
# table.
# -------------------------------------------------------------------------------

@app.route('/placebid', methods=['POST','PUT'])
def placeBid():
    if request.method == 'POST':
        email = request.form.get("emailaddr")
        id1 = request.form.get("id")
        amount1 = request.form.get("amount")
        time1 = request.form.get("timestamp")
        user = User.query.filter_by(email=email).first()
        # check whether the user complete all profiles
        # if yes, add the bid history into user's bidhistory, update the user table
        if user.firstname != '' and user.lastname != '' and user.phone != None and user.card != None and user.expdate != None and user.csv != None and user.profile != None and user.checkAuth == 1:
            bidhistory = eval(user.bidhistory)
            bidhistory.append((id1,amount1))
            user.bidhistory = str(bidhistory)
            db.session.merge(user)
            db.session.commit()
            msg = "Success"
            return jsonify(message='Success place a new bid',id=id1,amout=amount1,time=time1,msg = msg),200
        else:
            # if no, get a warning and redirect to the profile page to complete
            msg = "Please upload profile"
        return jsonify(message='Fail',msg = msg),400
    else:
        # we will also update the bid history to the auction table
        f = request.get_json("body")
        placebid2(f["email"],f["id"],f["amount"],f["timestamp"])
        return jsonify(message=f),200
    
    

def placebid2(email,auctionid,amount,btime):
    user = User.query.filter_by(email=email).first()
    # check whether the user complete all profiles
    # if yes, add the bid history into auction's bidhistory and update the auction's bidder list, update the auction table
    if user.firstname != '' and user.lastname != '' and user.phone != None and user.card != None and user.expdate != None and user.csv != None and user.profile != None:
        myid = user.id
        auction = Auction.query.filter_by(id=auctionid).first()

        d_endtime=time.strptime(auction.endtime,"%Y-%m-%d %H:%M:%S")
        d_time=time.strptime(btime,"%Y-%m-%d %H:%M:%S")
        timestamp_endtime = int((time.mktime(d_endtime)))
        timestamp_btime = int(time.mktime(d_time))

        if(timestamp_endtime - timestamp_btime <= 300):
            new_end = timestamp_endtime + 120
            new_end = datetime.datetime.fromtimestamp(new_end)
            auction.endtime = str(new_end)

        bidprice=eval(auction.bidprice)
        
        bidprice.append((myid,btime,amount))
        bidder = eval(auction.bidder)
        bidder.append(email)
        bidder = list(set(bidder))
        auction.bidprice = str(bidprice)
        auction.bidder = str(bidder)
        db.session.merge(auction)
        db.session.commit()
        msg = "Success"
        jsonify(message='Success place a new bid',id=auctionid,amout=amount,btime=btime,msg=msg),200
    else:
        # if no, get a warning and redirect to the profile page to complete
        msg = "Please upload profile"
    return jsonify(message='Fail',msg=msg),400
# ------------------------------------------------------------------------------
# Join as a observer page
# In this function, we get the email and auction id from frontend. All users can 
# observe auctions.After observing successfully, we add 
# the observe history to both auction table and user table.
# -------------------------------------------------------------------------------

@app.route('/follow', methods=['POST','PUT'])
def follow():
    if request.method == 'POST':
        f = request.get_json("body")
        email = f["email"]
        auctionid = f["id"]
        user = User.query.filter_by(email=email).first()
        # add the observe history into user's observe history and update the user table
        observehistory=eval(user.observehistory)
        observehistory.append(auctionid)
        user.observehistory = str(observehistory)
        db.session.merge(user)
        db.session.commit()
        return jsonify(message='Success follow'),200
    else:
        f = request.get_json("body")
        follow2(f["email"],f["id"])
        return jsonify(message='Success follow'),200
def follow2(email,auctionid):
    auction = Auction.query.filter_by(id=auctionid).first()
    # add the observer into auction's observer list and update the auction table
    observer=eval(auction.observer)
    observer.append(email)
    auction.observer = str(observer)
    db.session.merge(auction)
    db.session.commit()
    return jsonify(message='Success place a new bid',id=auctionid),200
# ------------------------------------------------------------------------------
# Cancel observe
# In this function, we get the email and auction id from frontend. All users can 
# cancel observe if they want. After cancelling successfully, we remove the history 
# from both auction table and user table.
# -------------------------------------------------------------------------------
@app.route('/cancelobserve', methods=['POST','PUT'])
def CancelFollow():
    if request.method == 'POST':
        f = request.get_json("body")
        email = f["email"]
        auctionid = f["id"]       
        user = User.query.filter_by(email=email).first()
        observehistory=eval(user.observehistory)
        # remove the cancelled auction id from user's observe history and update the user table
        observehistory.remove(str(auctionid))
        user.observehistory = str(observehistory)
        db.session.merge(user)
        db.session.commit()
        return jsonify(message='Success cancel follow'),200
    else:
        f = request.get_json("body")
        Cancelfollow2(f["email"],f["id"])
        return jsonify(message='Success cancel follow'),200
def Cancelfollow2(email,auctionid):
    auction = Auction.query.filter_by(id=auctionid).first()
    observer=eval(auction.observer)
    # remove the observer's email from the cancelled auction's observer list and update the auction table
    observer.remove(email)
    auction.observer = str(observer)
    db.session.merge(auction)
    db.session.commit()
    return jsonify(message='Success place a new bid',id=auctionid),200

# ------------------------------------------------------------------------------
# Post new auction page
# In this function, we get the email from frontend. Only users who have completed 
# all profiles can post auctions. After checking the profiles and format of auction
# details, we add the new auction into auction table and update.
# -------------------------------------------------------------------------------

@app.route('/newpost', methods=['POST'])
def newPost():
    email = request.form.get('emailaddr')
    user = User.query.filter_by(email=email).first()
    # check whether the user complete all profiles
    # if yes, get the information of property from data form.
    if user.firstname != '' and user.lastname != '' and user.phone != None and user.card != None and user.expdate != None and user.csv != None and user.profile != None and user.checkAuth == 1:
        proaddr = request.form.get('paddr')
        numOfBed = request.form.get('bed')
        numOfBath = request.form.get('bath')
        protype = request.form.get('type')
        numOfGarage = request.form.get('garage')
        city = request.form.get('city')
        state = request.form.get('state')
        zipcode = request.form.get('zip')
        starttime = request.form.get('auctstart')
        endtime = request.form.get('auctend')
        reprice = request.form.get('price')
        certification = request.form.getlist('file')
        details = request.form.get('details')
        land = request.form.get('landsize')
        house = request.form.get('housesize')
        pic = request.form.getlist('picturewall')
        pic_unique = list(set(pic))
        pic_unique.sort(key = pic.index) # remove all repeat pictures here
        # check whether all the required information are completed
        # if yes, check the format of the information
        if land != "" and house != "" and city != "" and state!= "" and zipcode != "" and details != "" and proaddr != "" and numOfBath != "" and numOfBed != "" and protype != "" and numOfGarage != "" and starttime != "" and endtime != "" and reprice != "" and str(certification) != "[]" and str(pic) != "[]":
            # the number of bedroom, bathroom, garage and zipcode must be integers.
            # the zipcode must be 4 digitals
            zipmatch = re.compile('^\d+$')
            if not re.search(zipmatch,zipcode) or len(zipcode) != 4:
                return jsonify(success=False,message='Please input 4 digits for zipcode. '),409
            bedmatch = re.compile('^\d+$')
            if not re.search(bedmatch,numOfBed):
                return jsonify(success=False,message='Please input an Integer for bedroom.'),409
            bathmatch = re.compile('^\d+$')
            if not re.search(bathmatch,numOfBath):
                return jsonify(success=False,message='Please input an Integer for bathroom.'),409
            landmatch = re.compile('^\d+$')
            if not re.search(landmatch,land):
                return jsonify(success=False,message='Please input an Integer for landsize.'),409
            housematch = re.compile('^\d+$')
            if not re.search(housematch,house):
                return jsonify(success=False,message='Please input an Integer for housesize.'),409
            repricematch = re.compile('^\d+$')
            if not re.search(repricematch,reprice):
                return jsonify(success=False,message='Please input an Integer for reserve price.'),409
            
            # if the above check passes, add the new auction into database
            new_auction = Auction(email=email, proaddr=proaddr,numOfBed=numOfBed, numOfBath=numOfBath,protype = protype,numOfGarage=numOfGarage,starttime=starttime,endtime=endtime,reprice=reprice,pic=str(pic_unique),certification=str(certification),city=city,state=state,zipcode=zipcode,details=details,bidder='[]',observer='[]',bidprice='[]',land=land,house=house,finish=0)
            db.session.add(new_auction)
            db.session.commit()
        else:
            # if not, get a warning
            return jsonify(success=False,message='Please input all content'),400
    else:
        # if not, get a warning and redirect to profile page to complete
        return jsonify(success=False,message="Please upload profile"),400

    lastid = db.session.query(db.func.max(Auction.id)).scalar()

    # return the id of this auction to frontend and redirect to the detail page of this auction
    return jsonify(succes=True,message='post successfully',lastid=lastid),200

# ------------------------------------------------------------------------------
# Auction detail page
# In this function, we get the auction id from frontend. Get all the details in 
# database and send them to frontend. If we get finish == 1, this means the auction
# has been finished and we will change the finish status to 1 in database and send
# the email to seller and bidder.
# -------------------------------------------------------------------------------

@app.route('/auctions/<id>', methods=['GET','POST'])
def auctions(id):
    # if the request method is "post", it means the auction is finished
    # update the finish status in database and send the email
    if request.method == "POST":
        myid = int(id.replace('id=',''))
        auction = Auction.query.filter_by(id=myid).first()
        if auction.finish == 1:
            return jsonify(finish = 1),200
        else:
            auction.finish = 1
            db.session.merge(auction)
            db.session.commit()
            auction = Auction.query.filter_by(id=myid).first()
            selleremail = auction.email
            seller = User.query.filter_by(email=selleremail).first()
            sellername = seller.firstname
            sellerphone = seller.phone
            link = f'http://localhost:3000/auctions/id={myid}'
            # check whether anyone is bidding
            # if yes
            if eval(auction.bidprice) != []:
                # get the seller's reserve price and final bid price
                bidderid = eval(auction.bidprice)[-1][0]
                bidprice = eval(auction.bidprice)[-1][2]
                print(bidprice)
                reprice = auction.reprice
                # if the final bid price is larger than reserve price, the auction is successful
                # send the personal detail to seller and bidder for transactions.
                if int(bidprice) > int(reprice):
                    bidder = User.query.filter_by(id=bidderid).first()
                    bidderemail = bidder.email
                    biddername = bidder.firstname + ", "+ bidder.lastname
                    bidderphone = bidder.phone
                    msgtoseller = f'''Dear {sellername},<br />\
                        <br />\
                    The FVC5 Negotiation for {link} has ended with the highest bid ${bidprice}!<br />\
                    Congratulations on your successful sell!<br />\
                    The information of purchaser is as follows:<br />\
                    Name: {biddername}<br />\
                    Email: {bidderemail}<br />\
                    Phone: {bidderphone}<br />\
                    Now, you can contact the purchaser for subsequent transactions!<br />\
                        <br />\
                    Wish you a satisfied communication and transaction,<br />\
                    The FVC5 Negotiation Team'''
                    sendmail(selleremail,msgtoseller)
                    msgtobidder = f'''Dear {bidder.firstname},<br />\
                        <br />\
                    The FVC5 Negotiation for {link} has ended  with your last bid ${bidprice}!<br />\
                    Congratulations on your successful bid!<br />\
                    The information of property owener is as follows:<br />\
                    Name: {seller.firstname + ", " + seller.lastname}<br />\
                    Email: {selleremail}<br />\
                    Phone: {sellerphone}<br />\
                    Now, you can contact the property owner for subsequent transactions!<br />\
                        <br />\
                    Wish you a satisfied communication and transaction,<br />\
                    The FVC5 Negotiation Team'''
                    sendmail(bidderemail,msgtobidder)
                else:
                    # if the final bid price is less than reserve price, the auctio is failed
                    # send an email to seller and tell the seller the bid history and final bid price
                    msgtoseller = f'''Dear {sellername},<br />\
                        <br />\
                    The FVC5 Negotiation for {link} has failed with the highest bid ${bidprice}!<br />\
                    Looking forward to your next post.<br />\
                        <br />\
                    Best Wishes,<br />\
                    The FVC5 Negotiation Team'''
                    sendmail(selleremail,msgtoseller)
            else:
                # if no one join the bid. the highest bid price is $0
                # send the email to the seller as blow
                msgtoseller = f'''Dear {sellername},<br />\
                    <br />\
                The FVC5 Negotiation for {link} has failed with the highest bid $0 !<br />\
                Looking forward to your next post.<br />\
                    <br />\
                Best Wishes,<br />\
                The FVC5 Negotiation Team'''
                sendmail(selleremail,msgtoseller)

            # sendmail(selleremail,)
            
            return jsonify(finish = 1),200
    else:
        # if the request methos is "get", get the details of auction from database using auction id
        # send the json to the frontend
        myid = int(id.replace('id=',''))
        auction = Auction.query.filter_by(id=myid).first()
        addr = auction.proaddr
        bed = auction.numOfBed
        bath = auction.numOfBath
        protype = auction.protype
        garage = auction.numOfGarage
        starttime = auction.starttime
        endtime = auction.endtime
        pic = eval(auction.pic)
        city = auction.city
        state = auction.state
        zipcode = auction.zipcode
        bidder = len(eval(auction.bidder))
        observer = len(eval(auction.observer))
        bidprice = eval(auction.bidprice)
        details = auction.details
        land = auction.land
        house = auction.house
        mail = auction.email
        oblist = eval(auction.observer)
        bidlist = eval(auction.bidder)
        t_endtime=time.strptime(endtime,"%Y-%m-%d %H:%M:%S")
        timestamp_endtime = int((time.mktime(t_endtime)))
        if int(time.time()) > timestamp_endtime:
            auction.finish = 1
        else:
            auction.finish = 0
        db.session.merge(auction)
        db.session.commit()      
        return jsonify(succes=True,message='signin successfully',city=city,state=state,zipcode=zipcode,bidder=bidder,observer=observer,bidprice=bidprice,details=details,pic=pic,addr=addr,bed=bed,bath=bath,protype=protype,garage=garage,starttime=starttime,endtime=endtime,land = land,house=house,mail=mail,observerlist=oblist,bidlist = bidlist),200


# ------------------------------------------------------------------------------
# Homepage and search page
# In this function, we get the search details from frontend. Get all the auctions 
# of in database using filter and send them to frontend. 
# -------------------------------------------------------------------------------


@app.route('/', methods=['POST'])
def search():
    addr = request.form.get("addr")
    bed = request.form.get("bedroom")
    bath = request.form.get("bath")
    garage = request.form.get("garage")
    state = request.form.get("state")
    start = request.form.get("auctstart")
    end = request.form.get("auctend")
    emailaddr = request.form.get("emailaddr")
    search = 0
    filters = []
    # check whether all filters are used
    # if not, add the used filter into filter list
    # when one of filter has been used, change the search flag to 1 which means the user has searched something.
    if addr != "":
        filters.append(Auction.proaddr.like("%{}%".format(addr)))
        search = 1
    if start != "":
        filters.append(Auction.starttime.like("%{}%".format(start)))
        search = 1
    if end != "":
        filters.append(Auction.endtime.like("%{}%".format(end)))
        search = 1
    if bed != "":
        filters.append(Auction.numOfBed==bed)
        search = 1
    if bath != "":
        filters.append(Auction.numOfBath==bath)
        search = 1
    if garage != "":
        filters.append(Auction.numOfGarage==garage) 
        search = 1   
    if state != "":
        filters.append(Auction.state==state)
        search = 1
    user = User.query.filter_by(email=emailaddr).first()
    if user:
        searchhistory = eval(user.searchhistory)
        if search == 0:
            search = user.search

        if len(searchhistory) == 10: # only store 10 last search history for recommendation
            del(searchhistory[0])
        if addr == "" and bed == "" and bath =="" and garage == "" and state == "":
            pass
        else:
            searchhistory.append((addr,bed,bath,garage,state))
            user.searchhistory = str(searchhistory)
        user.search = search

        db.session.merge(user)
        db.session.commit()
    # do the filter in auction table and get the satisfied auctions
    auction_filter = Auction.query.filter(*filters).all()
    result = []
    # status = 0
    if len(auction_filter) == 0:
        result  = []
    else:
        for i in auction_filter:
            auc = {}
            auc["identify"] = 0
            auc_dict = i.__dict__
            if auc_dict["email"] == emailaddr:
                #  or emailaddr in eval(auc_dict["bidder"]) or emailaddr in eval(auc_dict["observer"]):
                auc["identify"] = 1
            elif emailaddr in eval(auc_dict["bidder"]):
                auc["identify"] = 3
            elif emailaddr in eval(auc_dict["observer"]):
                auc["identify"] = 2
            auc["id"] = auc_dict["id"]
            myid = auc_dict["id"]
            address = auc_dict["proaddr"]
            state = auc_dict["state"]
            zipcode = auc_dict["zipcode"]
            auc["address"] = f"{address}, {state} {zipcode}"
            auc["bedroom"] = auc_dict["numOfBed"]
            auc["bath"] = auc_dict["numOfBath"]
            auc["garage"] = auc_dict["numOfGarage"]
            auc["link"] = f"/auction/id={myid}"

            #if current time is exceeded endtime, set the acution status to finished
            endtime=time.strptime(auc_dict["endtime"],"%Y-%m-%d %H:%M:%S")
            timestamp_endtime = int((time.mktime(endtime)))
            if int(time.time()) > timestamp_endtime:
                auc_dict["finish"] = 1
            else:
                auc_dict["finish"] = 0
            
            # if the auction is not finish
            if auc_dict["finish"] == 0:
                if len(eval(auc_dict["bidprice"])) < 1:
                    auc["bid"] = 0
                else:
                    auc["bid"] = eval(auc_dict["bidprice"])[-1][2]
                auc["src"] = eval(auc_dict["pic"])[0]
                # set the status as 2 which means for sale
                auc["status"] = 2

            else:
                # if the auction is finished
                if len(eval(auc_dict["bidprice"])) < 1:
                    # if no one join the auction, the auction is failed
                    # set the status as 0 which means finish the auction but failed
                    auc["bid"] = 0
                    auc["status"] = 0
                else:
                    # if someone join the bid, compare the final bid price and reserve price
                    # if the reserve price is larger, the auction is failed. Set the status as 0 like above
                    # if the reserve price is less, the auction is successfull. Set the status as 1 which means sold
                    curbid = eval(auc_dict["bidprice"])[-1][2]
                    auc["bid"] = int(curbid)
                    if int(curbid) >= auc_dict["reprice"]:
                        auc["status"] = 1
                    else:
                        auc["status"] = 0

                auc["src"] = eval(auc_dict["pic"])[0]
            result.append(auc)
    
    # return the details of  all satisfied auctions to fronted
    return jsonify(message='Success search',addr=addr,bed=bed,bath=bath,garage=garage,a = result,start=start,end=end),200


# ------------------------------------------------------------------------------
# Recommendation function on homepage
# In this function, we only recommend three auctions to users who have search history
# -------------------------------------------------------------------------------

@app.route('/recommend/<email>', methods=['GET'])
def recommend(email):
    user = User.query.filter_by(email=email).first()
    searchhistory = eval(user.searchhistory)
    search = user.search
    result = []

    # if the user has no search history, give no recommendations
    if len(searchhistory) == 0 and search == 0:
        return jsonify(message = 'No Search History',result = []),200 
    # # If yes, he recommendations are based on the recently search history. 
    # Excluding the auctions published by the user and the ones the user has followed, 
    # if there are less than three recommended auctions given by the latest search record,
    # then continue to look for the results of the previous record until three or more recommendations are found
    for i in range(len(searchhistory)-1,-1,-1):
        history=searchhistory[i]
        filters = []
        if history[0] != "":
            filters.append(Auction.proaddr.like("%{}%".format(history[0])))
        if history[1] != "":
            filters.append(Auction.numOfBed==history[1])
        if history[2] != "":
            filters.append(Auction.numOfBath==history[2])
        if history[3] != "":
            filters.append(Auction.numOfGarage==history[3])    
        if history[4] != "":
            filters.append(Auction.state==history[4])

        filters.append(Auction.finish==0)
        auction_filter = Auction.query.filter(*filters).all()

        for j in auction_filter:
            auc = {}
            auc_dict = j.__dict__
            auc["id"] = auc_dict["id"]
            if auc_dict["email"] == email or email in eval(auc_dict["bidder"]) or email in eval(auc_dict["observer"]):
                continue
            myid = auc_dict["id"]
            address = auc_dict["proaddr"]
            state = auc_dict["state"]
            zipcode = auc_dict["zipcode"]
            auc["address"] = f"{address}, {state} {zipcode}"
            auc["bedroom"] = auc_dict["numOfBed"]
            auc["bath"] = auc_dict["numOfBath"]
            auc["garage"] = auc_dict["numOfGarage"]
            auc["link"] = f"/auction/id={myid}"
            auc["src"] = eval(auc_dict["pic"])[0]
            auc["status"] = 2
            #if current time is exceeded endtime, set the acution status to finished
            endtime=time.strptime(auc_dict["endtime"],"%Y-%m-%d %H:%M:%S")
            timestamp_endtime = int((time.mktime(endtime)))
            if int(time.time()) > timestamp_endtime:
                j.finish = 1
                db.session.merge(j)
                db.session.commit()
            else:
                if len(eval(auc_dict["bidprice"])) < 1:
                    auc["bid"] = 0
                else:
                    auc["bid"] = eval(auc_dict["bidprice"])[-1][2]
                if auc not in result:
                    result.append(auc)
        if len(result) >= 3:
            break
    # if cannot find any recommendations after searching records, or the user only used time as the search filter
    # we will recommend the lastest three auctions to the user excluding the auctions published by the user and the ones the user has followed
    if len(result) == 0 or (len(searchhistory) == 0 and search == 1):
        latest_filter = []
        latest_filter.append(Auction.finish==0)
        
        auction_latest_filter = Auction.query.filter(*latest_filter).all()
        for n in range(len(auction_latest_filter)-1,-1,-1):
            temp = auction_latest_filter[n]
            auc = {}
            auc_dict = temp.__dict__
            auc["id"] = auc_dict["id"]
            if auc_dict["email"] == email or email in eval(auc_dict["bidder"]) or email in eval(auc_dict["observer"]):
                continue
            myid = auc_dict["id"]
            address = auc_dict["proaddr"]
            state = auc_dict["state"]
            zipcode = auc_dict["zipcode"]
            auc["address"] = f"{address}, {state} {zipcode}"
            auc["bedroom"] = auc_dict["numOfBed"]
            auc["bath"] = auc_dict["numOfBath"]
            auc["garage"] = auc_dict["numOfGarage"]
            auc["link"] = f"/auction/id={myid}"
            auc["src"] = eval(auc_dict["pic"])[0]
            auc["status"] = 2
            #if current time is exceeded endtime, set the acution status to finished
            endtime=time.strptime(auc_dict["endtime"],"%Y-%m-%d %H:%M:%S")
            timestamp_endtime = int((time.mktime(endtime)))
            if int(time.time()) > timestamp_endtime:
                temp.finish = 1
                db.session.merge(temp)
                db.session.commit()
            else:
                if len(eval(auc_dict["bidprice"])) < 1:
                    auc["bid"] = 0
                else:
                    auc["bid"] = eval(auc_dict["bidprice"])[-1][2]
                if auc not in result:
                    result.append(auc)
            if len(result) >= 3:
                break
    # if we get more than 3 recommendations, we will randomly choose three of them for the user
    # Ensure that the recommendations that users see are different every time.
    if len(result) >= 3:
        return jsonify(message='Recommend',result=random.sample(result,3)),200    
    
    return jsonify(message='Recommend',result=result),200


# ------------------------------------------------------------------------------
# Seller dashboard -- current post page
# In this function, we get the user's email from frontend. Get all the auctions in 
# database which is post by the user and still for sale and send the details to 
# frontend.
# -------------------------------------------------------------------------------

@app.route('/currentpost/<email>', methods=['GET'])
def currentpost(email):
    filters = []
    filters.append(Auction.email == email)
    filters.append(Auction.finish == 0)
    auction_filter = Auction.query.filter(*filters).all()
    # get all auctions posted by this user and not finished
    result = []
    if len(auction_filter) == 0:
        result  = []
    else:
        for i in auction_filter:
            auc = {}
            auc_dict = i.__dict__
            auc["id"] = auc_dict["id"]
            myid = auc_dict["id"]
            address = auc_dict["proaddr"]
            state = auc_dict["state"]
            zipcode = auc_dict["zipcode"]
            auc["address"] = f"{address}, {state} {zipcode}"
            auc["bedroom"] = auc_dict["numOfBed"]
            auc["bath"] = auc_dict["numOfBath"]
            auc["garage"] = auc_dict["numOfGarage"]
            auc["link"] = f"/auction/id={myid}"

            endtime=time.strptime(auc_dict["endtime"],"%Y-%m-%d %H:%M:%S")
            timestamp_endtime = int((time.mktime(endtime)))
            if int(time.time()) <= timestamp_endtime:
                if len(eval(auc_dict["bidprice"])) < 1:
                    auc["bid"] = 0
                else:
                    auc["bid"] = eval(auc_dict["bidprice"])[-1][2]

                auc["src"] = eval(auc_dict["pic"])[0]
                # because the auctions here are not finished, set the status as 2
                auc["status"] = 2
                result.append(auc)
            else:
                i.finish = 1
                db.session.merge(i)
                db.session.commit()
    return jsonify(message='Success currentpost',result=result),200


# ------------------------------------------------------------------------------
# Seller dashboard -- completed post page
# In this function, we get the user's email from frontend. Get all the auctions in 
# database which is post by the user and finished and send the details to 
# frontend.
# -------------------------------------------------------------------------------

@app.route('/historypost/<email>', methods=['GET'])
def completedpost(email):
    filters = []
    filters.append(Auction.email == email)
    filters.append(Auction.finish == 1)
    # get all auctions posted by this user and finished
    auction_filter = Auction.query.filter(*filters).all()
    result = []
    if len(auction_filter) == 0:
        result  = []
    else:
        for i in auction_filter:
            auc = {}
            auc_dict = i.__dict__
            auc["id"] = auc_dict["id"]
            myid = auc_dict["id"]
            address = auc_dict["proaddr"]
            state = auc_dict["state"]
            zipcode = auc_dict["zipcode"]
            auc["address"] = f"{address}, {state} {zipcode}"
            auc["bedroom"] = auc_dict["numOfBed"]
            auc["bath"] = auc_dict["numOfBath"]
            auc["garage"] = auc_dict["numOfGarage"]
            auc["link"] = f"/auction/id={myid}"
            if len(eval(auc_dict["bidprice"])) < 1:
                # if no one join the bid, set the status as 0 means finished
                auc["status"] = 0
                auc["bid"] = 0
            else:
                curbid = eval(auc_dict["bidprice"])[-1][2]
                auc["bid"] = int(curbid)
                if int(curbid) >= auc_dict["reprice"]:
                    # if the reserve price less than final bid price, set the status as 1 meas successful
                    auc["status"] = 1
                else:
                    # if the reserve price larger than final bid price, set the status as 0 meas failed
                    auc["status"] = 0
            auc["src"] = eval(auc_dict["pic"])[0]
            result.append(auc)
    return jsonify(message='Success completed post',result=result),200


# ------------------------------------------------------------------------------
# Bidder dashboard -- current bid page
# In this function, we get the user's email from frontend. Get all the auctions in 
# database the user joined and still for sale and send the details to 
# frontend.
# -------------------------------------------------------------------------------

@app.route('/currentbid/<email>', methods=['GET'])
def currentbid(email):
    user = User.query.filter_by(email=email).first()
    userid = user.id
    bidhistory = eval(user.bidhistory)
    result = []
    idlist = [] 
    if len(bidhistory) == 0:
        result  = []
    else:
        # get the bid history from the last one to the first one
        # if a bidder joins an auction multiple times, the last
        # one will be shown
        for j in range(len(bidhistory)-1,-1,-1):
            i = bidhistory[j]
            auction = Auction.query.filter_by(id=i[0]).first()

            endtime=time.strptime(auction.endtime,"%Y-%m-%d %H:%M:%S")
            timestamp_endtime = int((time.mktime(endtime)))
            if int(time.time()) > timestamp_endtime:
                auction.finish = 1
                db.session.merge(auction)
                db.session.commit()
            else:
                if auction.finish != 1:
                    auc = {}
                    auc_dict = auction.__dict__
                    if auc_dict["id"] not in idlist:
                        auc["id"] = auc_dict["id"]
                        idlist.append(auc_dict["id"])
                        myid = auc_dict["id"]
                        address = auc_dict["proaddr"]
                        state = auc_dict["state"]
                        zipcode = auc_dict["zipcode"]
                        auc["address"] = f"{address}, {state} {zipcode}"
                        auc["bedroom"] = auc_dict["numOfBed"]
                        auc["bath"] = auc_dict["numOfBath"]
                        auc["garage"] = auc_dict["numOfGarage"]
                        auc["link"] = f"/auction/id={myid}"
                        # print(auc_dict["bidprice"])
                        if len(eval(auc_dict["bidprice"])) < 1:
                            auc["bid"] = 0
                        else:
                            auc["bid"] = eval(auc_dict["bidprice"])[-1][2]
                            bidpricelist = eval(auc_dict["bidprice"])
                            for i in range(len(bidpricelist)-1,-1,-1):
                                if int(bidpricelist[i][0]) == userid:
                                    auc["lastprice"] = bidpricelist[i][2]
                                    break
                        auc["src"] = eval(auc_dict["pic"])[0]
                        # because all the auctions here are not finished, set the status as 2 means still for sale
                        auc["status"] = 2
                        result.append(auc)
    return jsonify(message='Success currentbid',result=result),200

# ------------------------------------------------------------------------------
# Bidder dashboard -- completed bid page
# In this function, we get the user's email from frontend. Get all the auctions in 
# database the user joined and finished and send the details to frontend.
# -------------------------------------------------------------------------------

@app.route('/historybid/<email>', methods=['GET'])
def historybid(email):
    user = User.query.filter_by(email=email).first()
    userid = user.id
    bidhistory = eval(user.bidhistory)
    result = []
    idlist = []
    if len(bidhistory) == 0:
        result  = []
    else:
        # get the bid history from the last one to the first one
        # if a bidder joins an auction multiple times, the last
        # one will be shown
        for j in range(len(bidhistory)-1,-1,-1):
            i = bidhistory[j]
            auction = Auction.query.filter_by(id=i[0]).first()          
            if auction.finish == 1:
                auc = {}
                auc_dict = auction.__dict__
                if auc_dict["id"] not in idlist:
                    auc["id"] = auc_dict["id"]
                    idlist.append(auc_dict["id"])
                    myid = auc_dict["id"]
                    address = auc_dict["proaddr"]
                    state = auc_dict["state"]
                    zipcode = auc_dict["zipcode"]
                    auc["address"] = f"{address}, {state} {zipcode}"
                    auc["bedroom"] = auc_dict["numOfBed"]
                    auc["bath"] = auc_dict["numOfBath"]
                    auc["garage"] = auc_dict["numOfGarage"]
                    auc["link"] = f"/auction/id={myid}"
                    # print(auc_dict["bidprice"])
                    if len(eval(auc_dict["bidprice"])) < 1:
                        # if no one join the bid, set the status as 0 means finished
                        auc["bid"] = 0
                        auc["status"] = 0
                    else:
                        auc["bid"] = eval(auc_dict["bidprice"])[-1][2]
                        bidpricelist = eval(auc_dict["bidprice"])
                        for i in range(len(bidpricelist)-1,-1,-1):
                            if int(bidpricelist[i][0]) == userid:
                                # get the last price the user placed if the user joined multiple times
                                auc["lastprice"] = bidpricelist[i][2]
                                break
                        curbid = eval(auc_dict["bidprice"])[-1][2]
                        auc["bid"] = int(curbid)
                        if int(curbid) >= auc_dict["reprice"]:
                            # if the reserve price less than final bid price, set the status as 1 meas successful
                            auc["status"] = 1
                        else:
                            # if the reserve price larger than final bid price, set the status as 0 meas failed
                            auc["status"] = 0 
                    auc["src"] = eval(auc_dict["pic"])[0]
                    result.append(auc)
    return jsonify(message='Success completed bid',result=result),200


# ------------------------------------------------------------------------------
# Observer dashboard -- current observe page
# In this function, we get the user's email from frontend. Get all the auctions in 
# database the user observed and still for sale and send the details to 
# frontend.
# -------------------------------------------------------------------------------

@app.route('/currentobserve/<email>', methods=['GET'])
def currentobserve(email):
    user = User.query.filter_by(email=email).first()
    observehistory = eval(user.observehistory)
    result = []
    if len(observehistory) == 0:
        result  = []
    else:
        for i in observehistory:
            auction = Auction.query.filter_by(id=i).first()

            endtime=time.strptime(auction.endtime,"%Y-%m-%d %H:%M:%S")
            timestamp_endtime = int((time.mktime(endtime)))
            if int(time.time()) > timestamp_endtime:
                auction.finish = 1
                db.session.merge(auction)
                db.session.commit()
            else:
                if auction.finish != 1:
                    auc = {}
                    auc_dict = auction.__dict__
                    auc["id"] = auc_dict["id"]
                    myid = auc_dict["id"]
                    address = auc_dict["proaddr"]
                    state = auc_dict["state"]
                    zipcode = auc_dict["zipcode"]
                    auc["address"] = f"{address}, {state} {zipcode}"
                    auc["bedroom"] = auc_dict["numOfBed"]
                    auc["bath"] = auc_dict["numOfBath"]
                    auc["garage"] = auc_dict["numOfGarage"]
                    auc["link"] = f"/auction/id={myid}"
                    if len(eval(auc_dict["bidprice"])) < 1:
                        auc["bid"] = 0
                    else:
                        auc["bid"] = eval(auc_dict["bidprice"])[-1][2]
                    auc["src"] = eval(auc_dict["pic"])[0]
                    # set the status as 2 means for sale
                    auc["status"] = 2
                    result.append(auc)
    return jsonify(message='Success current observe',result=result),200

# ------------------------------------------------------------------------------
# Observer dashboard -- completed observe page
# In this function, we get the user's email from frontend. Get all the auctions in 
# database the user observed and finished and send the details to frontend.
# -------------------------------------------------------------------------------

@app.route('/historyobserve/<email>', methods=['GET'])
def historyobserve(email):
    user = User.query.filter_by(email=email).first()
    observehistory = eval(user.observehistory)
    result = []
    if len(observehistory) == 0:
        result  = []
    else:
        for i in observehistory:
            auction = Auction.query.filter_by(id=i[0]).first()
            if auction.finish == 1:
                auc = {}
                auc_dict = auction.__dict__
                auc["id"] = auc_dict["id"]
                myid = auc_dict["id"]
                address = auc_dict["proaddr"]
                state = auc_dict["state"]
                zipcode = auc_dict["zipcode"]
                auc["address"] = f"{address}, {state} {zipcode}"
                auc["bedroom"] = auc_dict["numOfBed"]
                auc["bath"] = auc_dict["numOfBath"]
                auc["garage"] = auc_dict["numOfGarage"]
                auc["link"] = f"/auction/id={myid}"
                if len(eval(auc_dict["bidprice"])) < 1:
                    # if no one join the bid, set the status as 0 means finished
                    auc["bid"] = 0
                    auc['status'] = 0
                else:
                    auc["bid"] = eval(auc_dict["bidprice"])[-1][2]
                    curbid = eval(auc_dict["bidprice"])[-1][2]
                    auc["bid"] = int(curbid)
                    if int(curbid) >= auc_dict["reprice"]:
                        # if the reserve price less than final bid price, set the status as 1 meas successful
                        auc["status"] = 1
                    else:
                         # if the reserve price larger than final bid price, set the status as 0 meas failed
                        auc["status"] = 0 
                auc["src"] = eval(auc_dict["pic"])[0]
                result.append(auc)
    return jsonify(message='Success completed observe',result=result),200

# ------------------------------------------------------------------------------
# Logout
# In this function, we use logout_user() to logout.
# -------------------------------------------------------------------------------

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify(succes=True,message='logout successfully'),200

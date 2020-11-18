# capstone-project-comp9900-w15b-fvc5
capstone-project-comp9900-w15b-fvc5 written by FVC5 team

    Anqige Wu   z5199351@ad.unsw.edu.au z5199351 Developer/Master 
    Yuchen Yang z5189310@ad.unsw.edu.au z5189310 Developer
    Rong Zhen   z5225226@ad.unsw.edu.au z5225226 Developer
    Dan Su      z5226694@ad.unsw.edu.au z5226694 Developer
    Jiaqi Sun   z5233100@ad.unsw.edu.au z5233100 Developer

## Installation Guide
The online property sales system is designed to run under Windows, Linux and MacOS system. 
The installation guide is written for the Linux environment and tested on MacOS and Windows environment.

### Environment Setup
The project is based on Python 3.7.3. If you do not have Python3, you can follow the instructions and install Python3.7.3, Pip3 from:
https://www.python.org/downloads/source/.
#### 1. Verify the python version using the following command:
    $python3 --version
Make sure the python version is higher than Python 3.6. Otherwise, the project may not be compatible.
#### 2. Upgrade your pip3 to the latest version using the following command:
    $pip3 install --upgrade pip
#### 3. Clone the project from git using the following command:
    $git clone https://github.com/unsw-cse-capstone-project/capstone-project-comp9900-w15b-fvc5
#### 4. Enter the back-end directory and install all the requirements using the following command:
    $cd capstone-project-comp9900-w15b-fvc5/onlinePropertySale/backend
    $pip3 install -r requirements.txt
#### 5. Enter the front-end directory and install npm using the following command:
    $cd capstone-project-comp9900-w15b-fvc5/onlinePropertySale/frontend
    $npm install
The project is tested on the version of npm 6.14.8 and node v12.19.0. 
### Configure and Run the Software
#### 1. After setting up the back-end and front-end environment, you can run the system using the following command:
    $cd capstone-project-comp9900-w15b-fvc5/onlinePropertySale/backend 
    $python3 app.py 
#### 2. After the back-end service is running, start the front-end service using the following command:
    $cd capstone-project-comp9900-w15b-fvc5/onlinePropertySale/frontend 
    $npm start
#### 3. After running back-end and front-end service, there might be a ‘Cross-Origin Request Blocked’ problem on your default web browser.
Therefore, you need to download an add-on called ‘Allow CORS: Access-Control-Allow-Origin’ on your web browser and turn it on. 
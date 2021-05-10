# cis-450-final
Team Members: Jeffrey Tian, Lauren Kafkaloff, Adarsh Rao, Daniel Jin

### Recs on Recs: A superb web-based database application related to songs 😎

### Setup Instructions

First, add a file `backend/.env` which contains the following contents:
```
RDS_HOSTNAME=[hostname]
RDS_USERNAME=[username]
RDS_PASSWORD=[password]
RDS_PORT=[port]
RDS_DBNAME=cis_450_db
```
Note that the database credentials (i.e., the first four fields) can all be found in our Milestone 3 submission.

Next, open a command line window with a working directory of `backend` and one with a working directory `frontend`. In both windows, run `$ npm install` to install all the required Node modules. Finally, run `$ npm start` in both windows to launch the application!

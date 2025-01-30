# nc news api!

NC news api allows users to access + update a database consisting of articles, comments, users and topics. 

This api is available at https://nc-news-ctm3.onrender.com ! Try /api to recieve information about the different endpoints + their functions.

To check it out yourself simply clone down the repo and run:
    - "npm i" - to install dependencies
    - "npm run setup-dbs" - to create the databases
    - "npm run seed" - to seed local databases
    - "npm test __tests__/app.tests.js" - to run the tests

Don't forget to create two .env files to differentiate between using test + development databases by:
    -creating .env.test + .env.development files in the root of the repo
    -declaring "PGDATABASE=nc_news" + "PGDATABASE=nc_news_test" in the corresponding files!

Tested/Made using node.js v20.16.0 and PostgreSQL 16.6



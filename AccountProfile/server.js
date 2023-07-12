const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an instance of Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configuration for MSSQL connection
const config = {
  user: 'sa',
  password: '1',
  server: 'localhost',
  database: 'SWP391',
  options: {
    encrypt: false,
  },
};

// Connect to the database
sql.connect(config, (err) => {
    if (err) {
      console.log('Database connection failed!');
      console.log(err);
    } else {
      console.log('Database connected successfully!');
    }
  });

// API endpoints

//Fetch data
app.get('/api/profile/:userID', (req, res) => {
    const { userID } = req.params;
    const query = `SELECT 
	[UserName], 
	[FirstName], 
	[LastName], 
	[Email], 
	[PhoneNumber],
	[Country],
	[City],
	[Address],
	[DoB],
	[PostCode],
	[Balance],
	[Avatar],
	[Password],
	[Role],
	[BankNumber],
	[BankName],
	[isDisable] FROM [User] WHERE [UserID] = ${userID}`;
    sql.query(query, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'Failed to fetch information' });
        } else {
          res.json(result.recordset);
        }
      });
})

app.listen(3001)
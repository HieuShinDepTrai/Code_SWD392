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
app.get('/api/admindashboard', async (req, res) => {
    try {
        const query1 = `SELECT 
                            [C].[CourseName],
                            [C].[DateCreate],
                            [C].[Category],
                            [C].[CourseImage],
                            [C].[Status],
                            [C].[NumberEnrolled],
                            [C].[CourseID],
                            [C].[CoursePrice],
                            [C].[Description],
                            [C].[Objectives],
                            [C].[Difficulty],
                            [C].[AuthorID]
                        FROM [Course] C INNER JOIN [User] U
                        ON [C].[AuthorID] = [U].[UserID] WHERE [C].[Status] = 'Enabled'`;
        const query2 = `select count(UserID) as Size from [User]
                        where [Role]='User'`;
        const query3 = `select count(RechargeID) as WithdrawCount from [Recharge] re inner join [User] u on [re].UserID = [u].UserID
                        where Method = 'Withdraw' and Status = 2 `;
        const query1Result = await sql.query(query1);
        const query2Result = await sql.query(query2);
        const query3Result = await sql.query(query3);
        res.json({
            result1: query1Result.recordset.length,
            result2: query2Result.recordset,
            result3: query3Result.recordset
        })
    } 
    catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3001)
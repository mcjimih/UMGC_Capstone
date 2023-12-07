/*
Author: Matthew Hendrix
Purpose: Code in Lambda to read data
Original filename in lambda is index.js. I changed it for this one as PushData_Test.js is also index.js in it's own function.
*/

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });

exports.handler = async (event, context) => {
  try {
    const data = await readMessage();
    data.Items.forEach(item => {
      console.log(item.message);
    });
    return {
      statusCode: 200,
      body: data.Items,
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

function readMessage() {
  const params = {
    TableName: 'Weather_Alerts_Contact_Info',
    Limit: 10,
  };
  return ddb.scan(params).promise();
}

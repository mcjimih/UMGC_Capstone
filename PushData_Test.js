/*
Author: Matthew Hendrix
Purpose: Code in Lambda to write data
Original filename in lambda is index.js. I changed it for this one as ReadData_Test.js is also index.js in it's own function.
*/

const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });

exports.handler = async (event, context) => {
  try {
    // Check if event is defined
    if (!event) {
      throw new Error('Invalid request: No event provided');
    }

    // Use the event directly as the input data
    const inputDataParams = {
      TableName: 'Weather_Alerts_Contact_Info',
      Item: {
        'email': event.email,
        'area_code': event.area_code,
        'message': event.message,
      },
    };

    await inputData(inputDataParams);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Data successfully added' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

async function inputData(params) {
  return ddb.put(params).promise();
}

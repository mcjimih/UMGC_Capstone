//---------------------------------------------------------------------//
//Testing for AWS DynamoDB Table Access//
//---------------------------------------------------------------------//
AWS.config.update({
  region: 'us-east-2',
  accessKeyId: 'access key ID',
  secretAccessKey: 'super secret password',
});
var dynamoDB = new AWS.DynamoDB();
var tableName = 'Weather_Alerts_Contact_Info';

var params = {
  TableName: tableName,
  Item: {
    'email': { S: 'test@fakeemail.com' },
    'area_code': { N: '12345' }
  }
};
    
dynamoDB.putItem(params, function(err, data) {
  if (err) {
    console.error('Error inserting item:', err);
  } else {
    console.log('Item inserted successfully:', data);
  }
});


/* Testing for Static Website access */
const http = require('http');

const options = {
  hostname: 'up4ch9eh3c.execute-api.us-east-2.amazonaws.com',
  path: '/Testing_Stage/test-to-pull-data',
  method: 'GET'
};

const button = document.querySelector('testDataGET');
button.addEventListener('click', () => {
  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', d => {
      process.stdout.write(d);
    });
  });

  req.on('error', error => {
    console.error(error);
  });

  req.end();
});

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

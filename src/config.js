export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    REGION: "us-east-2",
    BUCKET: "fovies-uploads"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://yr3z50py19.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_tqlCrpFLQ",
    APP_CLIENT_ID: "1nmot8je4hqh859ulrunqdijni",
    IDENTITY_POOL_ID: "us-east-2:802b6e85-8d62-4244-92e6-db4b7c23f9cb"
  }
};
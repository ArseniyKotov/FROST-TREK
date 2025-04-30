import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';

// Inline Amplify configuration
const output = {
  "api": {
    "GraphQLAPIEndpointOutput": "https://example-endpoint.appsync-api.us-west-2.amazonaws.com/graphql",
    "GraphQLAPIIdOutput": "abcdefghijklmnopqrstuvwxyz",
    "GraphQLAPIKeyOutput": "da2-abcdefghijklmnopqrstuvwxyz"
  },
  "auth": {
    "IdentityPoolId": "us-west-2:abcdef-1234-5678-9012-abcdefghijkl",
    "IdentityPoolName": "firewatch_identity_pool",
    "UserPoolId": "us-west-2_abcdefghi",
    "UserPoolArn": "arn:aws:cognito-idp:us-west-2:123456789012:userpool/us-west-2_abcdefghi",
    "UserPoolName": "firewatch_user_pool",
    "AppClientId": "abcdefghijklmnopqrstuvwxyz",
    "AppClientIDWeb": "abcdefghijklmnopqrstuvwxyz"
  }
};


Amplify.configure(output);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

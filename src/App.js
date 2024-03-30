import React, { useState } from 'react';

function App() {

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAddSlackUser = () => {

    setIsAuthenticating(true);

    // Replace these values with your actual Slack app credentials

    const clientId = '6869033625238.6888747023204';

    const scope = 'chat:write,users:read';

    const slackAuthUrl = https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scope}&user_scope=${scope};

    // Open the Slack authentication URL in a new window

    const authWindow = window.open(slackAuthUrl, '_blank', 'width=800,height=600');

    // Listen for the authentication completion event

    const handleAuthCompletion = (event) => {

      if (event.origin === window.location.origin) {

        // Handle the authentication response from Slack

        const data = event.data;

        if (data && data.type === 'slack-auth-success') {

          // Authentication successful, handle the response data

          const { code } = data.payload;

          exchangeCodeForToken(code);

        } else if (data && data.type === 'slack-auth-error') {

          // Authentication failed, handle the error

          console.error('Slack authentication error:', data.payload);

        }

      }

    };

    // Listen for the authentication completion message

    window.addEventListener('message', handleAuthCompletion);

    // Clean up the event listener when the authentication window is closed

    authWindow.addEventListener('beforeunload', () => {

      window.removeEventListener('message', handleAuthCompletion);

      setIsAuthenticating(false);

    });

  };

  const exchangeCodeForToken = async (code) => {

    try {

      // Replace these values with your actual Slack app credentials

      const clientId = '6869033625238.6888747023204';

      const clientSecret = '5fb7a7581363c2484f1dd5d702175697';

      const response = await fetch('https://slack.com/api/oauth.v2.access', {

        method: 'POST',

        headers: {

          'Content-Type': 'application/x-www-form-urlencoded',

        },

        body: new URLSearchParams({

          client_id: clientId,

          client_secret: clientSecret,

          code,

        }),

      });

      const data = await response.json();

      if (data.ok) {

        // Handle the access token and user information

        const { access_token, authed_user } = data;

        console.log('Access Token:', access_token);

        console.log('Authenticated User:', authed_user);

        // You can store the access token and user information in your application's state or database

      } else {

        console.error('Failed to exchange code for token:', data.error);

      }

    } catch (error) {

      console.error('Error exchanging code for token:', error);

    } finally {

      setIsAuthenticating(false);

    }

  };

  return (

    <div>

      <button onClick={handleAddSlackUser} disabled={isAuthenticating}>

        {isAuthenticating ? 'Authenticating...' : 'Add Slack User'}

      </button>

    </div>

  );

}

export default App;

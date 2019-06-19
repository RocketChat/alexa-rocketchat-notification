<p align="center">
  <img  src="https://user-images.githubusercontent.com/41849970/57236777-691ae200-7043-11e9-8d8e-67e05e60a8e4.png">
</p>

<h3 align="center">
  Innovating Incredible New User Experiences In The Alexa Ecosystem
</h3>

---

# Let's Get Started with Notifications

**Note:** The rest of this readme assumes you have your developer environment ready to go and that you have some familiarity with CLI (Command Line Interface) Tools, [AWS](https://aws.amazon.com/), and the [ASK Developer Portal](https://developer.amazon.com/alexa-skills-kit).

### Repository Contents
* `index.js` - Microservice Logic for sending notifications to the  hosted on [Rocket Chat Alexa Skill](https://github.com/RocketChat/alexa-rocketchat)

## Setup w/ ASK CLI

### Pre-requisites

* Node.js (> v8.10)
* Register for an [AWS Account](https://aws.amazon.com/)
* Register for an [Amazon Developer Account](https://developer.amazon.com/)
* Install and Setup [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html)
* Rocket Chat Server updated to [Release 1.0.0-rc3](https://github.com/RocketChat/Rocket.Chat/releases/tag/1.0.0-rc.3) or later
* Setup a [Rocket Chat Alexa Skill](https://github.com/RocketChat/alexa-rocketchat)


### Installation
1. Clone the repository.

	```bash
	$ git clone https://github.com/RocketChat/alexa-rocketchat-notification.git
	```

2. Navigating into the repository's root folder.

	```bash
	$ cd alexa-rocketchat-notification
	```

3. Install npm dependencies by running the npm command: `npm install`

	```bash
	$ npm install
	```
	
### Deployment

ASK CLI will create the skill and the lambda function for you. The Lambda function will be created in ```us-east-1 (Northern Virginia)``` by default.

1. Log into your AWS Account and create a new Lambda function. Make sure to choose Runtime as `Node.js 10.x`. In the permissions create a new role, and then go to the IAM console and add policies to access DynamoDB and Cloudwatch. 
	
2. Once the function is created, increase the Timeout of the function to 15 minutes in the basic settings down below. Also set a few Environment variables values. 
	
	e.g: 
	1. **SERVER_URL**    https://yourservername.rocket.chat
	2. **DDB_NAME**    (The name of the Dynamo DB table being used by your skill)
	3. **CLIENT_ID**    (The client ID from your Alexa Developer Console in the Permissions Section of the skill)
	4. **CLIENT_SECRET**    (The client secret from your Alexa Developer Console in the Permissions Section of the skill)
	5. **API_REGION**    (For North/South America use US, For Europe/India use EU, For Japan use FE) 
	
### Configuring Cloudwatch Rules to Run the Microservice

1. Log into your AWS Account and go to cloudwatch.

2. Click on Rules -> Create Rule. Give it a fixed rate of 7 minutes. Every 7 minutes it will run the lambda function to check for new messages. We can run it every minute but the minimum expiry time for an Alexa Notification is 5 minutes. So we will check for notification every 7 minutes.

3. Click on Add Target. Choose the Lambda function you created above. Click on configure details and give it a name. Click create rule.
	
### Making Changes to the main skill to add notifications

1. The above setup is an external microservice which takes care of sending notifications. But we still need to add the ability for user to sign up for notifications. Please follow the notification steps given in the main repo for adding it to the skill.

2. Also it will be worth checking out this video to get insights

3. Click on Add Target. Choose the Lambda function you created above. Click on configure details and give it a name. Click create rule.
	
### Testing

1. Before testing, you must make sure that Account Linking with the main skill has completed.   Go to alexa.amazon.com or your alexa app and click **account linking** to complete the link. And also ensure that you have given the permission to receive notifications.

2. To test, you just need to receive a message, and you'll soon receive a notification on your Alexa Device. Your Alexa Device will light up in green color with a chime sound. You can say "Alexa, what are my notifications." to hear them.
	
## Customization

1. ```./index.js```

   You can change the notification expiry time, or pre-configured output text.

   See the [Proactive Events API Documentation](https://developer.amazon.com/docs/smapi/schemas-for-proactive-events.html#message-alert) for more information.


## Documentation To Refer

1. ```Rocket.Chat API Documentation```
        
    The REST API allows you to control and extend Rocket.Chat with ease - [REST API Documentation]( https://rocket.chat/docs/developer-guides/rest-api/ )

2. ```Axios Documentation```

    Promise based HTTP client for the browser and node.js - [Github Page](https://github.com/axios/axios )

3. ```Proactive Events API Documentation```

    You can use the Proactive Events API to send events to Alexa. The events represent factual data that might interest a customer. Upon receiving an event, Alexa proactively delivers the information to customers subscribed to receive these events. This API currently supports one proactive channel, Alexa Notifications - [Documentation Page](https://developer.amazon.com/docs/smapi/proactive-events-api.html)
    
4. ```Dabble Lab Video on Proactive Events```

    This video explains the proactive events API and setup instructions with example - [Alexa Notifications with Proactive Events - Dabble Lab #125](https://www.youtube.com/watch?v=oMcHTMZDTVQ)    

4. ```ASK Utils Proactive Events```

    This NPM package helps send proactive events in a much simpler way - [ASK Utils Proactive Events](https://github.com/ask-utils/proactive-event)
    

## Contact Us

Keep an eye on our issues. We are just beginning and will surely appreciate all the help we can get. All ideas are welcome.
Feel free to join the discussion in our Alexa channel - [Rocket.Chat Alexa Channel](https://open.rocket.chat/channel/alexa)

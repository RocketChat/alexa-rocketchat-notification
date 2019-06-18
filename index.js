const proactive = require('@ask-utils/proactive-event');
const moment = require("moment");
const axios = require('axios');
const AWS = require('aws-sdk');

const paramsDDB = {
    TableName: process.env.DDB_NAME,
    Limit: 5000
};
const docClient = new AWS.DynamoDB.DocumentClient();

const Client = proactive.Client;
const MessageAlert = proactive.MessageAlert;

const client = new Client({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    apiRegion: process.env.API_REGION
})

const PayloadBuilder = MessageAlert.Activated.PayloadFactory.init()

let getSubscriptionEndpoint = `${process.env.SERVER_URL}/api/v1/subscriptions.get?updatedSince=`;

async function sendNotifications() {

    let userList = await getUsers();
    for (let i = 0; i < userList.length; i++) {
        try {
            if (userList[i].attributes.hasOwnProperty("personalAccessToken")) {
                let headers = {
                    'X-Auth-Token': userList[i].attributes.personalAccessToken,
                    'X-User-Id': userList[i].attributes.profileId
                };

                let userId = userList[i].id;

                let total = await getSubscriptionCount(headers);

                if (userList[i].attributes.notificationsSettings == 'userMentions' && total.userMentions > 0) {
                    PayloadBuilder.setMessageCreator(`All Channels, Groups and DMs and ${total.userMentions} user mentions`)
                        .setMessageCount(total.unreads)
                        .setMessageStatus('UNREAD')
                        .getParameter()

                    client.setEvent(PayloadBuilder.getParameter())
                        .setReferenceId(userId.slice(-40))
                        .setExpiryTime(moment().add(1, 'hour').toISOString())
                        .setRelevantAudience('Unicast', { "user": userId })
                        .requestEvent()
                        .then(result => console.log(result))
                        .catch(result => console.log(result))
                }
                else if (userList[i].attributes.notificationsSettings == 'unreads' && total.unreads > 0) {
                    PayloadBuilder.setMessageCreator(`All Channels, Groups and DMs ${total.userMentions == 0 ? `` : ` and ${total.userMentions} user mentions `} `)
                        .setMessageCount(total.unreads)
                        .setMessageStatus('UNREAD')
                        .getParameter()

                    client.setEvent(PayloadBuilder.getParameter())
                        .setReferenceId(userId.slice(-40))
                        .setExpiryTime(moment().add(1, 'hour').toISOString())
                        .setRelevantAudience('Unicast', { "user": userId })
                        .requestEvent()
                        .then(result => console.log(result))
                        .catch(result => console.log(result))
                }
                else {
                    console.log("No new notification right now!")
                }
            }
        } catch (error) {
            console.error(error);
        }

    }
}

async function getSubscriptionCount(headers) {
    let updatedSince = moment().subtract(6, 'minutes').toISOString();

    return await axios.get(`${getSubscriptionEndpoint}${updatedSince}`,
        { params: {}, headers: headers })
        .then(res => res.data)
        .then(res => {
            if (res.update.length > 0) {
                let total = { unreads: 0, userMentions: 0 }
                for (let i = 0; i < res.update.length; i++) {
                    total.unreads += res.update[i].unread;
                    total.userMentions += res.update[i].userMentions;
                }
                return total;
            }
            else{
                return { unreads: 0, userMentions: 0 }
            }
        })
        .catch(err => {
            return { unreads: 0, userMentions: 0 };
        });
}

async function getUsers() {
    return docClient.scan(paramsDDB).promise().then((data) => {
        return data.Items;
    })
        .catch(err => console.log(err));
}

module.exports.handler = (event, context, callback) => {
    sendNotifications();
    callback(null);
};

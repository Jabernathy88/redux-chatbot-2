'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Text, Card, Image, Suggestion, Payload} = require('dialogflow-fulfillment');
const nodemailer = require('nodemailer')

process.env.DEBUG = 'dialogflow:debug'; 

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  const userInfoCollected = {
    names: [],
    phoneNumbers: [],
    emails: [],
    deviceInfo: [],
    budgetInfo: [],
    timelineInfo: []
  }
  
  function emailUserInfo() {
    const emailMessage = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>
        <li><strong>Contact Info</strong></li>
        <li>Name: ${userInfoCollected.names.toString(" ")}</li>
        <li>Phone: ${userInfoCollected.phoneNumbers.toString(", ")}</li>
        <li>Email: ${userInfoCollected.emails.toString(", ")}</li>
      </ul>

      <ul>
        <li><strong>Project Details</strong></li>
        <li>deviceInfo: ${userInfoCollected.deviceInfo.toString(", ")}</li>
        <li>budgetInfo: ${userInfoCollected.budgetInfo.toString(", ")}</li>
        <li>timelineInfo: ${userInfoCollected.timelineInfo.toString(", ")}</li>
      </ul>`;

    // reusable transporter using SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'jeremy.helium.test@gmail.com', 
        pass: '#helium99' 
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: 'Katie',
      to: 'jeremy@heliumservices.com',
      subject: 'Chatbot recently spoke with a potential client',
      text: 'Chatbot recently spoke with a potential client.',
      html: emailMessage
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg: 'Email has been sent!'})
    });
  }

  function welcome(agent) {
    const responseArray = [`Hiya. My name is Katie. What can Helium build for you today?`, `Welcome! Katie here. What can Helium build for you today?`, `Greetings! Katie here. What can Helium build for you today?`]
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    agent.add(randomResponse);
  }

  function clientSharesDevicePlatformInfo(agent) {
    const deviceInfo = agent.parameters["device_platform.original"];
    userInfoCollected.deviceInfo.push(deviceInfo);
    const responseArray = [
      `Okay, I made a note about your technical needs. Do you have a budget in mind?`, 
      `Fantastic. I made a note about your technical needs. Do you have a budget in mind?`, 
      `Great! I made a note about your technical needs. Do you have a budget in mind?`
    ];
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    agent.add(randomResponse);
  }

  function clientSharesBudgetInfo(agent) {
    const budgetInfo = agent.parameters["unit-currency.original"];
    userInfoCollected.budgetInfo.push(budgetInfo);
    const responseArray = [
      `Awesome. I made a note about your budget estimate. Do you have a timeline in mind?`,
      `Great. I made a note about your budget estimate. Do you have a timeline in mind?`,
      `Understood! I made a note about your budget estimate. Do you have a timeline in mind?`
    ];
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    const savedDeviceInfo = userInfoCollected.deviceInfo
    if (agent.parameters.length >= 1) {
      agent.add(`HAVE DEVICE AND BUDGET`)
    } else {
      agent.add(randomResponse);
    }    
  }

  function clientSharesTimelineInfo(agent) {
    const timelineInfo = agent.parameters["duration.original"];
    userInfoCollected.timelineInfo.push(timelineInfo)
    const responseArray = [
      `Good to know. I made a note about your timeline. Are there technical needs or functions that interest you?`,
      `Alrighty. I made a note about your budget estimate. Are there technical needs or functions that interest you?`,
      `Roger that. I made a note about your timeline. Are there technical needs or functions that interest you?`
    ];
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    const savedBudgetInfo = userInfoCollected.deviceInfo

    // not quite working
    if (savedBudgetInfo.length >= 1) {
      agent.add(`HAVE BUDGET AND TIMELINE`)
    } else {
      agent.add(randomResponse);
    }
  }

  function fallback(agent) {
    const responseArray = [
      `Sorry I didn't understand. Could you restate that maybe?`, 
      `Do you mind elaborating a little more?`
    ];
    const randomResponse = responseArray[Math.floor(Math.random() * responseArray.length)];
    agent.add(randomResponse);
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Client Shares Device Platform Info', clientSharesDevicePlatformInfo);
  intentMap.set('Client Shares Budget Info', clientSharesBudgetInfo);
  intentMap.set('Client Shares Timeline Info', clientSharesTimelineInfo);
  intentMap.set('Default Fallback Intent', fallback);
  agent.handleRequest(intentMap);
});
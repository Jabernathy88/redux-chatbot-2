// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs for
// Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const {dialogflow} = require('actions-on-google')
const nodemailer = require('nodemailer')

process.env.DEBUG = 'dialogflow:debug';

exports.dialogflowFirebaseFulfillment = functions
  .https
  .onRequest((request, response) => {
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    const agent = new WebhookClient({request, response});

    function emailClientInfoHandler(agent) {
      const welcomeAnswersArray = [`Nice to meet you ${agent.parameters["given-name"]}! I go by Katie. Now tell me about this amazing idea we can build together.`, `Hey there ${agent.parameters["given-name"]}! I'm Katie at Helium LLC. What are you thinking to build?`, `Hi ${agent.parameters["given-name"]}! My name is Katie. What do you want to build?`];
      const randomAnswer = welcomeAnswersArray[Math.floor(Math.random() * welcomeAnswersArray.length)];
      agent.add(randomAnswer);

      function formatPhoneNumber(s) {
        var s2 = ("" + s).replace(/\D/g, '');
        var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        return (!m)
          ? null
          : "(" + m[1] + ") " + m[2] + "-" + m[3];
      }
      const originalPhoneNumber = agent.parameters["phone-number"]
      const formattedPhoneNumber = formatPhoneNumber(originalPhoneNumber);

      const fullName = agent.parameters["given-name"] + " " + agent.parameters["last-name"]

      const output = `
    <p>Somebody just started talking to Katie the chatbot!</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${fullName}</li>
      <li>Email: ${agent.parameters.email}</li>
      <li>Phone: ${formattedPhoneNumber}</li>
    </ul>
    `;

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', port: 465, secure: true, // true for 465, false for other ports
        auth: {
          user: 'jeremy.helium.test@gmail.com', // generated ethereal user
          pass: '#helium99' // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: 'NODE MAILER', // sender address
        to: 'josh@heliumservices.com', // list of receivers
        subject: `Chatbot - ${fullName} - ${formattedPhoneNumber}`, // Subject line
        text: 'Sent from nodemailer plain text!', // plain text body
        html: output // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Opening email sent: %s', info.messageId);

        response.render('contact', {msg: 'Email has been sent!'})
      });
    }

    function emailAppInfoHandler(agent) {

      // const closingAnswersArray = [`Thank you for all of those details,
      // ${agent.parameters["given-name"]}.`` I'm going to send this idea on to one of
      // our co-founders, Joe.`` You can reach out to him first at (678) 882-5333`];
      // const randomCloser = closingAnswersArray[Math.floor(Math.random() *
      // closingAnswersArray.length)]; agent.add(`Thank you for all of those details,
      // ${agent.parameters["given-name"]}. I'm going to send this idea on to one of
      // our co-founders, Joe. You can reach out to him first at (678) 882-5333`);

      function formatPhoneNumber(s) {
        var s2 = ("" + s).replace(/\D/g, '');
        var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        return (!m)
          ? null
          : "(" + m[1] + ") " + m[2] + "-" + m[3];
      }
      const originalPhoneNumber = agent.parameters["phone-number"]
      const formattedPhoneNumber = formatPhoneNumber(originalPhoneNumber);

      const fullName = agent.parameters["given-name"] + " " + agent.parameters["last-name"]

      const output = `
    <p>Somebody just finished talking to Katie the chatbot!</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${fullName}</li>
      <li>Email: ${agent.parameters.email}</li>
      <li>Phone: ${formattedPhoneNumber}</li>
    </ul>
    
    <h3>App details I got from the conversation</h3>
    <ul>
      <li>Type of App: ${agent.parameters["device_platform"]}</li>
      <li>Timeline: ${agent.parameters.duration}</li>
      <li>Budget: ${agent.parameters["unit_currency"]}</li>
    </ul>
    
    <h3>Full Contents of Agent Parameters</h3>
    ${JSON.stringify(agent.parameters)}
    
    Best of luck,
    Katie
    `;

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
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
        from: 'NODE MAILER',
        to: 'josh@heliumservices.com',
        subject: `Chatbot - ${fullName} - ${formattedPhoneNumber}`,
        text: 'Sent from nodemailer plain text!',
        html: output
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Closing email sent: %s', info.messageId);

        response.render('contact', {msg: 'Email has been sent!'})
      });

      agent.add("Response from fulfillment.")
    }

    let intentMap = new Map();
    intentMap.set('sendEmailWithClientInfo', emailClientInfoHandler);
    intentMap.set('0 - Start of Conversation', emailClientInfoHandler);

    intentMap.set('sendEmailWithAppInfo', emailAppInfoHandler);
    intentMap.set('1.1 - OEQ - DP, TL, $ - Yes', emailAppInfoHandler);
    intentMap.set('1.1 - OEQ - DP, $, TL - Yes', emailAppInfoHandler);

    agent.handleRequest(intentMap);
  });

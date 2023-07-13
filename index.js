'use strict';

 const functions = require('firebase-functions');
 const {google} = require('googleapis');
 const {WebhookClient} = require('dialogflow-fulfillment');
 
 // Enter your calendar ID below and service account JSON below
 const calendarId = "7f0c09eabaaba132d26984c7c0473b018c65e0543dc2bb335311bfa6c09dfc81@group.calendar.google.com";
 const serviceAccount = { "type": "service_account",
  "project_id": "chatbot-o9sk",
  "private_key_id": "a8c89db896a206e3b801185f6d876d20091d5060",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCe05sxzCLz62OR\nFk2p3Rw+E/9i2Fx7M3OGPmwwFePE6LvtNamdA4Cld23Pfk9RHRZuFtP2YTIXB1r4\nHYU7wl8lJ+M7k8TN7iY5w+XBvuhwo1JH4p69ihz8EJ6i426Hr7FQCKaoRqWCEp4M\ncCfhZ7U3z0rvkCve07pEwT8WNasgR9cgz6vs5w0AnPsGqYIOBjPTAiNGr9jQQpIH\nhFfdgFkUt67JI+7i7W4N8YFSkAcXVRmqzplj/b8oqsML/3CGM0YvkZ6oucLNNW9c\n4eqJAnhBzx5XjF1+useI13GG/rtYw6qniwK9giup5POlQOhJ348lj5NQ5xz+O6tK\nfv5CjEyBAgMBAAECggEAALqR9JHRupKw/ja30bw4Dsprs0132ytP4av7Gambm1cz\nm1U1iaVn22/ZWxbiyUmNmqDwhUYtrdQmiKe0PqNX2zODRAcbuOkSdCouO6iGp/b+\nHEX/4Xjhtpxi6YTD+ln3wZk0HpFxTxcZHOTxTJJRFkgVZBwiTZ9lND86iWENjc0x\nLoH82FPZOgQ5spTi+RvvQ5223GGjU+S/mY0MWHqH51EJQt1kxSuN4U1RMwULgYlh\nOYNII9x9AYRF7XE18WZKw8q18l7rHpufzgp8D60RnTL8dmagxmfVqm3ouk3d14hH\n2tiwftLN+HGtUhlULYt3SKRfzX7uneA6Ua/0kYqKuQKBgQDRTLqHu+Pyq6okY0cr\n2OPaMBvn7sSvSCnsyj+Q2FJAkoHDa0JUUvs9kO63k4nH9EKz9HONl0+g2853mEd3\nOu1JnxrH9+YBl2BK2cQGT5nnKQcTbWKFUo+8oFi9vPcGlmAIClfJjgxGKubxzw+s\nAm+VaYKwPfXxmHdWARN8mb+KpQKBgQDCQ9XAXsT112zQv7xiabVmLFpPUH6WX+EU\nyVIbjujQ/SFsIwLIkmm0avdLbA2CCQQIuuPs476ka6XD9jnMOVaWq31Z6IMIaXVy\njDwGbC+FL+rOwkPlMmmBAw64JddXoToEr/AbSO7P9HxW3z1wIDQC6YG/wwFXu7CW\nb1orHXk/rQKBgQCkZ2fx7MXuPafFM3KZX6IDJl0VPzmiEcZU6L0rsrBRZoOllCAj\nCpetUaYh7zOALD8lCfSmmN+ElIRG7wfcAR6ZAPBReUljoJuT0CCpcGeM625SdU65\nORQM78slJ0THGOHQDwfMG9dKWrLT6Hj//V3W+G0esVz6bG/4z5mV+1M4vQKBgQCK\nYL2zAQ61u9U0QU/Unk3r0O4nj0QMo5F2OA23ua2XqKgVGj9SVhDbxlIPNJHOrdNk\n0JOo23WiM1fp5cu38KQAQXnSAHDOHijeBox/WrLi4YYV74VjjuxeTKpAfBwPvLXS\nPuz+0o3iLdogG3btFtNVu7WDvkmHkBeyoPEOwzjqJQKBgHONCTzENeVwkwCaFrwl\n4EQKvSNifCxzkwhjwGNHbXFHqi/esx5FQnOqZazHq5fJbj4wAcdE/qBHNcQu9GYi\n0E1b5r8xKAQP2QDgsmh4u+Ms1mvfWBSaLcA4PfRVUPGNCPBHx9ApvcaGSfnzCafi\nrSS4G7YZMC7y1XqfycIT96fc\n-----END PRIVATE KEY-----\n",
  "client_email": "schedule-appointment@chatbot-o9sk.iam.gserviceaccount.com",
  "client_id": "117939788883209472918",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/schedule-appointment%40chatbot-o9sk.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"}; // Starts with {"type": "service_account",...
 
 // Set up Google Calendar Service account credentials
 const serviceAccountAuth = new google.auth.JWT({
   email: serviceAccount.client_email,
   key: serviceAccount.private_key,
   scopes: 'https://www.googleapis.com/auth/calendar'
 });
 
 const calendar = google.calendar('v3');
 process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements
 
 
 const timeZone = 'GMT'; 
 const timeZoneOffset = '05:30';
 
 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
   const agent = new WebhookClient({ request, response });
   console.log("Parameters", agent.parameters);
   const appointment_type = agent.parameters.AppointmentType
   function makeAppointment (agent) {
     // Calculate appointment start and end datetimes (end = +1hr from start)
     //console.log("Parameters", agent.parameters.date);
     // Calculate appointment start and end datetimes (end = +1hr from start)
	const dateTimeStart = new Date(new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('+')[0])));
	const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
	const appointmentTimeString = dateTimeStart.toLocaleString(
       'en-US',
       { month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
     );
 
     // Check the availibility of the time, and make an appointment if there is time on the calendar
     return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
       agent.add(`Ok, let me see if we can fit you in. ${appointmentTimeString} is fine!.`);
     }).catch(() => {
       agent.add(`I'm sorry, there are no slots available for ${appointmentTimeString}.`);
     });
   }
 
   let intentMap = new Map();
   intentMap.set('schedule appointment', makeAppointment);
   agent.handleRequest(intentMap);
 });
 
 
 
 function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
   return new Promise((resolve, reject) => {
     calendar.events.list({
       auth: serviceAccountAuth, // List events for time period
       calendarId: calendarId,
       timeMin: dateTimeStart.toISOString(),
       timeMax: dateTimeEnd.toISOString()
     }, (err, calendarResponse) => {
       // Check if there is a event already on the Calendar
       if (err || calendarResponse.data.items.length > 0) {
         reject(err || new Error('Requested time conflicts with another appointment'));
       } else {
         // Create event for the requested time period
         calendar.events.insert({ auth: serviceAccountAuth,
           calendarId: calendarId,
           resource: {summary: appointment_type +' Appointment', description: appointment_type,
             start: {dateTime: dateTimeStart},
             end: {dateTime: dateTimeEnd}}
         }, (err, event) => {
           err ? reject(err) : resolve(event);
         }
         );
       }
     });
   });
 }
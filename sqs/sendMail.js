"use strict";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  ""
);

module.exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.Records[0].body);

  if (!body.Type || !body.Subject || !body.Message || !body.Timestamp) {
    console.info("SQS Send Message Error");
    return callback("Messsage Error");
  } else if (
    body.MessageAttributes.queue.Value === "ALL" ||
    body.MessageAttributes.queue.Value === "mail"
  ) {
    const msg = {
      to: body.MessageAttributes.userMail.Value,
      from: "", // Use the email address or domain you verified above
      subject: body.Subject,
      text: body.Message,
      html: body.Message,
    };

    sgMail.send(msg).then(
      () => {},
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
  }
};

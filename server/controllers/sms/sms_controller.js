require("dotenv").config;
const twilio = require("twilio");
const MessagingResponse = twilio.twiml.MessagingResponse;

const AssistantV2 = require("watson-developer-cloud/assistant/v2");
const assistant = new AssistantV2({
  version: "2019-02-15",
  iam_apikey: "hHxYf-dpr_HTgMSlzPL3SuaxOxaWxuFEsg1j8ySz_xFY",
  url: "https://gateway.watsonplatform.net/assistant/api"
});

let sessionId = function(req) {
  return new Promise(async (resolve, reject) => {
    if (req.session.local) {
      return resolve(req.session.local);
    }

    assistant.createSession(
      {
        assistant_id: "eecb602e-d2c0-45f7-999e-b965e1e11404"
      },
      function(err, response) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          req.session.local = response.session_id;
          resolve(response.session_id);
        }
      }
    );
  });
};

module.exports = {
  understand: async (req, resp) => {
    const command = req.body.Body.toLowerCase();
    const twiml = new MessagingResponse();
    assistant.message(
      {
        assistant_id: "eecb602e-d2c0-45f7-999e-b965e1e11404",
        session_id: await sessionId(req),
        input: {
          message_type: "text",
          text: command
        }
      },
      function(err, response) {
        if (err) {
          console.log("error:", err);
        } else {
          let intent = response.output.intents[0].intent;
          const db = req.app.get("db");
          switch (intent) {
            // case "update_me": {
            // db.get_alll(req.session.user.id).then(res => {
            //   const singular = res.map((e, i) => {
            //     console.log(e);
            //     return e;
            //   });
            //   twiml.message(response.output.generic[0].text + " " + singular);
            //   resp.writeHead(200, { "Content-Type": "text/xml" });
            //   resp.end(twiml.toString());
            // });
            // break;
            //   const list = [];
            //   db.get_task(req.session.user.id)
            //     .then(res => {
            //       res.map(e => {
            //         list.push(e);
            //       });
            //     })
            //     .then(() => {
            //       db.get_appt(req.session.user.id)
            //         .then(res => {
            //           res.map(e => {
            //             list.push(e);
            //           });
            //         })
            //         .then(() => {
            //           db.get_contact(req.session.user.id)
            //             .then(res => {
            //               res.map(e => {
            //                 list.push(e);
            //               });
            //             })
            //             .then(() => {
            //               console.log(list);
            //               twiml.message(
            //                 response.output.generic[0].text +
            //                   " " +
            //                   list.map(e => e.mortal_id)
            //               );
            //               resp.writeHead(200, { "Content-Type": "text/xml" });
            //               resp.end(twiml.toString());
            //             });
            //         });
            //     });
            //   break;
            // }
            case "help": {
              twiml.message(
                "I can help you with getting any of the tasks, appointments or contacts you have created on the website."
              );
              resp.writeHead(200, { "Content-Type": "text/xml" });
              resp.end(twiml.toString());
              break;
            }
            case "link": {
              twiml.message(response.output.generic[0].text);
              resp.writeHead(200, { "Content-Type": "text/xml" });
              resp.end(twiml.toString());
              break;
            }
            case "name": {
              twiml.message(response.output.generic[0].text);
              resp.writeHead(200, { "Content-Type": "text/xml" });
              resp.end(twiml.toString());
              break;
            }
            case "get_tasks": {
              db.get_task(req.session.user.id).then(res => {
                const singular = res.map((e, i) => {
                  if (i === 0) {
                    return e.body;
                  } else {
                    return " " + e.body;
                  }
                });
                twiml.message(response.output.generic[0].text + singular);
                resp.writeHead(200, { "Content-Type": "text/xml" });
                resp.end(twiml.toString());
              });
              break;
            }
            case "get_contacts": {
              db.get_contact(req.session.user.id).then(res => {
                const singular = res.map((e, i) => {
                  return e.name;
                });
                twiml.message(response.output.generic[0].text + " " + singular);
                resp.writeHead(200, { "Content-Type": "text/xml" });
                resp.end(twiml.toString());
              });
              break;
            }
            case "get_appts": {
              db.get_appt(req.session.user.id).then(res => {
                const singular = res.map((e, i) => {
                  return `With ${e.name} at ${e.location} on ${e.appt_time}`;
                });
                twiml.message(response.output.generic[0].text + " " + singular);
                resp.writeHead(200, { "Content-Type": "text/xml" });
                resp.end(twiml.toString());
              });
              break;
            }
            default: {
              twiml.message(response.output.generic[0].text);
              resp.writeHead(200, { "Content-Type": "text/xml" });
              resp.end(twiml.toString());
            }
          }
        }
      }
    );
  }
};

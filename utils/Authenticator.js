import validUrl from "valid-url";
import isReachable from "is-reachable";
import imaps from "imap-simple";
import axios from "axios";

import constants from "./constants.js";

class Authenticator {
  constructor({
    publicUrl = "https://spider.nitt.edu/~praveen/auth_json.php",
    useWebmailDirectly = false,
    imapPort = 993,
  } = {}) {
    Object.assign(this, { publicUrl, useWebmailDirectly, imapPort });
    this.result = null;
  }

  determineURL(username) {
    if (this.useWebmailDirectly) {
      let isnum = /^\d+$/.test(username);
      if (isnum && username.length == 9) {
        return constants.WEBMAIL_URLS.STUDENT;
      }
      return constants.WEBMAIL_URLS.FACULTY;
    } else {
      return this.publicUrl;
    }
  }

  isURLValid(url) {
    if (!this.useWebmailDirectly) {
      return validUrl.isHttpsUri(url);
    }
    return true;
    //   return validUrl.isHttpsUri(url);
  }

  async login({ username, password, pingBeforeLogin }) {
    try {
      const finalURL = this.determineURL(username, password);
      if (this.isURLValid(finalURL)) {
        if (pingBeforeLogin) {
          const status = await isReachable(finalURL);
          if (status) {
            console.log("Ping successful!");
          } else {
            throw new Error("URL is not reachable");
          }
        }
        if (this.useWebmailDirectly) {
          const config = {
            imap: {
              user: username,
              password: password,
              host: finalURL,
              port: this.imapPort,
              tls: true,
              tlsOptions: {
                rejectUnauthorized: false,
              },
              authTimeout: 30000,
            },
          };
          // const res = await imaps.connect(config);
          try{
            const res = await imaps.connect(config)
            res.end()
            return true;

            // console.log(res.error)
          }
          catch(err){
            if(err.source == 'authentication')
            return false;
            return new Error("Some error occurred. " + err)
          }
          // if (res.source == 'authentication'){
          //   console.log("Wrong creds")
          // }

          // imap.once("ready", async () => {
          //   console.log("Connection successful");
          //   console.log(imap.state);
          //   result = true;
          // });
          // imap.once("error", async (e) => {
          //   if (e.source == "authentication") console.log("Wrong credentials");
          //   else console.log("Some error occurred. " + e);
          //   result = false;
          //   console.log(imap.state);
          // });
        } else {
          try {
            let res = await axios.post(finalURL, {
              rollno: username,
              password,
            });
            if (res.status < 300) return res.data;
          } catch (err) {
            throw new Error("Some error occured with public endpoint." + err);
          }
        }
      } else {
        throw new Error("URL is not valid. Make sure the URL is well formed.");
      }
    } catch (e) {
      console.log(e);
      console.log("Unable to perform login due to internal server error");
    }
  }
}

export default Authenticator;

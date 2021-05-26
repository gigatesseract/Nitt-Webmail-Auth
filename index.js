import Authenticator from "./utils/Authenticator.js";

(async() =>{
    const authenticator = new Authenticator({ useWebmailDirectly: true });
const response = await authenticator.login({
  username: "<>",
  password: "<>",
  pingBeforeLogin: true,
});
console.log(response);
})();

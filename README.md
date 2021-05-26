# Nitt-Webmail-Auth

JavaScript package for Webmail Authentication for NIT-T

## Installation
``` npm i nitt-webmail-auth ```

## Usage
```

(async() =>{
    /*
    Arguments for Authenticator object:
    {
         publicUrl = "<>", // if you have an external endpoint for login
        useWebmailDirectly = false, // If webmail servers are reachable, set this to true
        imapPort = 993 // the port for imap
    }

    Returns:
    true/false that indicates if the credentials are right or wrong, if useWebmailDirectly is set to true
    (OR)
    The response of the external endpoint, if useWebmailDirectly is set to false and PublicUrl is provided
    */

    const authenticator = new Authenticator({ useWebmailDirectly: true });
    const response = await authenticator.login({
        username: "<>", // rollno/username, wihtout @nitt.edu
        password: "<>",
        pingBeforeLogin: true, // checks if the server is reachable
});
console.log(response);
})();
```

Note: ES6 module. Make sure you have the   `"type" : "module"` in your package.json


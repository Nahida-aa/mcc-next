# Better Auth

- **OpenAPI Version:** `3.1.1`
- **API Version:** `1.1.0`

API Reference for your Better Auth Instance

## Servers

- **URL:** 

## Operations

### POST /sign-in/social

- **Method:** `POST`
- **Path:** `/sign-in/social`
- **Tags:** Default

Sign in with a social provider

#### Request Body

##### Content-Type: application/json

- **`provider` (required)**

  `string`

- **`callbackURL`**

  `string` — Callback URL to redirect to after the user has signed in

- **`disableRedirect`**

  `string` — Disable automatic redirection to the provider. Useful for handling the redirection yourself

- **`errorCallbackURL`**

  `string` — Callback URL to redirect to if an error happens

- **`idToken`**

  `string` — ID token from the provider to sign in the user with id token

- **`loginHint`**

  `string` — The login hint to use for the authorization code request

- **`newUserCallbackURL`**

  `string`

- **`requestSignUp`**

  `string` — Explicitly request sign-up. Useful when disableImplicitSignUp is true for this provider

- **`scopes`**

  `string` — Array of scopes to request from the provider. This will override the default scopes passed.

**Example:**

```
{
  "callbackURL": "",
  "newUserCallbackURL": "",
  "errorCallbackURL": "",
  "provider": "",
  "disableRedirect": "",
  "idToken": "",
  "scopes": "",
  "requestSignUp": "",
  "loginHint": ""
}
```

#### Responses

##### Status: 200 Success - Returns either session details or redirect URL

###### Content-Type: application/json

- **`redirect` (required)**

  `boolean`, possible values: `false`

- **`token` (required)**

  `string` — Session token

**Example:**

```
{
  "redirect": false,
  "token": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /get-session

- **Method:** `GET`
- **Path:** `/get-session`
- **Tags:** Default

Get the current session

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`session` (required)**

  `object`

  - **`activeOrganizationId`**

    `string`

  - **`createdAt`**

    `date`

  - **`expiresAt`**

    `date`

  - **`id`**

    `string`

  - **`impersonatedBy`**

    `string`

  - **`ipAddress`**

    `string`

  - **`token`**

    `string`

  - **`updatedAt`**

    `date`

  - **`userAgent`**

    `string`

  - **`userId`**

    `string`

- **`user` (required)**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "session": {
    "id": "",
    "expiresAt": null,
    "token": "",
    "createdAt": null,
    "updatedAt": null,
    "ipAddress": "",
    "userAgent": "",
    "userId": "",
    "impersonatedBy": "",
    "activeOrganizationId": ""
  },
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /sign-out

- **Method:** `POST`
- **Path:** `/sign-out`
- **Tags:** Default

Sign out the current user

#### Request Body

##### Content-Type: application/json

**Example:**

```
{}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`success`**

  `boolean`

**Example:**

```
{
  "success": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /sign-up/email

- **Method:** `POST`
- **Path:** `/sign-up/email`
- **Tags:** Default

Sign up a user using email and password

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — The email of the user

- **`name` (required)**

  `string` — The name of the user

- **`password` (required)**

  `string` — The password of the user

- **`callbackURL`**

  `string` — The URL to use for email verification callback

**Example:**

```
{
  "name": "",
  "email": "",
  "password": "",
  "callbackURL": ""
}
```

#### Responses

##### Status: 200 Successfully created user

###### Content-Type: application/json

- **`user` (required)**

  `object`

  - **`createdAt` (required)**

    `string`, format: `date-time` — When the user was created

  - **`email` (required)**

    `string`, format: `email` — The email address of the user

  - **`emailVerified` (required)**

    `boolean` — Whether the email has been verified

  - **`id` (required)**

    `string` — The unique identifier of the user

  - **`name` (required)**

    `string` — The name of the user

  - **`updatedAt` (required)**

    `string`, format: `date-time` — When the user was last updated

  - **`image`**

    `string`, format: `uri` — The profile image URL of the user

- **`token`**

  `string` — Authentication token for the session

**Example:**

```
{
  "token": "",
  "user": {
    "id": "",
    "email": "",
    "name": "",
    "image": "",
    "emailVerified": true,
    "createdAt": "",
    "updatedAt": ""
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /sign-in/email

- **Method:** `POST`
- **Path:** `/sign-in/email`
- **Tags:** Default

Sign in with email and password

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — Email of the user

- **`password` (required)**

  `string` — Password of the user

- **`callbackURL`**

  `string` — Callback URL to use as a redirect for email verification

- **`rememberMe`**

  `string` — If this is false, the session will not be remembered. Default is \`true\`.

**Example:**

```
{
  "email": "",
  "password": "",
  "callbackURL": "",
  "rememberMe": ""
}
```

#### Responses

##### Status: 200 Success - Returns either session details or redirect URL

###### Content-Type: application/json

- **`redirect` (required)**

  `boolean`, possible values: `false`

- **`token` (required)**

  `string` — Session token

- **`user` (required)**

  `object`

  - **`createdAt` (required)**

    `string`, format: `date-time`

  - **`email` (required)**

    `string`

  - **`emailVerified` (required)**

    `boolean`

  - **`id` (required)**

    `string`

  - **`updatedAt` (required)**

    `string`, format: `date-time`

  - **`image`**

    `string`

  - **`name`**

    `string`

- **`url`**

  `null`

**Example:**

```
{
  "redirect": false,
  "token": "",
  "url": null,
  "user": {
    "id": "",
    "email": "",
    "name": "",
    "image": "",
    "emailVerified": true,
    "createdAt": "",
    "updatedAt": ""
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /forget-password

- **Method:** `POST`
- **Path:** `/forget-password`
- **Tags:** Default

Send a password reset email to the user

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — The email address of the user to send a password reset email to

- **`redirectTo`**

  `string` — The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter \`?error=INVALID\_TOKEN\`. If the token is valid, it'll be redirected with a query parameter \`?token=VALID\_TOKEN

**Example:**

```
{
  "email": "",
  "redirectTo": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`message`**

  `string`

- **`status`**

  `boolean`

**Example:**

```
{
  "status": true,
  "message": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /reset-password

- **Method:** `POST`
- **Path:** `/reset-password`
- **Tags:** Default

Reset the password for a user

#### Request Body

##### Content-Type: application/json

- **`newPassword` (required)**

  `string` — The new password to set

- **`token`**

  `string` — The token to reset the password

**Example:**

```
{
  "newPassword": "",
  "token": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`status`**

  `boolean`

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /verify-email

- **Method:** `GET`
- **Path:** `/verify-email`
- **Tags:** Default

Verify the email of the user

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`status` (required)**

  `boolean` — Indicates if the email was verified successfully

- **`user` (required)**

  `object`

  - **`createdAt` (required)**

    `string` — User creation date

  - **`email` (required)**

    `string` — User email

  - **`emailVerified` (required)**

    `boolean` — Indicates if the user email is verified

  - **`id` (required)**

    `string` — User ID

  - **`image` (required)**

    `string` — User image URL

  - **`name` (required)**

    `string` — User name

  - **`updatedAt` (required)**

    `string` — User update date

**Example:**

```
{
  "user": {
    "id": "",
    "email": "",
    "name": "",
    "image": "",
    "emailVerified": true,
    "createdAt": "",
    "updatedAt": ""
  },
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /send-verification-email

- **Method:** `POST`
- **Path:** `/send-verification-email`
- **Tags:** Default

Send a verification email to the user

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — The email to send the verification email to

- **`callbackURL`**

  `string` — The URL to use for email verification callback

**Example:**

```
{
  "email": "user@example.com",
  "callbackURL": "https://example.com/callback"
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`status`**

  `boolean` — Indicates if the email was sent successfully

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request

###### Content-Type: application/json

- **`message`**

  `string` — Error message

**Example:**

```
{
  "message": "Verification email isn't enabled"
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /change-email

- **Method:** `POST`
- **Path:** `/change-email`
- **Tags:** Default

#### Request Body

##### Content-Type: application/json

- **`newEmail` (required)**

  `string` — The new email to set

- **`callbackURL`**

  `string` — The URL to redirect to after email verification

**Example:**

```
{
  "newEmail": "",
  "callbackURL": ""
}
```

#### Responses

##### Status: 200 Email change request processed successfully

###### Content-Type: application/json

- **`status` (required)**

  `boolean` — Indicates if the request was successful

- **`message`**

  `string`, possible values: `"Email updated", "Verification email sent"` — Status message of the email change process

**Example:**

```
{
  "status": true,
  "message": "Email updated"
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /change-password

- **Method:** `POST`
- **Path:** `/change-password`
- **Tags:** Default

Change the password of the user

#### Request Body

##### Content-Type: application/json

- **`currentPassword` (required)**

  `string` — The current password

- **`newPassword` (required)**

  `string` — The new password to set

- **`revokeOtherSessions`**

  `string` — Revoke all other sessions

**Example:**

```
{
  "newPassword": "",
  "currentPassword": "",
  "revokeOtherSessions": ""
}
```

#### Responses

##### Status: 200 Password successfully changed

###### Content-Type: application/json

- **`user` (required)**

  `object`

  - **`createdAt` (required)**

    `string`, format: `date-time` — When the user was created

  - **`email` (required)**

    `string`, format: `email` — The email address of the user

  - **`emailVerified` (required)**

    `boolean` — Whether the email has been verified

  - **`id` (required)**

    `string` — The unique identifier of the user

  - **`name` (required)**

    `string` — The name of the user

  - **`updatedAt` (required)**

    `string`, format: `date-time` — When the user was last updated

  - **`image`**

    `string`, format: `uri` — The profile image URL of the user

- **`token`**

  `string` — New session token if other sessions were revoked

**Example:**

```
{
  "token": "",
  "user": {
    "id": "",
    "email": "",
    "name": "",
    "image": "",
    "emailVerified": true,
    "createdAt": "",
    "updatedAt": ""
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /update-user

- **Method:** `POST`
- **Path:** `/update-user`
- **Tags:** Default

Update the current user

#### Request Body

##### Content-Type: application/json

- **`image`**

  `string` — The image of the user

- **`name`**

  `string` — The name of the user

**Example:**

```
{
  "name": "",
  "image": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`status`**

  `boolean` — Indicates if the update was successful

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /delete-user

- **Method:** `POST`
- **Path:** `/delete-user`
- **Tags:** Default

Delete the user

#### Request Body

##### Content-Type: application/json

- **`callbackURL`**

  `string`

- **`password`**

  `string`

- **`token`**

  `string`

**Example:**

```
{
  "callbackURL": "",
  "password": "",
  "token": ""
}
```

#### Responses

##### Status: 200 User deletion processed successfully

###### Content-Type: application/json

- **`message` (required)**

  `string`, possible values: `"User deleted", "Verification email sent"` — Status message of the deletion process

- **`success` (required)**

  `boolean` — Indicates if the operation was successful

**Example:**

```
{
  "success": true,
  "message": "User deleted"
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /reset-password/{token}

- **Method:** `GET`
- **Path:** `/reset-password/{token}`
- **Tags:** Default

Redirects the user to the callback URL with the token

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`token`**

  `string`

**Example:**

```
{
  "token": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /request-password-reset

- **Method:** `POST`
- **Path:** `/request-password-reset`
- **Tags:** Default

Send a password reset email to the user

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — The email address of the user to send a password reset email to

- **`redirectTo`**

  `string` — The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter \`?error=INVALID\_TOKEN\`. If the token is valid, it'll be redirected with a query parameter \`?token=VALID\_TOKEN

**Example:**

```
{
  "email": "",
  "redirectTo": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`message`**

  `string`

- **`status`**

  `boolean`

**Example:**

```
{
  "status": true,
  "message": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /list-sessions

- **Method:** `GET`
- **Path:** `/list-sessions`
- **Tags:** Default

List all active sessions for the user

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

**Array of:**

- **`activeOrganizationId`**

  `string`

- **`createdAt`**

  `date`

- **`expiresAt`**

  `date`

- **`id`**

  `string`

- **`impersonatedBy`**

  `string`

- **`ipAddress`**

  `string`

- **`token`**

  `string`

- **`updatedAt`**

  `date`

- **`userAgent`**

  `string`

- **`userId`**

  `string`

**Example:**

```
[
  {
    "id": "",
    "expiresAt": null,
    "token": "",
    "createdAt": null,
    "updatedAt": null,
    "ipAddress": "",
    "userAgent": "",
    "userId": "",
    "impersonatedBy": "",
    "activeOrganizationId": ""
  }
]
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /revoke-session

- **Method:** `POST`
- **Path:** `/revoke-session`
- **Tags:** Default

Revoke a single session

#### Request Body

##### Content-Type: application/json

- **`token` (required)**

  `string` — The token to revoke

**Example:**

```
{
  "token": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`status` (required)**

  `boolean` — Indicates if the session was revoked successfully

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /revoke-sessions

- **Method:** `POST`
- **Path:** `/revoke-sessions`
- **Tags:** Default

Revoke all sessions for the user

#### Request Body

##### Content-Type: application/json

**Example:**

```
{}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`status` (required)**

  `boolean` — Indicates if all sessions were revoked successfully

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /revoke-other-sessions

- **Method:** `POST`
- **Path:** `/revoke-other-sessions`
- **Tags:** Default

Revoke all other sessions for the user except the current one

#### Request Body

##### Content-Type: application/json

**Example:**

```
{}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`status` (required)**

  `boolean` — Indicates if all other sessions were revoked successfully

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /link-social

- **Method:** `POST`
- **Path:** `/link-social`
- **Tags:** Default

Link a social account to the user

#### Request Body

##### Content-Type: application/json

- **`provider` (required)**

  `string`

- **`callbackURL`**

  `string` — The URL to redirect to after the user has signed in

- **`errorCallbackURL`**

  `string` — The URL to redirect to if there is an error during the link process

- **`idToken`**

  `string`

- **`requestSignUp`**

  `string`

- **`scopes`**

  `string` — Additional scopes to request from the provider

**Example:**

```
{
  "callbackURL": "",
  "provider": "",
  "idToken": "",
  "requestSignUp": "",
  "scopes": "",
  "errorCallbackURL": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`redirect` (required)**

  `boolean` — Indicates if the user should be redirected to the authorization URL

- **`status`**

  `boolean`

- **`url`**

  `string` — The authorization URL to redirect the user to

**Example:**

```
{
  "url": "",
  "redirect": true,
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /list-accounts

- **Method:** `GET`
- **Path:** `/list-accounts`
- **Tags:** Default

List all accounts linked to the user

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

**Array of:**

- **`createdAt`**

  `string`, format: `date-time`

- **`id`**

  `string`

- **`provider`**

  `string`

- **`updatedAt`**

  `string`, format: `date-time`

**Example:**

```
[
  {
    "id": "",
    "provider": "",
    "createdAt": "",
    "updatedAt": ""
  }
]
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /delete-user/callback

- **Method:** `GET`
- **Path:** `/delete-user/callback`
- **Tags:** Default

Callback to complete user deletion with verification token

#### Responses

##### Status: 200 User successfully deleted

###### Content-Type: application/json

- **`message` (required)**

  `string`, possible values: `"User deleted"` — Confirmation message

- **`success` (required)**

  `boolean` — Indicates if the deletion was successful

**Example:**

```
{
  "success": true,
  "message": "User deleted"
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /unlink-account

- **Method:** `POST`
- **Path:** `/unlink-account`
- **Tags:** Default

Unlink an account

#### Request Body

##### Content-Type: application/json

- **`providerId` (required)**

  `string`

- **`accountId`**

  `string`

**Example:**

```
{
  "providerId": "",
  "accountId": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`status`**

  `boolean`

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /refresh-token

- **Method:** `POST`
- **Path:** `/refresh-token`
- **Tags:** Default

Refresh the access token using a refresh token

#### Request Body

##### Content-Type: application/json

- **`providerId` (required)**

  `string` — The provider ID for the OAuth provider

- **`accountId`**

  `string` — The account ID associated with the refresh token

- **`userId`**

  `string` — The user ID associated with the account

**Example:**

```
{
  "providerId": "",
  "accountId": "",
  "userId": ""
}
```

#### Responses

##### Status: 200 Access token refreshed successfully

###### Content-Type: application/json

- **`accessToken`**

  `string`

- **`accessTokenExpiresAt`**

  `string`, format: `date-time`

- **`idToken`**

  `string`

- **`refreshToken`**

  `string`

- **`refreshTokenExpiresAt`**

  `string`, format: `date-time`

- **`tokenType`**

  `string`

**Example:**

```
{
  "tokenType": "",
  "idToken": "",
  "accessToken": "",
  "refreshToken": "",
  "accessTokenExpiresAt": "",
  "refreshTokenExpiresAt": ""
}
```

##### Status: 400 Invalid refresh token or provider configuration

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /get-access-token

- **Method:** `POST`
- **Path:** `/get-access-token`
- **Tags:** Default

Get a valid access token, doing a refresh if needed

#### Request Body

##### Content-Type: application/json

- **`providerId` (required)**

  `string` — The provider ID for the OAuth provider

- **`accountId`**

  `string` — The account ID associated with the refresh token

- **`userId`**

  `string` — The user ID associated with the account

**Example:**

```
{
  "providerId": "",
  "accountId": "",
  "userId": ""
}
```

#### Responses

##### Status: 200 A Valid access token

###### Content-Type: application/json

- **`accessToken`**

  `string`

- **`accessTokenExpiresAt`**

  `string`, format: `date-time`

- **`idToken`**

  `string`

- **`refreshToken`**

  `string`

- **`refreshTokenExpiresAt`**

  `string`, format: `date-time`

- **`tokenType`**

  `string`

**Example:**

```
{
  "tokenType": "",
  "idToken": "",
  "accessToken": "",
  "refreshToken": "",
  "accessTokenExpiresAt": "",
  "refreshTokenExpiresAt": ""
}
```

##### Status: 400 Invalid refresh token or provider configuration

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /account-info

- **Method:** `POST`
- **Path:** `/account-info`
- **Tags:** Default

Get the account info provided by the provider

#### Request Body

##### Content-Type: application/json

- **`accountId` (required)**

  `string` — The provider given account id for which to get the account info

**Example:**

```
{
  "accountId": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`data` (required)**

  `object`

- **`user` (required)**

  `object`

  - **`emailVerified` (required)**

    `boolean`

  - **`id` (required)**

    `string`

  - **`email`**

    `string`

  - **`image`**

    `string`

  - **`name`**

    `string`

**Example:**

```
{
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "image": "",
    "emailVerified": true
  },
  "data": {
    "propertyName*": "anything"
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /ok

- **Method:** `GET`
- **Path:** `/ok`
- **Tags:** Default

Check if the API is working

#### Responses

##### Status: 200 API is working

###### Content-Type: application/json

- **`ok` (required)**

  `boolean` — Indicates if the API is working

**Example:**

```
{
  "ok": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /error

- **Method:** `GET`
- **Path:** `/error`
- **Tags:** Default

Displays an error page

#### Responses

##### Status: 200 Success

###### Content-Type: text/html

`string` — The HTML content of the error page

**Example:**

```
true
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /two-factor/get-totp-uri

- **Method:** `POST`
- **Path:** `/two-factor/get-totp-uri`
- **Tags:** Two-factor

Use this endpoint to get the TOTP URI

#### Request Body

##### Content-Type: application/json

- **`password` (required)**

  `string` — User password

**Example:**

```
{
  "password": ""
}
```

#### Responses

##### Status: 200 Successful response

###### Content-Type: application/json

- **`totpURI`**

  `string`

**Example:**

```
{
  "totpURI": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /two-factor/verify-totp

- **Method:** `POST`
- **Path:** `/two-factor/verify-totp`
- **Tags:** Two-factor

Verify two factor TOTP

#### Request Body

##### Content-Type: application/json

- **`code` (required)**

  `string` — The otp code to verify

- **`trustDevice`**

  `string` — If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time.

**Example:**

```
{
  "code": "",
  "trustDevice": ""
}
```

#### Responses

##### Status: 200 Successful response

###### Content-Type: application/json

- **`status`**

  `boolean`

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /two-factor/send-otp

- **Method:** `POST`
- **Path:** `/two-factor/send-otp`
- **Tags:** Two-factor

Send two factor OTP to the user

#### Responses

##### Status: 200 Successful response

###### Content-Type: application/json

- **`status`**

  `boolean`

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /two-factor/verify-otp

- **Method:** `POST`
- **Path:** `/two-factor/verify-otp`
- **Tags:** Two-factor

Verify two factor OTP

#### Request Body

##### Content-Type: application/json

- **`code` (required)**

  `string` — The otp code to verify

- **`trustDevice`**

  `string`

**Example:**

```
{
  "code": "",
  "trustDevice": ""
}
```

#### Responses

##### Status: 200 Two-factor OTP verified successfully

###### Content-Type: application/json

- **`token` (required)**

  `string` — Session token for the authenticated session

- **`user` (required)**

  `object` — The authenticated user object

  - **`createdAt` (required)**

    `string`, format: `date-time` — Timestamp when the user was created

  - **`id` (required)**

    `string` — Unique identifier of the user

  - **`updatedAt` (required)**

    `string`, format: `date-time` — Timestamp when the user was last updated

  - **`email`**

    `string`, format: `email` — User's email address

  - **`emailVerified`**

    `boolean` — Whether the email is verified

  - **`image`**

    `string`, format: `uri` — User's profile image URL

  - **`name`**

    `string` — User's name

**Example:**

```
{
  "token": "",
  "user": {
    "id": "",
    "email": "",
    "emailVerified": true,
    "name": "",
    "image": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /two-factor/verify-backup-code

- **Method:** `POST`
- **Path:** `/two-factor/verify-backup-code`
- **Tags:** Two-factor

Verify a backup code for two-factor authentication

#### Request Body

##### Content-Type: application/json

- **`code` (required)**

  `string`

- **`disableSession`**

  `string` — If true, the session cookie will not be set.

- **`trustDevice`**

  `string` — If true, the device will be trusted for 30 days. It'll be refreshed on every sign in request within this time.

**Example:**

```
{
  "code": "",
  "disableSession": "",
  "trustDevice": ""
}
```

#### Responses

##### Status: 200 Backup code verified successfully

###### Content-Type: application/json

- **`session` (required)**

  `object` — The current session object, included unless disableSession is true

  - **`createdAt` (required)**

    `string`, format: `date-time` — Timestamp when the session was created

  - **`expiresAt` (required)**

    `string`, format: `date-time` — Timestamp when the session expires

  - **`token` (required)**

    `string` — Session token

  - **`userId` (required)**

    `string` — ID of the user associated with the session

- **`user` (required)**

  `object` — The authenticated user object with two-factor details

  - **`createdAt` (required)**

    `string`, format: `date-time` — Timestamp when the user was created

  - **`id` (required)**

    `string` — Unique identifier of the user

  - **`twoFactorEnabled` (required)**

    `boolean` — Whether two-factor authentication is enabled for the user

  - **`updatedAt` (required)**

    `string`, format: `date-time` — Timestamp when the user was last updated

  - **`email`**

    `string`, format: `email` — User's email address

  - **`emailVerified`**

    `boolean` — Whether the email is verified

  - **`image`**

    `string`, format: `uri` — User's profile image URL

  - **`name`**

    `string` — User's name

**Example:**

```
{
  "user": {
    "id": "",
    "email": "",
    "emailVerified": true,
    "name": "",
    "image": "",
    "twoFactorEnabled": true,
    "createdAt": "",
    "updatedAt": ""
  },
  "session": {
    "token": "",
    "userId": "",
    "createdAt": "",
    "expiresAt": ""
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /two-factor/generate-backup-codes

- **Method:** `POST`
- **Path:** `/two-factor/generate-backup-codes`
- **Tags:** Two-factor

Generate new backup codes for two-factor authentication

#### Request Body

##### Content-Type: application/json

- **`password` (required)**

  `string`

**Example:**

```
{
  "password": ""
}
```

#### Responses

##### Status: 200 Backup codes generated successfully

###### Content-Type: application/json

- **`backupCodes` (required)**

  `array` — Array of generated backup codes in plain text

  **Items:**

  `string`

- **`status` (required)**

  `boolean`, possible values: `true` — Indicates if the backup codes were generated successfully

**Example:**

```
{
  "status": true,
  "backupCodes": [
    ""
  ]
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /two-factor/enable

- **Method:** `POST`
- **Path:** `/two-factor/enable`
- **Tags:** Two-factor

Use this endpoint to enable two factor authentication. This will generate a TOTP URI and backup codes. Once the user verifies the TOTP URI, the two factor authentication will be enabled.

#### Request Body

##### Content-Type: application/json

- **`password` (required)**

  `string` — User password

- **`issuer`**

  `string` — Custom issuer for the TOTP URI

**Example:**

```
{
  "password": "",
  "issuer": ""
}
```

#### Responses

##### Status: 200 Successful response

###### Content-Type: application/json

- **`backupCodes`**

  `array` — Backup codes

  **Items:**

  `string`

- **`totpURI`**

  `string` — TOTP URI

**Example:**

```
{
  "totpURI": "",
  "backupCodes": [
    ""
  ]
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /two-factor/disable

- **Method:** `POST`
- **Path:** `/two-factor/disable`
- **Tags:** Two-factor

Use this endpoint to disable two factor authentication.

#### Request Body

##### Content-Type: application/json

- **`password` (required)**

  `string` — User password

**Example:**

```
{
  "password": ""
}
```

#### Responses

##### Status: 200 Successful response

###### Content-Type: application/json

- **`status`**

  `boolean`

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /sign-in/username

- **Method:** `POST`
- **Path:** `/sign-in/username`
- **Tags:** Username

Sign in with username

#### Request Body

##### Content-Type: application/json

- **`password` (required)**

  `string` — The password of the user

- **`username` (required)**

  `string` — The username of the user

- **`rememberMe`**

  `string` — Remember the user session

**Example:**

```
{
  "username": "",
  "password": "",
  "rememberMe": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`token` (required)**

  `string` — Session token for the authenticated session

- **`user` (required)**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "token": "",
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /sign-in/anonymous

- **Method:** `POST`
- **Path:** `/sign-in/anonymous`
- **Tags:** Anonymous

Sign in anonymously

#### Responses

##### Status: 200 Sign in anonymously

###### Content-Type: application/json

- **`session`**

  `object`

  - **`activeOrganizationId`**

    `string`

  - **`createdAt`**

    `date`

  - **`expiresAt`**

    `date`

  - **`id`**

    `string`

  - **`impersonatedBy`**

    `string`

  - **`ipAddress`**

    `string`

  - **`token`**

    `string`

  - **`updatedAt`**

    `date`

  - **`userAgent`**

    `string`

  - **`userId`**

    `string`

- **`user`**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  },
  "session": {
    "id": "",
    "expiresAt": null,
    "token": "",
    "createdAt": null,
    "updatedAt": null,
    "ipAddress": "",
    "userAgent": "",
    "userId": "",
    "impersonatedBy": "",
    "activeOrganizationId": ""
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /sign-in/phone-number

- **Method:** `POST`
- **Path:** `/sign-in/phone-number`
- **Tags:** Phone-number

Use this endpoint to sign in with phone number

#### Request Body

##### Content-Type: application/json

- **`password` (required)**

  `string` — Password to use for sign in

- **`phoneNumber` (required)**

  `string` — Phone number to sign in

- **`rememberMe`**

  `string` — Remember the session

**Example:**

```
{
  "phoneNumber": "",
  "password": "",
  "rememberMe": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`session`**

  `object`

  - **`activeOrganizationId`**

    `string`

  - **`createdAt`**

    `date`

  - **`expiresAt`**

    `date`

  - **`id`**

    `string`

  - **`impersonatedBy`**

    `string`

  - **`ipAddress`**

    `string`

  - **`token`**

    `string`

  - **`updatedAt`**

    `date`

  - **`userAgent`**

    `string`

  - **`userId`**

    `string`

- **`user`**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  },
  "session": {
    "id": "",
    "expiresAt": null,
    "token": "",
    "createdAt": null,
    "updatedAt": null,
    "ipAddress": "",
    "userAgent": "",
    "userId": "",
    "impersonatedBy": "",
    "activeOrganizationId": ""
  }
}
```

##### Status: 400 Invalid phone number or password

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /phone-number/send-otp

- **Method:** `POST`
- **Path:** `/phone-number/send-otp`
- **Tags:** Phone-number

Use this endpoint to send OTP to phone number

#### Request Body

##### Content-Type: application/json

- **`phoneNumber` (required)**

  `string` — Phone number to send OTP

**Example:**

```
{
  "phoneNumber": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /phone-number/verify

- **Method:** `POST`
- **Path:** `/phone-number/verify`
- **Tags:** Phone-number

Use this endpoint to verify phone number

#### Request Body

##### Content-Type: application/json

- **`code` (required)**

  `string` — OTP code

- **`phoneNumber` (required)**

  `string` — Phone number to verify

- **`disableSession`**

  `string` — Disable session creation after verification

- **`updatePhoneNumber`**

  `string` — Check if there is a session and update the phone number

**Example:**

```
{
  "phoneNumber": "",
  "code": "",
  "disableSession": "",
  "updatePhoneNumber": ""
}
```

#### Responses

##### Status: 200 Phone number verified successfully

###### Content-Type: application/json

- **`status` (required)**

  `boolean`, possible values: `true` — Indicates if the verification was successful

- **`token`**

  `string` — Session token if session is created, null if disableSession is true or no session is created

- **`user`**

  `object` — User object with phone number details, null if no user is created or found

  - **`createdAt` (required)**

    `string`, format: `date-time` — Timestamp when the user was created

  - **`id` (required)**

    `string` — Unique identifier of the user

  - **`phoneNumber` (required)**

    `string` — User's phone number

  - **`phoneNumberVerified` (required)**

    `boolean` — Whether the phone number is verified

  - **`updatedAt` (required)**

    `string`, format: `date-time` — Timestamp when the user was last updated

  - **`email`**

    `string`, format: `email` — User's email address

  - **`emailVerified`**

    `boolean` — Whether the email is verified

  - **`image`**

    `string`, format: `uri` — User's profile image URL

  - **`name`**

    `string` — User's name

**Example:**

```
{
  "status": true,
  "token": "",
  "user": {
    "id": "",
    "email": "",
    "emailVerified": true,
    "name": "",
    "image": "",
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "createdAt": "",
    "updatedAt": ""
  }
}
```

##### Status: 400 Invalid OTP

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /phone-number/forget-password

- **Method:** `POST`
- **Path:** `/phone-number/forget-password`
- **Tags:** Phone-number

Request OTP for password reset via phone number

#### Request Body

##### Content-Type: application/json

- **`phoneNumber` (required)**

  `string`

**Example:**

```
{
  "phoneNumber": ""
}
```

#### Responses

##### Status: 200 OTP sent successfully for password reset

###### Content-Type: application/json

- **`status` (required)**

  `boolean`, possible values: `true` — Indicates if the OTP was sent successfully

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /phone-number/request-password-reset

- **Method:** `POST`
- **Path:** `/phone-number/request-password-reset`
- **Tags:** Phone-number

Request OTP for password reset via phone number

#### Request Body

##### Content-Type: application/json

- **`phoneNumber` (required)**

  `string`

**Example:**

```
{
  "phoneNumber": ""
}
```

#### Responses

##### Status: 200 OTP sent successfully for password reset

###### Content-Type: application/json

- **`status` (required)**

  `boolean`, possible values: `true` — Indicates if the OTP was sent successfully

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /phone-number/reset-password

- **Method:** `POST`
- **Path:** `/phone-number/reset-password`
- **Tags:** Phone-number

Reset password using phone number OTP

#### Request Body

##### Content-Type: application/json

- **`newPassword` (required)**

  `string`

- **`otp` (required)**

  `string`

- **`phoneNumber` (required)**

  `string`

**Example:**

```
{
  "otp": "",
  "phoneNumber": "",
  "newPassword": ""
}
```

#### Responses

##### Status: 200 Password reset successfully

###### Content-Type: application/json

- **`status` (required)**

  `boolean`, possible values: `true` — Indicates if the password was reset successfully

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /email-otp/send-verification-otp

- **Method:** `POST`
- **Path:** `/email-otp/send-verification-otp`
- **Tags:** Email-otp

Send verification OTP

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — Email address to send the OTP

- **`type` (required)**

  `string` — Type of the OTP

**Example:**

```
{
  "email": "",
  "type": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`success`**

  `boolean`

**Example:**

```
{
  "success": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /email-otp/verify-email

- **Method:** `POST`
- **Path:** `/email-otp/verify-email`
- **Tags:** Email-otp

Verify email OTP

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — Email address to verify

- **`otp` (required)**

  `string` — OTP to verify

**Example:**

```
{
  "email": "",
  "otp": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`required`**

  `object`

- **`status`**

  `boolean`, possible values: `true` — Indicates if the verification was successful

- **`token`**

  `string` — Session token if autoSignInAfterVerification is enabled, otherwise null

- **`user`**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "status": true,
  "token": "",
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  },
  "required": null
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /sign-in/email-otp

- **Method:** `POST`
- **Path:** `/sign-in/email-otp`
- **Tags:** Email-otp

Sign in with email OTP

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — Email address to sign in

- **`otp` (required)**

  `string` — OTP sent to the email

**Example:**

```
{
  "email": "",
  "otp": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`token` (required)**

  `string` — Session token for the authenticated session

- **`user` (required)**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "token": "",
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /forget-password/email-otp

- **Method:** `POST`
- **Path:** `/forget-password/email-otp`
- **Tags:** Email-otp

Forget password with email OTP

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — Email address to send the OTP

**Example:**

```
{
  "email": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`success`**

  `boolean` — Indicates if the OTP was sent successfully

**Example:**

```
{
  "success": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /email-otp/reset-password

- **Method:** `POST`
- **Path:** `/email-otp/reset-password`
- **Tags:** Email-otp

Reset password with email OTP

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — Email address to reset the password

- **`otp` (required)**

  `string` — OTP sent to the email

- **`password` (required)**

  `string` — New password

**Example:**

```
{
  "email": "",
  "otp": "",
  "password": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`success`**

  `boolean`

**Example:**

```
{
  "success": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/set-role

- **Method:** `POST`
- **Path:** `/admin/set-role`
- **Tags:** Admin

Set the role of a user

#### Request Body

##### Content-Type: application/json

- **`role` (required)**

  `string`

- **`userId` (required)**

  `string` — The user id

**Example:**

```
{
  "userId": "",
  "role": ""
}
```

#### Responses

##### Status: 200 User role updated

###### Content-Type: application/json

- **`user`**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/create-user

- **Method:** `POST`
- **Path:** `/admin/create-user`
- **Tags:** Admin

Create a new user

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — The email of the user

- **`name` (required)**

  `string` — The name of the user

- **`password` (required)**

  `string` — The password of the user

- **`data`**

  `string`

- **`role`**

  `string`

**Example:**

```
{
  "email": "",
  "password": "",
  "name": "",
  "role": "",
  "data": ""
}
```

#### Responses

##### Status: 200 User created

###### Content-Type: application/json

- **`user`**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /admin/list-users

- **Method:** `GET`
- **Path:** `/admin/list-users`
- **Tags:** Admin

List users

#### Responses

##### Status: 200 List of users

###### Content-Type: application/json

- **`total` (required)**

  `number`

- **`users` (required)**

  `array`

  **Items:**

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

- **`limit`**

  `number`

- **`offset`**

  `number`

**Example:**

```
{
  "users": [
    {
      "id": "",
      "name": "",
      "email": "",
      "emailVerified": true,
      "image": "",
      "createdAt": null,
      "updatedAt": null,
      "twoFactorEnabled": true,
      "username": "",
      "displayUsername": "",
      "isAnonymous": true,
      "phoneNumber": "",
      "phoneNumberVerified": true,
      "role": "",
      "banned": true,
      "banReason": "",
      "banExpires": null
    }
  ],
  "total": 1,
  "limit": 1,
  "offset": 1
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/list-user-sessions

- **Method:** `POST`
- **Path:** `/admin/list-user-sessions`
- **Tags:** Admin

List user sessions

#### Request Body

##### Content-Type: application/json

- **`userId` (required)**

  `string` — The user id

**Example:**

```
{
  "userId": ""
}
```

#### Responses

##### Status: 200 List of user sessions

###### Content-Type: application/json

- **`sessions`**

  `array`

  **Items:**

  - **`activeOrganizationId`**

    `string`

  - **`createdAt`**

    `date`

  - **`expiresAt`**

    `date`

  - **`id`**

    `string`

  - **`impersonatedBy`**

    `string`

  - **`ipAddress`**

    `string`

  - **`token`**

    `string`

  - **`updatedAt`**

    `date`

  - **`userAgent`**

    `string`

  - **`userId`**

    `string`

**Example:**

```
{
  "sessions": [
    {
      "id": "",
      "expiresAt": null,
      "token": "",
      "createdAt": null,
      "updatedAt": null,
      "ipAddress": "",
      "userAgent": "",
      "userId": "",
      "impersonatedBy": "",
      "activeOrganizationId": ""
    }
  ]
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/unban-user

- **Method:** `POST`
- **Path:** `/admin/unban-user`
- **Tags:** Admin

Unban a user

#### Request Body

##### Content-Type: application/json

- **`userId` (required)**

  `string` — The user id

**Example:**

```
{
  "userId": ""
}
```

#### Responses

##### Status: 200 User unbanned

###### Content-Type: application/json

- **`user`**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/ban-user

- **Method:** `POST`
- **Path:** `/admin/ban-user`
- **Tags:** Admin

Ban a user

#### Request Body

##### Content-Type: application/json

- **`userId` (required)**

  `string` — The user id

- **`banExpiresIn`**

  `string` — The number of seconds until the ban expires

- **`banReason`**

  `string` — The reason for the ban

**Example:**

```
{
  "userId": "",
  "banReason": "",
  "banExpiresIn": ""
}
```

#### Responses

##### Status: 200 User banned

###### Content-Type: application/json

- **`user`**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/impersonate-user

- **Method:** `POST`
- **Path:** `/admin/impersonate-user`
- **Tags:** Admin

Impersonate a user

#### Request Body

##### Content-Type: application/json

- **`userId` (required)**

  `string` — The user id

**Example:**

```
{
  "userId": ""
}
```

#### Responses

##### Status: 200 Impersonation session created

###### Content-Type: application/json

- **`session`**

  `object`

  - **`activeOrganizationId`**

    `string`

  - **`createdAt`**

    `date`

  - **`expiresAt`**

    `date`

  - **`id`**

    `string`

  - **`impersonatedBy`**

    `string`

  - **`ipAddress`**

    `string`

  - **`token`**

    `string`

  - **`updatedAt`**

    `date`

  - **`userAgent`**

    `string`

  - **`userId`**

    `string`

- **`user`**

  `object`

  - **`banExpires`**

    `date`

  - **`banned`**

    `boolean`

  - **`banReason`**

    `string`

  - **`createdAt`**

    `date`

  - **`displayUsername`**

    `string`

  - **`email`**

    `string`

  - **`emailVerified`**

    `boolean`

  - **`id`**

    `string`

  - **`image`**

    `string`

  - **`isAnonymous`**

    `boolean`

  - **`name`**

    `string`

  - **`phoneNumber`**

    `string`

  - **`phoneNumberVerified`**

    `boolean`

  - **`role`**

    `string`

  - **`twoFactorEnabled`**

    `boolean`

  - **`updatedAt`**

    `date`

  - **`username`**

    `string`

**Example:**

```
{
  "session": {
    "id": "",
    "expiresAt": null,
    "token": "",
    "createdAt": null,
    "updatedAt": null,
    "ipAddress": "",
    "userAgent": "",
    "userId": "",
    "impersonatedBy": "",
    "activeOrganizationId": ""
  },
  "user": {
    "id": "",
    "name": "",
    "email": "",
    "emailVerified": true,
    "image": "",
    "createdAt": null,
    "updatedAt": null,
    "twoFactorEnabled": true,
    "username": "",
    "displayUsername": "",
    "isAnonymous": true,
    "phoneNumber": "",
    "phoneNumberVerified": true,
    "role": "",
    "banned": true,
    "banReason": "",
    "banExpires": null
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/stop-impersonating

- **Method:** `POST`
- **Path:** `/admin/stop-impersonating`
- **Tags:** Admin

#### Responses

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/revoke-user-session

- **Method:** `POST`
- **Path:** `/admin/revoke-user-session`
- **Tags:** Admin

Revoke a user session

#### Request Body

##### Content-Type: application/json

- **`sessionToken` (required)**

  `string` — The session token

**Example:**

```
{
  "sessionToken": ""
}
```

#### Responses

##### Status: 200 Session revoked

###### Content-Type: application/json

- **`success`**

  `boolean`

**Example:**

```
{
  "success": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/revoke-user-sessions

- **Method:** `POST`
- **Path:** `/admin/revoke-user-sessions`
- **Tags:** Admin

Revoke all user sessions

#### Request Body

##### Content-Type: application/json

- **`userId` (required)**

  `string` — The user id

**Example:**

```
{
  "userId": ""
}
```

#### Responses

##### Status: 200 Sessions revoked

###### Content-Type: application/json

- **`success`**

  `boolean`

**Example:**

```
{
  "success": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/remove-user

- **Method:** `POST`
- **Path:** `/admin/remove-user`
- **Tags:** Admin

Delete a user and all their sessions and accounts. Cannot be undone.

#### Request Body

##### Content-Type: application/json

- **`userId` (required)**

  `string` — The user id

**Example:**

```
{
  "userId": ""
}
```

#### Responses

##### Status: 200 User removed

###### Content-Type: application/json

- **`success`**

  `boolean`

**Example:**

```
{
  "success": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/set-user-password

- **Method:** `POST`
- **Path:** `/admin/set-user-password`
- **Tags:** Admin

Set a user's password

#### Request Body

##### Content-Type: application/json

- **`newPassword` (required)**

  `string` — The new password

- **`userId` (required)**

  `string` — The user id

**Example:**

```
{
  "newPassword": "",
  "userId": ""
}
```

#### Responses

##### Status: 200 Password set

###### Content-Type: application/json

- **`status`**

  `boolean`

**Example:**

```
{
  "status": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /admin/has-permission

- **Method:** `POST`
- **Path:** `/admin/has-permission`
- **Tags:** Admin

Check if the user has permission

#### Request Body

##### Content-Type: application/json

- **`permissions` (required)**

  `object` — The permission to check

- **`permission`**

  `object` — The permission to check

**Example:**

```
{
  "permissions": {}
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`success` (required)**

  `boolean`

- **`error`**

  `string`

**Example:**

```
{
  "error": "",
  "success": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/create

- **Method:** `POST`
- **Path:** `/organization/create`
- **Tags:** Organization

Create an organization

#### Request Body

##### Content-Type: application/json

- **`name` (required)**

  `string` — The name of the organization

- **`slug` (required)**

  `string` — The slug of the organization

- **`keepCurrentActiveOrganization`**

  `string` — Whether to keep the current active organization active after creating a new one

- **`logo`**

  `string` — The logo of the organization

- **`metadata`**

  `string` — The metadata of the organization

- **`userId`**

  `string` — The user id of the organization creator. If not provided, the current user will be used. Should only be used by admins or when called by the server.

**Example:**

```
{
  "name": "",
  "slug": "",
  "userId": "",
  "logo": "",
  "metadata": "",
  "keepCurrentActiveOrganization": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`createdAt`**

  `date`

- **`id`**

  `string`

- **`logo`**

  `string`

- **`metadata`**

  `string`

- **`name`**

  `string`

- **`slug`**

  `string`

**Example:**

```
{
  "id": "",
  "name": "",
  "slug": "",
  "logo": "",
  "createdAt": null,
  "metadata": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/update

- **Method:** `POST`
- **Path:** `/organization/update`
- **Tags:** Organization

Update an organization

#### Request Body

##### Content-Type: application/json

- **`data` (required)**

  `object`

- **`organizationId`**

  `string`

**Example:**

```
{
  "data": {},
  "organizationId": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`createdAt`**

  `date`

- **`id`**

  `string`

- **`logo`**

  `string`

- **`metadata`**

  `string`

- **`name`**

  `string`

- **`slug`**

  `string`

**Example:**

```
{
  "id": "",
  "name": "",
  "slug": "",
  "logo": "",
  "createdAt": null,
  "metadata": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/delete

- **Method:** `POST`
- **Path:** `/organization/delete`
- **Tags:** Organization

Delete an organization

#### Request Body

##### Content-Type: application/json

- **`organizationId` (required)**

  `string` — The organization id to delete

**Example:**

```
{
  "organizationId": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

`string` — The organization id that was deleted

**Example:**

```
true
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/set-active

- **Method:** `POST`
- **Path:** `/organization/set-active`
- **Tags:** Organization

Set the active organization

#### Request Body

##### Content-Type: application/json

- **`organizationId`**

  `string` — The organization id to set as active. It can be null to unset the active organization

- **`organizationSlug`**

  `string` — The organization slug to set as active. It can be null to unset the active organization if organizationId is not provided

**Example:**

```
{
  "organizationId": "",
  "organizationSlug": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`createdAt`**

  `date`

- **`id`**

  `string`

- **`logo`**

  `string`

- **`metadata`**

  `string`

- **`name`**

  `string`

- **`slug`**

  `string`

**Example:**

```
{
  "id": "",
  "name": "",
  "slug": "",
  "logo": "",
  "createdAt": null,
  "metadata": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /organization/get-full-organization

- **Method:** `GET`
- **Path:** `/organization/get-full-organization`
- **Tags:** Organization

Get the full organization

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`createdAt`**

  `date`

- **`id`**

  `string`

- **`logo`**

  `string`

- **`metadata`**

  `string`

- **`name`**

  `string`

- **`slug`**

  `string`

**Example:**

```
{
  "id": "",
  "name": "",
  "slug": "",
  "logo": "",
  "createdAt": null,
  "metadata": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /organization/list

- **Method:** `GET`
- **Path:** `/organization/list`
- **Tags:** Organization

List all organizations

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

**Array of:**

- **`createdAt`**

  `date`

- **`id`**

  `string`

- **`logo`**

  `string`

- **`metadata`**

  `string`

- **`name`**

  `string`

- **`slug`**

  `string`

**Example:**

```
[
  {
    "id": "",
    "name": "",
    "slug": "",
    "logo": "",
    "createdAt": null,
    "metadata": ""
  }
]
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/invite-member

- **Method:** `POST`
- **Path:** `/organization/invite-member`
- **Tags:** Organization

Invite a user to an organization

#### Request Body

##### Content-Type: application/json

- **`email` (required)**

  `string` — The email address of the user to invite

- **`role` (required)**

  `string`

- **`organizationId`**

  `string` — The organization ID to invite the user to

- **`resend`**

  `string` — Resend the invitation email, if the user is already invited

- **`teamId`**

  `string` — The team ID to invite the user to

**Example:**

```
{
  "email": "",
  "role": "",
  "organizationId": "",
  "resend": "",
  "teamId": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`email` (required)**

  `string`

- **`expiresAt` (required)**

  `string`

- **`id` (required)**

  `string`

- **`inviterId` (required)**

  `string`

- **`organizationId` (required)**

  `string`

- **`role` (required)**

  `string`

- **`status` (required)**

  `string`

**Example:**

```
{
  "id": "",
  "email": "",
  "role": "",
  "organizationId": "",
  "inviterId": "",
  "status": "",
  "expiresAt": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/cancel-invitation

- **Method:** `POST`
- **Path:** `/organization/cancel-invitation`
- **Tags:** Organization

#### Request Body

##### Content-Type: application/json

- **`invitationId` (required)**

  `string` — The ID of the invitation to cancel

**Example:**

```
{
  "invitationId": ""
}
```

#### Responses

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/accept-invitation

- **Method:** `POST`
- **Path:** `/organization/accept-invitation`
- **Tags:** Organization

Accept an invitation to an organization

#### Request Body

##### Content-Type: application/json

- **`invitationId` (required)**

  `string` — The ID of the invitation to accept

**Example:**

```
{
  "invitationId": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`invitation`**

  `object`

- **`member`**

  `object`

**Example:**

```
{
  "invitation": {},
  "member": {}
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /organization/get-invitation

- **Method:** `GET`
- **Path:** `/organization/get-invitation`
- **Tags:** Organization

Get an invitation by ID

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`email` (required)**

  `string`

- **`expiresAt` (required)**

  `string`

- **`id` (required)**

  `string`

- **`inviterEmail` (required)**

  `string`

- **`inviterId` (required)**

  `string`

- **`organizationId` (required)**

  `string`

- **`organizationName` (required)**

  `string`

- **`organizationSlug` (required)**

  `string`

- **`role` (required)**

  `string`

- **`status` (required)**

  `string`

**Example:**

```
{
  "id": "",
  "email": "",
  "role": "",
  "organizationId": "",
  "inviterId": "",
  "status": "",
  "expiresAt": "",
  "organizationName": "",
  "organizationSlug": "",
  "inviterEmail": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/reject-invitation

- **Method:** `POST`
- **Path:** `/organization/reject-invitation`
- **Tags:** Organization

Reject an invitation to an organization

#### Request Body

##### Content-Type: application/json

- **`invitationId` (required)**

  `string` — The ID of the invitation to reject

**Example:**

```
{
  "invitationId": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`invitation`**

  `object`

- **`member`**

  `null`

**Example:**

```
{
  "invitation": {},
  "member": null
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/check-slug

- **Method:** `POST`
- **Path:** `/organization/check-slug`
- **Tags:** Organization

#### Request Body

##### Content-Type: application/json

- **`slug` (required)**

  `string`

**Example:**

```
{
  "slug": ""
}
```

#### Responses

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/remove-member

- **Method:** `POST`
- **Path:** `/organization/remove-member`
- **Tags:** Organization

Remove a member from an organization

#### Request Body

##### Content-Type: application/json

- **`memberIdOrEmail` (required)**

  `string` — The ID or email of the member to remove

- **`organizationId`**

  `string` — The ID of the organization to remove the member from. If not provided, the active organization will be used

**Example:**

```
{
  "memberIdOrEmail": "",
  "organizationId": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`member` (required)**

  `object`

  - **`id` (required)**

    `string`

  - **`organizationId` (required)**

    `string`

  - **`role` (required)**

    `string`

  - **`userId` (required)**

    `string`

**Example:**

```
{
  "member": {
    "id": "",
    "userId": "",
    "organizationId": "",
    "role": ""
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/update-member-role

- **Method:** `POST`
- **Path:** `/organization/update-member-role`
- **Tags:** Organization

Update the role of a member in an organization

#### Request Body

##### Content-Type: application/json

- **`memberId` (required)**

  `string`

- **`role` (required)**

  `string`

- **`organizationId`**

  `string`

**Example:**

```
{
  "role": "",
  "memberId": "",
  "organizationId": ""
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`member` (required)**

  `object`

  - **`id` (required)**

    `string`

  - **`organizationId` (required)**

    `string`

  - **`role` (required)**

    `string`

  - **`userId` (required)**

    `string`

**Example:**

```
{
  "member": {
    "id": "",
    "userId": "",
    "organizationId": "",
    "role": ""
  }
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /organization/get-active-member

- **Method:** `GET`
- **Path:** `/organization/get-active-member`
- **Tags:** Organization

Get the member details of the active organization

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`id` (required)**

  `string`

- **`organizationId` (required)**

  `string`

- **`role` (required)**

  `string`

- **`userId` (required)**

  `string`

**Example:**

```
{
  "id": "",
  "userId": "",
  "organizationId": "",
  "role": ""
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/leave

- **Method:** `POST`
- **Path:** `/organization/leave`
- **Tags:** Organization

#### Request Body

##### Content-Type: application/json

- **`organizationId` (required)**

  `string`

**Example:**

```
{
  "organizationId": ""
}
```

#### Responses

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### GET /organization/list-invitations

- **Method:** `GET`
- **Path:** `/organization/list-invitations`
- **Tags:** Organization

#### Responses

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

### POST /organization/has-permission

- **Method:** `POST`
- **Path:** `/organization/has-permission`
- **Tags:** Organization

Check if the user has permission

#### Request Body

##### Content-Type: application/json

- **`permissions` (required)**

  `object` — The permission to check

- **`permission`**

  `object` — The permission to check

**Example:**

```
{
  "permissions": {}
}
```

#### Responses

##### Status: 200 Success

###### Content-Type: application/json

- **`success` (required)**

  `boolean`

- **`error`**

  `string`

**Example:**

```
{
  "error": "",
  "success": true
}
```

##### Status: 400 Bad Request. Usually due to missing parameters, or invalid parameters.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 401 Unauthorized. Due to missing or invalid authentication.

###### Content-Type: application/json

- **`message` (required)**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 403 Forbidden. You do not have permission to access this resource or to perform this action.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 404 Not Found. The requested resource was not found.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 429 Too Many Requests. You have exceeded the rate limit. Try again later.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

##### Status: 500 Internal Server Error. This is a problem with the server that you cannot fix.

###### Content-Type: application/json

- **`message`**

  `string`

**Example:**

```
{
  "message": ""
}
```

## Schemas

### User

- **Type:**`object`

* **`banExpires`**

  `date`

* **`banned`**

  `boolean`

* **`banReason`**

  `string`

* **`createdAt`**

  `date`

* **`displayUsername`**

  `string`

* **`email`**

  `string`

* **`emailVerified`**

  `boolean`

* **`id`**

  `string`

* **`image`**

  `string`

* **`isAnonymous`**

  `boolean`

* **`name`**

  `string`

* **`phoneNumber`**

  `string`

* **`phoneNumberVerified`**

  `boolean`

* **`role`**

  `string`

* **`twoFactorEnabled`**

  `boolean`

* **`updatedAt`**

  `date`

* **`username`**

  `string`

**Example:**

```
{
  "id": "",
  "name": "",
  "email": "",
  "emailVerified": true,
  "image": "",
  "createdAt": null,
  "updatedAt": null,
  "twoFactorEnabled": true,
  "username": "",
  "displayUsername": "",
  "isAnonymous": true,
  "phoneNumber": "",
  "phoneNumberVerified": true,
  "role": "",
  "banned": true,
  "banReason": "",
  "banExpires": null
}
```

### Session

- **Type:**`object`

* **`activeOrganizationId`**

  `string`

* **`createdAt`**

  `date`

* **`expiresAt`**

  `date`

* **`id`**

  `string`

* **`impersonatedBy`**

  `string`

* **`ipAddress`**

  `string`

* **`token`**

  `string`

* **`updatedAt`**

  `date`

* **`userAgent`**

  `string`

* **`userId`**

  `string`

**Example:**

```
{
  "id": "",
  "expiresAt": null,
  "token": "",
  "createdAt": null,
  "updatedAt": null,
  "ipAddress": "",
  "userAgent": "",
  "userId": "",
  "impersonatedBy": "",
  "activeOrganizationId": ""
}
```

### Account

- **Type:**`object`

* **`accessToken`**

  `string`

* **`accessTokenExpiresAt`**

  `date`

* **`accountId`**

  `string`

* **`createdAt`**

  `date`

* **`id`**

  `string`

* **`idToken`**

  `string`

* **`password`**

  `string`

* **`providerId`**

  `string`

* **`refreshToken`**

  `string`

* **`refreshTokenExpiresAt`**

  `date`

* **`scope`**

  `string`

* **`updatedAt`**

  `date`

* **`userId`**

  `string`

**Example:**

```
{
  "id": "",
  "accountId": "",
  "providerId": "",
  "userId": "",
  "accessToken": "",
  "refreshToken": "",
  "idToken": "",
  "accessTokenExpiresAt": null,
  "refreshTokenExpiresAt": null,
  "scope": "",
  "password": "",
  "createdAt": null,
  "updatedAt": null
}
```

### Verification

- **Type:**`object`

* **`createdAt`**

  `date`

* **`expiresAt`**

  `date`

* **`id`**

  `string`

* **`identifier`**

  `string`

* **`updatedAt`**

  `date`

* **`value`**

  `string`

**Example:**

```
{
  "id": "",
  "identifier": "",
  "value": "",
  "expiresAt": null,
  "createdAt": null,
  "updatedAt": null
}
```

### TwoFactor

- **Type:**`object`

* **`backupCodes`**

  `string`

* **`id`**

  `string`

* **`secret`**

  `string`

* **`userId`**

  `string`

**Example:**

```
{
  "id": "",
  "secret": "",
  "backupCodes": "",
  "userId": ""
}
```

### Organization

- **Type:**`object`

* **`createdAt`**

  `date`

* **`id`**

  `string`

* **`logo`**

  `string`

* **`metadata`**

  `string`

* **`name`**

  `string`

* **`slug`**

  `string`

**Example:**

```
{
  "id": "",
  "name": "",
  "slug": "",
  "logo": "",
  "createdAt": null,
  "metadata": ""
}
```

### Member

- **Type:**`object`

* **`createdAt`**

  `date`

* **`id`**

  `string`

* **`organizationId`**

  `string`

* **`role`**

  `string`

* **`userId`**

  `string`

**Example:**

```
{
  "id": "",
  "organizationId": "",
  "userId": "",
  "role": "",
  "createdAt": null
}
```

### Invitation

- **Type:**`object`

* **`email`**

  `string`

* **`expiresAt`**

  `date`

* **`id`**

  `string`

* **`inviterId`**

  `string`

* **`organizationId`**

  `string`

* **`role`**

  `string`

* **`status`**

  `string`

**Example:**

```
{
  "id": "",
  "organizationId": "",
  "email": "",
  "role": "",
  "status": "",
  "expiresAt": null,
  "inviterId": ""
}
```
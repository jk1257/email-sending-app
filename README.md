
# Email Sending Appl




Simple sending system with an API for users to send emails efficiently. Emails are managed through a task queue for optimized performance. The Next.js frontend provides a dashboard for users to view and filter analytics on sent emails by day, week, or month.

Backend: NestJS, BullMQ, Sendgrid, Postgres, and Prisma

Frontend: NextJS
## External Documentation


- [BullMQ ](https://docs.bullmq.io/) 
- [Sendgrid ](https://www.twilio.com/docs/sendgrid/api-reference) 
- [Prisma ](https://www.prisma.io/docs/) 
- [Shadcn ](https://ui.shadcn.com/docs) 


## API Reference



### Send Email to Recipient

#### POST /send
```http
  POST /email/send
```

This endpoint queues an email to be sent.

#### Request

- **URL**: `/send`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Body** (JSON):
  - `email` (string, required): The recipient's email address.
  - `subject` (string, required): The subject of the email.
  - `body` (string, required): The body content of the email.

**Example Request**:
```json
{
  "email": "recipient@example.com",
  "subject": "Hello World",
  "body": "This is the body of the email."
}
```

**Example Response**:

- **Status**: `200 OK`
- **Body** (JSON):
```json
{
  "message": "Email queued successfully"
}

```




### Get Emails by Recipient

#### GET /messages
```http
  GET /email/messages{recipient}
```

This endpoint retrieves emails for a specific recipient.

#### Request

- **URL**: `/messages`
- **Method**: `GET`
- **Headers**:
  - `Content-Type: application/json`
- **Query Parameters**:
  - `recipient` (string, required): The recipient's email address.

**Example Request**:




#### Response

- **Status**: `200 OK`
- **Body** (JSON):
  - `emails` (array): A list of emails sent to the specified recipient.

**Example Response**:
```json
[ {   "id": 1,    "email": "recipient@example.com",    "subject": "Hello World",    "body": "This is the body of the email.",    "status": "sent",    "createdAt": "2023-07-01T12:34:56.789Z"  },  {    "id": 2,    "email": "recipient@example.com",    "subject": "Another Email",    "body": "This is another email body.",    "status": "sent",    "createdAt": "2023-07-02T12:34:56.789Z"  }]
```


### Get Emails Statistics for Analytics Dashboard
```http
  GET /email/statistics
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| null      | null | Returns status, timestamp for all emails in DB


## Run Locally

### Prerequisites
Sendgrid account with verified email address

Redis installed locally

PostgreSQL running locally




### Running backend server

#### Setting up environment variables .env file
``` JSON
DATABASE_URL={Postgresql url}
SENDGRID_API_KEY={Sendgrid API key for verified email}
EMAIL_USER={Sendgrid verified email address}
REDIS_HOST={Redis Host}
REDIS_PORT={Port}
``` 
#### Start backend server
```bash
  cd backend
  npm install
  npx prisma generate
  npx prisma db push
  redis-server
  npm run start
```

### Running frontend server

#### Setting up environment variables .env file
``` JSON
NEXT_PUBLIC_SEND_EMAIL_URL={Post url to send email}
NEXT_PUBLIC_EMAIL_STATS_URL={Get url to query analytics data}
``` 

#### Start frontend server

```bash
  cd frontend
  npm install
  npm run dev
```



## Features

- **Sending Emails**: To send an email, click on the navigation bar and fill out the email form.
- **Analytics Dashboard**: Select dashboard from navigation menu to display statistics and metrics on sent emails

- **Filtering**: Interact with the dashboard by selecting filters for day, week, or month to view relevant email statistics.



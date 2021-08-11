# xplorit

NOTE: This project was developed as part of [turnerhacks 2021](https://turnerhacks2021.devpost.com/).

xplorit is a fun [geocaching-like](https://en.wikipedia.org/wiki/Geocaching) game designed to promote exploration and exercise.

## Usage

First, ensure that ssl/privkey.pem, and ssl/fullchain.pem files are present (you can use [letsencrypt](https://letsencrypt.org/) for free ssl certs).

```bash
npm i
node index.js
```

And you're done! The app is now running on port 443.

# Deploy a static website on AWS S3

Creates or updates an s3 bucket configured as a public website.

Assumes you've already logged in to the AWS CLI. (If you are figuring this out for the first time,
would you consider posting a GitHub issue or making a pull request for a README update describing
what you had to do to get things set up? Maybe a link to relevant AWS docs?)

## Usage

Install

```
npm install --save-dev s3-static-website-deploy
```

Add to your package.json

```
   "scripts": {
     "deploy": "s3-static-website-deploy --domain your-domain.com --region your-closest-AWS-region"
   }
```

Put something in the `./html` directory

`npm run deploy`

## CLI

```
s3-static-website-deploy --domain example.com --region ca-central-1

Options:
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  --domain         domain name -- will be used as the s3 bucket name
  --region, -r     AWS region
  --directory, -d  local directory containing static site files[default: "html"]
  --dry-run        won't deploy anything                        [default: false]
```

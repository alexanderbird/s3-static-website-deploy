#!/usr/bin/env node
const config = require('yargs')
  .usage('$0 --domain example.com --region ca-central-1')
  .option('domain', {
    description: 'domain name -- will be used as the s3 bucket name',
  })
  .option('region', {
    description: 'AWS region',
    alias: 'r',
  })
  .option('directory', {
    description: 'local directory containing static site files',
    alias: 'd',
    default: 'html',
  })
  .option('dry-run', {
    description: "won't deploy anything",
    default: false,
  }).argv;

const deploy = require('../index.js');

deploy(config);

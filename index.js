const awsCli = require('aws-cli-js');
const aws = new awsCli.Aws(awsCli.Options);
const bucketPolicy = require('./s3_bucket_policy');

module.exports = config => {
  console.log(
    `Deploying from ./${config.directory} to Amazon Web Services S3 Bucket ${
      config.domain
    } in the ${config.region} region`,
  );
  if (config.dryRun) {
    return;
  }

  // Unfortunately, aws-cli-js writes to `console.error` when there is an error. Suppress it.
  let error = console.error;
  console.error = () => {};
  aws
    .command(`s3api get-bucket-location --bucket "${config.domain}"`)
    .then()
    .catch(() => {
      // The bucket doesn't exist; create it
      return aws.command(
        `s3 mb "s3://${config.domain}" --region ${config.region}`,
      );
    })
    .then(() => {
      // Configure bucket as a website
      return aws.command(
        `s3 website "s3://${
          config.domain
        }" --index-document index.html --region ${config.region}`,
      );
    })
    .then(() => {
      // Set bucket policy
      let policy = JSON.stringify(bucketPolicy).replace(
        /{{bucket}}/g,
        config.domain,
      );
      policy = policy.replace(/"/g, '\\"');
      return aws.command(
        `s3api put-bucket-policy --bucket "${
          config.domain
        }" --policy "${policy}" --region ${config.region}`,
      );
    })
    .then(() => {
      // Set all files without an extension to text/html file type
      return aws.command(
        `s3 sync ./${config.directory}/ "s3://${config.domain}" --region ${
          config.region
        } --content-type "text/plain" --exclude "*.*"`,
      );
    })
    .then(() => {
      // Sync the rest, deleting any unused files
      return aws.command(
        `s3 sync ./${config.directory}/ "s3://${config.domain}" --region ${
          config.region
        } --delete`,
      );
    })
    .then(() => {
      console.log(`http://${config.domain}.s3.${config.region}.amazonaws.com`);
    })
    .catch(error);
};

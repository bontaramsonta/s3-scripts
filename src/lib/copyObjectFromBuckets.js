import {
    S3Client,
    ListObjectsV2Command,
    CopyObjectCommand,
} from '@aws-sdk/client-s3'

async function copyObjectFromBuckets(sourceBucketName, destinationBucketName) {
    const SOURCE_REGION = 'ap-south-1'
    const SOURCE_BUCKET = sourceBucketName

    const DESTINATION_REGION = 'ap-south-1'
    const DESTINATION_BUCKET = destinationBucketName

    const sourceClient = new S3Client({
        region: SOURCE_REGION,
        endpoint: `https://s3.${SOURCE_REGION}.amazonaws.com`,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        },
    })

    const listCommand = new ListObjectsV2Command({
        Bucket: SOURCE_BUCKET,
    })

    const listOfObjects = await sourceClient.send(listCommand)

    listOfObjects.Contents.forEach(async (object) => {
        // Create an S3 client with the region of the destination bucket
        const destinationClient = new S3Client({
            region: DESTINATION_REGION,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_KEY,
            },
            endpoint: `https://s3.${DESTINATION_REGION}.amazonaws.com`,
        })

        // Create a CopyObjectCommand to copy the object
        const command = new CopyObjectCommand({
            CopySource: `/${SOURCE_BUCKET}/${object.Key}`,
            Bucket: DESTINATION_BUCKET,
            Key: object.Key,
            ACL: 'public-read',
        })

        try {
            // Execute the command to copy the object
            const response = await destinationClient.send(command)
            console.log('Object copied:', response)
        } catch (err) {
            console.error('Error copying object:', err)
        }
    })
}

export default copyObjectFromBuckets

import {
    S3Client,
    ListObjectsV2Command,
    GetObjectCommand,
    PutObjectCommand,
} from '@aws-sdk/client-s3'
import { createReadStream } from 'node:fs'
async function copyObjectFromBuckets(sourceBucketName, destinationBucketName) {
    const srcClient = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        },
    })
    const destClient = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        },
    })
    const listCommand = new ListObjectsV2Command({
        Bucket: sourceBucketName,
        MaxKeys: 5,
    })

    const listOfObjects = await srcClient.send(listCommand)
    console.log(listOfObjects)
    listOfObjects.Contents.forEach(async (object, index) => {
        try {
            // get full object
            const getObjectCommand = new GetObjectCommand({
                Bucket: sourceBucketName,
                Key: object.Key,
            })
            const completeObject = await srcClient.send(getObjectCommand)
            console.log(
                `[object ${index}]`,
                object.Key,
                completeObject.ContentType
            )
            const readStream = completeObject.Body.transformToWebStream()
            const command = new PutObjectCommand({
                Bucket: destinationBucketName,
                Key: object.Key,
                ACL: 'public-read',
                Body: readStream,
                ContentType: completeObject.ContentType,
            })

            const result = await destClient.send(command)
            if (result.$metadata.httpStatusCode == 200)
                console.log('[writen to dest]', object.Key)
        } catch (error) {
            console.log({ object, error })
        }
    })
    srcClient.destroy()
}

export default copyObjectFromBuckets

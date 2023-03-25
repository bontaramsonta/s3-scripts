import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

async function listAllS3Objects(bucketName) {
    const s3Client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        },
    })

    let objects = []

    let listParams = {
        Bucket: bucketName,
    }

    do {
        const listResponse = await s3Client.send(
            new ListObjectsV2Command(listParams)
        )
        objects = objects.concat(listResponse.Contents)

        listParams.ContinuationToken = listResponse.NextContinuationToken
    } while (listParams.ContinuationToken)

    s3Client.destroy()
    return objects
}

export default listAllS3Objects

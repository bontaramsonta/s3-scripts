import {
    S3Client,
    CopyObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'

async function renameS3ObjectKey({ bucketName, oldKey, newKey }) {
    const results = []

    const client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        },
    })

    const copyParams = {
        Bucket: bucketName,
        CopySource: `/${bucketName}/${oldKey}`,
        Key: newKey,
        ACL: 'public-read',
    }

    results.push(await client.send(new CopyObjectCommand(copyParams)))

    const deleteParams = {
        Bucket: bucketName,
        Key: oldKey,
    }

    results.push(await client.send(new DeleteObjectCommand(deleteParams)))

    client.destroy()
    return results
}

export default renameS3ObjectKey

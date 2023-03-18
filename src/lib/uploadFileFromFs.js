import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createReadStream } from 'node:fs'
import { AllowedFileTypeMap } from '../../utils'
async function uploadFileFromFs(path) {
    const client = new S3Client({
        region: 'ap-south-1',
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_KEY,
        },
    })

    const image = createReadStream(path)
    const pathArray = path.split('/')
    const filename = pathArray[pathArray.length - 1]
    const ext = filename.split('.')[1]
    if (!AllowedFileTypeMap[ext]) return false
    const command = new PutObjectCommand({
        Bucket: 'hrabdui',
        Key: filename,
        ACL: 'public-read',
        Body: image,
        ContentType: AllowedFileTypeMap[ext].mimetype,
    })

    const result = await client.send(command)
    console.log('[upload file from fs]', result)
    return result
}

export default uploadFileFromFs

import 'dotenv/config'
// rename object keys with given prefix to new_prefix
// { old_key_prefix : new_key_prefix }
import renameMap from '../.data/cleaned_rename_map.json' assert { type: 'json' }
import listAllS3Objects from './lib/listAllObjects.js'
import renameS3ObjectKey from './lib/renameObject.js'

const BUCKET_NAME = process.env.BUCKET_NAME

const objects = await listAllS3Objects(BUCKET_NAME)

for (let [oldKeyPrefix, newKeyPrefix] of Object.entries(renameMap)) {
    oldKeyPrefix = `/${oldKeyPrefix}_`
    newKeyPrefix = `/${newKeyPrefix}_`
    const objectsToRename = objects
        .filter((s3Obj) => s3Obj.Key.includes(oldKeyPrefix))
        .map((s3Obj) => ({
            oldKey: s3Obj.Key,
            newKey: s3Obj.Key.replace(oldKeyPrefix, newKeyPrefix),
        }))
    for (const { oldKey, newKey } of objectsToRename) {
        try {
            console.log('[x]', oldKey, newKey)
            const results = await renameS3ObjectKey({
                bucketName: BUCKET_NAME,
                oldKey,
                newKey,
            })
            console.log(results)
        } catch (error) {
            console.log({ newKey, oldKey, error })
        }
    }
}

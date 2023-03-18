import 'dotenv/config'
// import uploadFileFromFs from "./lib/uploadFileFromFs";
import copyObjectFromBuckets from './lib/copyObjectFromBuckets.js'

// await uploadFileFromFs("./buddha1.png");
await copyObjectFromBuckets('bala-trs', 'hrabdui')

import mongoose from 'mongoose';
import Paper from './backend/src/models/Paper';

mongoose.connect('mongodb://localhost:27017/orchids').then(async () => {
  const p = await Paper.findOne({ "authorCertificates.0": { $exists: true } }).sort({updatedAt: -1});
  if (p) {
    console.log(JSON.stringify(p.authorCertificates, null, 2));
  } else {
    console.log("No papers found with authorCertificates");
  }
  process.exit(0);
});

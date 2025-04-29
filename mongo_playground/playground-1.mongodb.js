// First count how many records will be affected
db.histories.countDocuments({ modelName: "User" })

// Then view a sample of what will be deleted
db.histories.find({ modelName: "User" }).limit(5)

// Finally proceed with deletion when confident
db.histories.deleteMany({ modelName: "User" })
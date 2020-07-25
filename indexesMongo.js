//---- Explain method : Works for find update delete

db.contacts.explain('executionStats').find({'dob.age': {$gt: 60}})

////////////////////////////////////////////
//---- Creating Index & Dropping Index----//
///////////////////////////////////////////

//---- Creating Index
db.contacts.createIndex({"dob.age": 1}) // 1 for ascending -1 for descending

//---- Creating compound Indexes
db.contacts.createIndex({'dob.age': 1, gender: 1}) // creates index pairs

//---- Creating Unique Indexes for some field to avoid duplicates
db.contacts.createIndex({email: 1}, {unique: true})

//---- Partial Indexes whereever nessecery
//---- Only apply index to those who are greater than 60 yrs age
db.contacts.createIndex({'dob.age': 1}, {partialFilterExpression: {'dob.age': {$gt: 60}}})

//---- Time To Live Index
//---- Works only on date index 
db.contacts.createIndex({createdAt: 1}, {expireAfterSeconds: 10})


//---- Text Indexes
//---- Pretty expensive buy very fast . Can have only one text index in a doc
//---- Creates an array with all keywords
db.productts.createIndex({description: "text"})

//---- Text Index for 2 fields or compound Index
db.productts.createIndex({title: "text", description: "text"})

//---- Create Index in background
db.productts.createIndex({title: "text", description: "text"}, {background: true})


//---- Droping Index
db.contacts.dropIndex({"dob.age": 1}) // 1 for ascending -1 for descending

//---- Droping Text Index
db.contacts.dropIndex("description_text") // can't do by {description: 'text'}



/////////////////////////////////////////////////
//---- Change text inded default Language ----//
///////////////////////////////////////////////

db.productts.createIndex({title: "text", description: "text"}, {default_language: "german", weights: {title: 1, description: 10}})



/////////////////////////////////
//---- Indexes for Sorting ----//
/////////////////////////////////

//---- Indexes are used for sorting because we already have sorted list
//---- Since mongoDb have limited memory 32MB for sorting index scan is efficient
db.contacts.find({'dob.age': {$eq: 35}}).sort({gender: 1})



/////////////////////////////////
//---- Own Unique Index ----//
/////////////////////////////////

////////////////////
//---- Notes ----//
////////////////////
/*
 -  Indexes can only help if you are fetching small data than the whole collection
 -  Indexes can't be added in _id . It is fetched in no time 
 -  Indexes are use for sorting. Cause we have already have a sorted list 
     ObjectId("5ea5c8dc6ffe2d52ca4f40e5")
*/
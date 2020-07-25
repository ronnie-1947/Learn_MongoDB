//////////////////////////////////
////---- Update Many Data ----////
/////////////////////////////////

//---- update Every document and set marker to true
db.flightData.updateMany(
    {},
    { $set: { marker: true } }
)



//////////////////////////////////
////---- Update One Data ----////
/////////////////////////////////

//---- update Single document and set delayed to true
db.persons.updateOne(
    { _id: ObjectId("5ea02b27dfc2f37b89a7fb18") },
    { $set: { age: 21, phone: 234234234 } }
)

//---- Increment data
db.persons.updateOne(
    { _id: ObjectId("5ea02b27dfc2f37b89a7fb18") },
    { $inc: { age: 2 }, $inc: { weight: -2 }, $set: { isMarried: true } }
)

//---- Insert min max or mul value
db.persons.updateOne(
    { _id: ObjectId("5ea02b27dfc2f37b89a7fb18") },
    { $min: { age: 20 }, $max: { weight: 50 }, $mul: { height: 2 } }
)

//---- Getting Rid of fields
db.persons.updateOne(
    { name: 'Anna' },
    { $unset: { phone: true } }
)

//--- Rename Fields
db.persons.updateOne(
    { name: 'Anna' },
    { $rename: { age: 'totalAge' } }
)

//---- Upsert command gives entry to collection if not available
db.persons.updateOne(
    { name: 'Maria' },
    {
        $set: {
            age: 22,
            hobbies: [
                {
                    title: 'Hiking',
                    frequency: 4
                }
            ]
        }
    },
    { upsert: true }
)


//////////////////////////////////
////---- Updating Arrays ----////
/////////////////////////////////

//---- Updating single doc inside Arrays ... In many documents in a collection
db.persons.updateMany(
    { 
        hobbies: { 
            $elemMatch: { 
                title: 'Sports', 
                frequency: { 
                    $gte: 3 
                } 
            } 
        } 
    }, 
    { $set: { 
        'hobbies.$.isSporty': true
    } 
})


//---- Updating a single doc inside Arrays... In a single document in a collection
db.persons.updateOne(
    {
        $and: [
            {
                name: 'Annnnna'
            },
            {
                hobbies: {
                    $elemMatch: {
                        frequency: 4
                    }
                }
            }
        ]
    },
    {
        $set: {
            'hobbies.$.title': 'Sports',
            'hobbies.$.frequency': 5,
            name: 'Max'
        }
    }
    
)


//---- Updating all Embedded documents in an Array
db.persons.updateOne(
    {
        $and: [
            {
                name: 'Max'
            }
        ]
    },
    {
        $set: {
            'hobbies.$[].isCool': true,
            'hobbies.$[].isbest': true,
        }
    }
    
)

//---- Update specific fields using arrayFilters
db.persons.updateMany(
    {
        'hobbies.frequency': {$gt: 3}
    },
    {
        $set: {
            'hobbies.$[el].goodFrequency': true
        }
    },
    {
        arrayFilters: [
            {
                'el.frequency': {$gt: 2}
            }
        ]
    }
)


//---- Add new document to Array with push
db.persons.updateOne(
    {
        name: 'Maria'
    },
    {
        $push: {
            hobbies: {
                title: 'Sports',
                frequency: 2
            }
        }
    }
)
db.persons.updateOne(
    {
        name: 'Maria'
    },
    {
        $push: {
            hobbies: {
                $each: [ // push each doc inside it
                    {
                        title: 'Good Wine',
                        frequency: 1
                    },
                    {
                        title: 'Hiking',
                        frequency: 3
                    }
                ],
                $slice: 1, // push only the first doc
                $sort: {frequency: -1}, // sort the docs according to condition
            }
        }
    }
)

//---- Add new document to Array with addToSet
//---- AddToSet don't create duplicates
db.persons.updateOne(
    {
        name: 'Maria'
    },
    {
        $addToSet: {
            hobbies: {
                $each: [ // push each doc inside it
                    {
                        title: 'Good Wine',
                        frequency: 1
                    },
                    {
                        title: 'Hiking',
                        frequency: 3
                    }
                ],
                $slice: 1, // push only the first doc
                $sort: {frequency: -1}, // sort the docs according to condition
            }
        }
    }
)


//---- Remove a  doc from Array using $pull
db.persons.updateOne(
    {name: 'Maria'},
    {
        $pull: {
            hobbies: {
                title: 'Cooking'
            }
        }
    }
)


//---- Remove first or last doc from Array using $pop
db.persons.updateOne(
    {name: 'Maria'},
    {
        $pop: {
            hobbies: 1  // removes last element from hobbies array
        }
    }
)
db.persons.updateOne(
    {name: 'Maria'},
    {
        $pop: {
            hobbies: -1  // removes first element from hobbies array
        }
    }
)

//////////////////////////////////
////---- Using Replace ----////
/////////////////////////////////

//---- Using replace , replaces the whole data
db.flightData.replaceOne(
    { _id: ObjectId("5ea02b27dfc2f37b89a7fb18") },
    { Noflight: 'This flight is destroyed' }
)



//////////////////////////////////
////---- Using Update ----////
/////////////////////////////////

//---- Using update instead of updateOne or updateMany
// Behaviour is simillar as Replace
db.flightData.update(
    { _id: ObjectId("5ea02b27dfc2f37b89a7fb18") },
    { flight: 'This flight is destroyed' }
)


/////////////////////////////////////////////////
//----- Insert -----//
////////////////////////////////////////////////

db.flightData.insertMany([
    {
        departureAirport: "MUC",
        arrivalAirport: "SFO",
        aircraft: "Airbus A380",
        distance: 12000,
        intercontinental: true
    },
    {
        departureAirport: "LHR", 
        arrivalAirport: "TXL",
        aircraft: "Airbus A320",
        distance: 950,
        intercontinental: false
    }
])

db.persons.insertMany(
    [
        {
            name: 'Michael', age:22
        }, 
    ],
    {
        ordered: true , // writes in the database one doc after one doc
        writeConcern: {
            w: 1, // write concern
            j: true, // write a log file in inserting . Little bit slow but safe
            wtimeout: 200
        }
    }
)




/////////////////////////////////////////////////
//----- Creating Schema and Add Validation -----//
////////////////////////////////////////////////

db.createCollection('posts', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'text', 'creator'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'Must be a string and is required',
                },
                text:{
                    bsonType: 'string',
                    description: 'Must be a string and is required',
                },
                comments: {
                    bsonType: 'array',
                    description: 'must be an array and is required',
                    items: {
                        bsonType: 'object',
                        required: ['text', 'author'],
                        properties: {
                            text: {
                                bsonType: 'string',
                                description: 'Must be a string and is required'
                            },
                            author: {
                                bsonType: 'objectId',
                                description: 'must be an objectid and is required'
                            }
                        }
                    }
                }
            }
        }
    }
})


/////////////////////////////////////////////////
//----- Changing the Validation-----//
////////////////////////////////////////////////

db.runCommand({
    collMod: 'posts',
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['title', 'text', 'creator'],
            properties: {
                title: {
                    bsonType: 'string',
                    description: 'Must be a string and is required',
                },
                text:{
                    bsonType: 'string',
                    description: 'Must be a string and is required',
                },
                comments: {
                    bsonType: 'array',
                    description: 'must be an array and is required',
                    items: {
                        bsonType: 'object',
                        required: ['text', 'author'],
                        properties: {
                            text: {
                                bsonType: 'string',
                                description: 'Must be a string and is required'
                            },
                            author: {
                                bsonType: 'objectId',
                                description: 'must be an objectid and is required'
                            }
                        }
                    }
                }
            }
        }
    },
    validationAction: 'warn'
})

/////////////////////////////////////////////////
//----- Import document from a json file -----//
////////////////////////////////////////////////

//****  command: mongoimport <fileName> -d <databaseName> -c <collectionName> --jsonArray --drop

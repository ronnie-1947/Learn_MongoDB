// Aggregation framework is alternative to find Method . More flexible and powerful

// $match
db.analytics.aggregate(
    [
        {
            $match: {
                gender: 'female'
            }
        }
    ]
)

// $group
db.analytics.aggregate(
    [
        {$match: {gender: 'female'}},
        {
            $group: {
                _id: {
                    state: '$location.state'
                },
                totalPersons: {
                    $sum: 1
                }
            }
        }
    ]
)

// $sort
db.analytics.aggregate(
    [
        {$match: {gender: 'female'}},
        {$group: {_id: {state: '$location.state'}, totalPersons: {$sum: 1}}},
        {
            $sort: {
                totalPersons: -1
            }
        }

    ]
)


// $project
db.analytics.aggregate(
    [
        {
            $project: {
                _id: 0,
                gender: 1,
                fullName: {
                    // $concat: ['$name.first' ,' ' , '$name.last'],
                    $concat: [{$toUpper: '$name.first'} ,' ' , {$toUpper: '$name.last'}]
                },
                location: {
                    type: 'Point',
                    coordinates: [
                        {$convert: {input: '$location.coordinates.longitude', to: 'double', onError: 0, onNull: 0}}, 
                        {$convert: {input: '$location.coordinates.latitude', to: 'double', onError: 0, onNull: 0}}, 
                    ]
                },
                birthdate: {
                   $toDate: '$dob.date' // Using shortcut for converting date
                },
                birthYear: {
                    $isoWeekYear: {$toDate: '$dob.date'} // Get only the year from date
                },
                age: '$dob.age',
                email: 1
            }
        }
    ]
).pretty()


//////////////////////////////////
////---- Arrays are Here ----////
////////////////////////////////

db.friends.aggregate(
    [
        {
            $group: {
                _id: {
                    age: '$age'
                },
                allHobbies: {
                    $push: '$name' // make a new array and fill $hobbies from group
                }
            }
        }
    ]
).pretty()

//---- Using unWind opens up an array
//---- To remove duplicates use $addToSet instead of $push
db.friends.aggregate(
    {
        $unwind: '$hobbies' // opens up hobbies array
    },
    {
        $group: {
            _id: '$age',
            allHobbies: {
                $addToSet: '$hobbies'
            },
            allNames: {$addToSet: '$name'}
        }
    }
)

//---- Projection with Array
//---- Slice takes up an array, first item is the Array, 2nd is starting index, 3rd is total items
db.friends.aggregate(
    {
        $project: {
            _id: 0,
            examScore: {$slice: ['$examScores', 1, 2]}, // project 2 scores
            AllexamScore: '$examScores',
            ScoreHSixty: {$filter: {
                input: "$examScores", as: 'sc', cond: {$gt: ['$$sc.score', 60]}
            }},
            examsTaken: {$size: '$examScores'}, // seze of the array
            hobbies: 1
        }
    }
).pretty()

//---- Multiple operations on Array
db.friends.aggregate(
    {
        $unwind: '$examScores'
    },
    {
        $group: {
            _id: '$_id',
            name: {$first: '$name'}, // print anything in group
            maxScore: {$max: '$examScores.score'}
        }
    },
    {
        $sort: {maxScore: -1}
    }
)


//---- $bucket manual boundaries
db.analytics.aggregate(
    [
        {
            $bucket: { 
                groupBy: '$dob.age',
                boundaries: [0, 18, 30, 50, 80, 120],
                output: {
                    numPersons: {$sum: 1},
                    averageAge: {$avg: '$dob.age'},
                }
            }
        }
    ]
).pretty()

//---- $bucket auto boundaries
db.analytics.aggregate(
    [
        {
            $bucketAuto: { 
                groupBy: '$dob.age',
                buckets: 5,
                output: {
                    numPersons: {$sum: 1},
                    averageAge: {$avg: '$dob.age'},
                }
            }
        }
    ]
).pretty()


////////////////////////////////////////////
////---- Store Aggregation results ----////
//////////////////////////////////////////
db.analytics.aggregate(
    [
        {
            $bucketAuto: { 
                groupBy: '$dob.age',
                buckets: 5,
                output: {
                    numPersons: {$sum: 1},
                    averageAge: {$avg: '$dob.age'},
                }
            }
        },
        {$out: "OutputResultCollection"}
    ]
)


///////////////////////////
////---- $geonear ----////
/////////////////////////

//---- Find all the persons near you

db.OutputResultCollection.aggregate(
    [
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: []
                },
                maxDistance: 1000000,
                num: 10, // limit the amount of data retrive
                query: {age: { $gt: 30}}, // condition to be matched
                distanceField: 'distance' // Give the distance far from the point
            }
        }
    ]
)
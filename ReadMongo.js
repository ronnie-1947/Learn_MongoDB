
//////////////////////////////
////---- Read All Docs----////
/////////////////////////////

//---- Read first 20 docs
db.passengers.find().pretty()

//---- Read all and convert to array
db.passengers.find().toArray()

//---- Loop over and read all document
db.passengers.find().forEach(element => {
    printjson(element)
});



//////////////////////////////////
////---- Read Certain Docs----////
/////////////////////////////////

//--------//
db.flightData.findOne({ distance: 12000 }) // Display first doc with the matching condition

//--------//
db.flightData.find({ intercontinental: true }).pretty()

//-------- Using comparator operators such as gt 
db.flightData.find({ distance: { $gt: 10000 } }).pretty()
db.persons.find({age: {$ne:42}})
db.persons.find({age: {$eq:42}})

//---- To query nested data
db.flightData.find({ "status.ontime.responsibility": "Ronny" })

//---- $in and $nin
db.movies.find({runtime: {$in: [30, 42]}}) // Present all values where runtime = 30 or 42
db.movies.find({runtime: {$nin: [30, 42]}}) // Present all values where runtime != 30 or 42



//////////////////////////////////
////---- Logical Operators----///
////////////////////////////////

//---- $or
db.movies.find({$or: [{runtime: 60}, {runtime: 40}]}) // Display either of given conditions
db.movies.find({$nor: [{runtime: 60}, {runtime: 40}]}) // Display neither of given conditions

//---- $and
db.movies.find({$and: [{"rating.average" : {$gte: 9}} , {genres: 'Horror'}]}) 



///////////////////////////////////
////---- Element Operators----////
/////////////////////////////////

//---- $exist and $type
db.persons.find({age: {$exists: true, $type: 'number'}}) 

//---- $expr **** Need more experience here
db.sales.find({$expr: {$gt: ['$volume', '$target']}}) // find all whose volume > target


//////////////////////////////////////
////---- Evaluation Operators----////
////////////////////////////////////

//---- $Regex
db.persons.find({name: {$regex: /Mi/ } })

//---- $Expression
db.sales.find({$expr: {$gt: ['$volume', '$target']}}).pretty() // used to dig within a document

 

//////////////////////////////////////
////---- Text Index Search----////
////////////////////////////////////

//---- To search Text Index
db.products.find({$text: {$search: 'book'}})

//---- Search text where certain words are excluded
db.products.find({$text: {$search: 'awesome -book'}}) // '-' sign cancels out book 


//////////////////////////////////
////---- Querying Arrays----////
/////////////////////////////////


//---- Filter an array
db.movies.find({genre: 'horror'}) // See if horror is present in genre array
db.movies.find({genre: ['horror', 'thriller']}) // See which doc have exact match of the array

//---- Querying objects embedded in arrays
db.persons.find({'hobbies.title': 'swimming'})

//---- Querying where array.length = 2
db.persons.find({hobbies: {$size: 2}})

//---- Querying where elements are equal to elements in Array
db.tvShows.find({genre: {$all: ['horror', 'thriller']}})

//--- Find docs in array where the condit1ions matches 
db.persons.find({hobbies: {$elemMatch: {title: 'swimming', frequency: {$gte: 2}}}})



///////////////////////////////////
///////---- Projection ----///////
/////////////////////////////////

//--- Filter the document and present specific data
db.persons.find({}, { _id: 0, name: 1 , 'hobbies.title': 1})

//--- Projection on array
db.movies.find({genres: 'Drama'}, {"genres.$": 1})
db.movies.find({genres: 'Drama'}, {genres: {$elemMatch: {$eq: 'Horror'}}}) // Project where horror is present

//--- Array Slice
//- Show only one genre in the array
db.movies.find({genres: 'Horror'}, {genres: {$slice: 1}, name: 1})

//- Skip 1 genre then Show only 2 genre in the array
db.movies.find({genres: 'Horror'}, {genres: {$slice: [1, 2]}, name: 1})



//////////////////////////////////
///////---- Cursor ----////////
////////////////////////////////

//--- Sorting
db.persons.find().sort({name: 1, age: -1}).pretty()

//--- Skip
db.persons.find().sort({name: 1, age: -1}).skip(10).pretty()

//---- Limit
db.persons.find().sort({name: 1, age: -1}).skip(10).limit(5).pretty()



//////////////////////////////////
////---- Merge using $lookup ----////
/////////////////////////////////
db.customers.aggregate(
    [
        {
            $lookup: {
                from: 'books', // foreign collection name
                localField: 'favBooks',
                foreignField: '_id',
                as: 'favBookData'
            }
        }
    ]
)

db.prod.aggregate(
    [
        {
            $lookup: {
                from: 'color',
                localField: 'fruitName',
                foreignField: 'fruitName',
                as: 'table1'
            }
        },
        {
            $unwind: '$table1'
        },
        {
            $project: {
                _id: 0,
                fruitName: 1,
                color: '$table1.color'
            }
        }
    ]
).pretty()
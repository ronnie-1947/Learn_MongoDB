//---- Corner points of the park
const p1 = ['<long>', '<lat>']
const p2 = ['<long>', '<lat>']
const p3 = ['<long>', '<lat>']
const p4 = ['<long>', '<lat>']

/////////////////////////////////////////////////
//----- Insert GeoSpatial Data -----//
////////////////////////////////////////////////
//---- Insert a point
db.places.insertOne(
    {
        name: 'California Academy of Sciences', 
        location: { 
            type: 'Point', // have to be listed type in mongodb docs
            coordinates: [
                -122.4724356, //longitude
                37.7672544 //latitude
            ]
        }
    }
)

//---- Insert the park area
db.areas.insertOne(
    {
        name: 'Golden Gate Park', 
        area: {
            type: 'Polygon', 
            coordinates:[[p1, p2, p3, p4, p1]]
        }
    }
)                                         

/////////////////////////////////////////////////
//----- Search coordinates nearby -----//
////////////////////////////////////////////////

//---- Searching nearby requires geoSpatial index
//---- Creating Index for geospatial data
db.places.createIndex(
    {
        location: "2dsphere"
    }
)

db.areas.createIndex(
    {
        area: '2dsphere'
    }
)


//---- Search query point nearby
//---- Method 1
db.places.find(
    {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [-122.471114, 37.771104] //coordinates of user
                },
                $maxDistance: 5000,
                $minDistance: 10
            }
        }
    }
)

//---- Search query point nearby within radius
//---- Method 2
db.places.find(
    {
        location: {
            $geoWithin: {
                $centerSphere: 
                [
                    p1, //coordinates of user
                    1/6378.1 // Radius in Radians .. 1km conversion
                ]
            }
        }
    }
)


//---- Search points inside a polygon
db.places.find(
    {
        location: {
            $geoWithin: {
                $geometry: {
                    type: 'Polygon',
                    coordinates: [
                        [p1, p2, p3, p4, p1]
                    ]
                }
            }
        }
    }
)

//---- Check the point is inside a polygon or not
db.areas.find(
    {
        area: {
            $geoIntersects: {
                $geometry: {
                    type: 'Point',
                    coordinates: [-122.49089, 37.76992] // coordinates of user
                }
            }
        }
    }
)
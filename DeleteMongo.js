////////////////////////
////---- Delete ----////
///////////////////////

//---- Delete whole collection ----//
db.flightData.drop()

//---- Delete single data in collection ----//
db.flightData.deleteOne({departureAirport: "TXL"})
db.flightData.deleteMany({marker: "delete"}) 
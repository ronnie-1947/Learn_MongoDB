//////////////////////////////////
//---- One to One ----//
//////////////////////////////////

//--- Embedded document
db.patients.insertOne({
    name: 'Max',
    age: 29,
    diseaseSummary: {
        disease: ['cold', 'headache']
    }
})

//--- Using Refference
db.persons.insertOne({
    name: 'Max',
    age: 29,
    salary: 3000
})



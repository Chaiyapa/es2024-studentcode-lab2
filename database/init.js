db = new Mongo().getDB("mydatabase");

db.students.insertMany([
    { studentCode: "S001", firstName: "KONG", lastName: "Dola", age: 25, email: "KONG@example.com" },
    { studentCode: "S002", firstName: "Ja", lastName: "Doe", age: 22, email: "ja@example.com" }
]);

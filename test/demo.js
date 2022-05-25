const app=  require("../index");
const supertest = require("supertest");
const User = require("../models/User");
const { response } = require("../index");
const request = supertest(app);

const mongoose = require("mongoose");
const databaseName = "testuserroute";


describe('Get /test', ()=>{
    it('RESPONDS WITH JSON', async()=>{
        const response = await request.get("/api/v1/users/test")
        expect(response.status).toEqual(200);
        expect(response.body).toBe("Start testing")
    })
});

// // describe('post test', ()=>{
// //     it('return status code 201 if first name is passed', async()=>{
// //         const response = await request.post("/api/v1/users/testpost").send({
// //             firstName: "user"
// //         })

// //         expect(response.statusCode).toEqual(201);
// //         expect(response.body).toEqual("Got")
// //     });

// //     it("Bad request if first name not passed", async()=>{
// //         const response  =await request.post("/api/v1/users/testpost").send({});
        
// //         expect(response.statusCode).toEqual(400);
// //         expect(response.body).toEqual("You need to pass firstname")
// //     })
    
    
// // })

// //-------------------------Actual endpoints testing--------------------------------------------------------
// const userr = {
//     name: "tester",
//     email:"tester@gmail.com",
//     passwordHash: "12345",
//     phone: "1234567890"
// }

// beforeAll(async () => {
//     const url = `mongodb://127.0.0.1/${databaseName}`
//     await mongoose.connect(url, { useNewUrlParser: true });
//     await User(userr).save();
// });

// afterAll(async () => {
//     //disconnect mongoose
//     await mongoose.connection.close()
// });

// afterEach(async () => {
//     await User.deleteMany();
// });

// describe("User registration", ()=>{

//     it("Success, Status Code to be 201", async () => {
//     const res = await request.post("/api/v1/users/register").send({
//       name: "testingggg",
//       email: "testing@gmail.com",
//       passwordHash: "12345",
//       phone: "1234"
//     });

//     expect(res.statusCode).toEqual(201);
//   });

//   it("Got valid response in body", async()=>{
//     const res = await request.post("/api/v1/users/register").send({
//         name: "testingggg",
//         email: "testing@gmail.com",
//         passwordHash: "12345",
//         phone: "1234"
//       });
//     expect(res.body.message).toEqual("success");
//     expect(res.body.data).toBeTruthy();
//     expect(res.body.data._id).toBeDefined();

//   });

//   it("Content Type Json In headers", async()=>{
//     const res = await request.post("/api/v1/users/register").send({
//         name: "testingggg",
//         email: "testing@gmail.com",
//         passwordHash: "12345",
//         phone: "1234"
//       });
  
//       expect(res.headers['content-type']).toEqual(expect.stringContaining("json"));
//   });

//   it("Should save user to database", async()=>{
//       const res = await request.post("/api/v1/users/register").send({
//         name: "testingggg",
//         email: "testing@gmail.com",
//         passwordHash: "12345",
//         phone: "1234"
//       });

//     const user = await User.findOne({ email: "testing@gmail.com" });
//     expect(user.name).toBeTruthy();
//     expect(user.email).toBeTruthy();

//   });

//   it("Fields are missing return 500", async()=>{
//     const res = await request.post("/api/v1/users/register").send({
//         name: "testingggg",
//         email: "testing@gmail.com",
//         passwordHash: "12345",
//         phone: ""
//       });

//     expect(res.statusCode).toBe(500);
//   });

// });


// describe("User Login", ()=>{

//     // it("Login - Success -200", async()=>{

//     //     const res = await request.post("/api/v1/users/login").send({
//     //         email:userr.email,
//     //         passwordHash: userr.passwordHash
//     //     });

//     //     expect(res.statusCode).toBe(200);

//     // })

//     it("User invalid or field null - Failure - 404", async()=>{
//         const res = await request.post("/api/v1/users/login").send({
//             email: "",
//             passwordHash: "12345"
//         })
//         console.log(res.body.accessToken)
//         //expect(res.statusCode).toBe(404);
//     })
// });




  




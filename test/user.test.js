const app=  require("../index");
const supertest = require("supertest");
const User = require("../models/User");
const request = supertest(app);

const mongoose = require("mongoose");
const databaseName = "testuserroute";

beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`
    await mongoose.connect(url, { useNewUrlParser: true });
});

afterAll(async () => {
    //disconnect mongoose
    await mongoose.connection.close()
});


describe("User registration /POST", ()=>{


    afterEach(async () => {
        await User.deleteMany();
    });

    it("Success, Status Code to be 201", async () => {
    const res = await request.post("/api/v1/users/register").send({
      name: "testingggg",
      email: "testing@gmail.com",
      passwordHash: "12345",
      phone: "1234"
    });

    expect(res.statusCode).toEqual(201);
  });

  it("Got valid response in body", async()=>{
    const res = await request.post("/api/v1/users/register").send({
        name: "testingggg",
        email: "testing@gmail.com",
        passwordHash: "12345",
        phone: "1234"
      });
    expect(res.body.message).toEqual("success");
    expect(res.body.data).toBeTruthy();
    expect(res.body.data._id).toBeDefined();

  });

  it("Content Type Json In headers", async()=>{
    const res = await request.post("/api/v1/users/register").send({
        name: "testingggg",
        email: "testing@gmail.com",
        passwordHash: "12345",
        phone: "1234"
      });
  
      expect(res.headers['content-type']).toEqual(expect.stringContaining("json"));
  });

  it("Should save user to database", async()=>{
      const res = await request.post("/api/v1/users/register").send({
        name: "testingggg",
        email: "testing@gmail.com",
        passwordHash: "12345",
        phone: "1234"
      });

    const user = await User.findOne({ email: "testing@gmail.com" });
    expect(user.name).toBeTruthy();
    expect(user.email).toBeTruthy();

  });

  it("Phone field missing return 500", async()=>{
    const res = await request.post("/api/v1/users/register").send({
        name: "testingggg",
        email: "testing@gmail.com",
        passwordHash: "12345",
        phone: ""
      });

    expect(res.statusCode).toBe(500);
  });

  
  it("Name field missing return 500", async()=>{
    const res = await request.post("/api/v1/users/register").send({
        name: "",
        email: "testing@gmail.com",
        passwordHash: "12345",
        phone: "9643740096440974"
      });

    expect(res.statusCode).toBe(500);
  });

});


describe("Get User /id/GET", ()=>{

    beforeEach(async()=>{
        const userr = {
            _id:"6283ca078a2f4b727036d711",
            name: "tester",
            email:"tester@gmail.com",
            passwordHash: "12345",
            phone: "1234567890",
            isAdmin: false,
            street: "96/EE",
            apartment: "Werty",
            zip:"063022",
            city: "aasza",
            country:"lop",
        }
        await User(userr).save();
    });

    afterEach(async()=>{
        await User.deleteMany();
    });

    it("Get user by id /SUCCESS", async()=>{

        const res = await request.get("/api/v1/users/6283ca078a2f4b727036d711");

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("User is captured");
        expect(res.body.success).toBeTruthy();
    });

    it("Get user by id /FAILURE", async()=>{
        const res = await request.get("/api/v1/users/6383ca078a2f4b727036d711");
        

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message : "User not found with this id!"
        })

    });

    it("Get all users /", async()=>{
        const res = await request.get("/api/v1/users");

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Complete user list captured");
        expect(res.body.success).toBeTruthy();

    });

});

describe("Delete Users /DELETE", ()=>{

    beforeAll(async()=>{
        const userr = {
            _id:"6283ca078a2f4b727036d711",
            name: "tester",
            email:"tester@gmail.com",
            passwordHash: "12345",
            phone: "1234567890",
            isAdmin: false,
            street: "96/EE",
            apartment: "Werty",
            zip:"063022",
            city: "aasza",
            country:"lop",
        }
        await User(userr).save();
    });

    it("Delete User /Success", async()=>{

        const res  = await request.delete("/api/v1/users/6283ca078a2f4b727036d711");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message: "User successfully deleted!"
        });
    });

    it("Delete User /Failure", async()=>{

        const res = await request.delete("/api/v1/users/6183ca078a2f4b727036d711")

        expect(res.body).toEqual({
            success: false,
            message: "User id doesn't exist"
        })
    });

});

describe("Aggregrate users /GET/COUNT", ()=>{

    beforeEach(async()=>{
        const userr = {
            _id:"6283ca078a2f4b727036d711",
            name: "tester",
            email:"tester@gmail.com",
            passwordHash: "12345",
            phone: "1234567890",
            isAdmin: false,
            street: "96/EE",
            apartment: "Werty",
            zip:"063022",
            city: "aasza",
            country:"lop",
        }
        await User(userr).save();
    });

    afterEach(async()=>{
        await User.deleteMany();
    });

    it("Get user count /SUCCESS", async()=>{

        const res  = await request.get("/api/v1/users/get/count");

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();

    })

})


describe("Aggregrate users /GET/FAILURE", ()=>{

    it("Get user count /NULL", async()=>{
        const res = await request.get("/api/v1/users/get/count")
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            success: false,
            message: "Count error!"
        })
    })
});

describe("Update Users /PUT", ()=>{

    beforeEach(async()=>{
        const userr = {
            _id:"6283ca078a2f4b727036d711",
            name: "tester",
            email:"tester@gmail.com",
            passwordHash: "12345",
            phone: "1234567890",
            isAdmin: false,
            street: "96/EE",
            apartment: "Werty",
            zip:"063022",
            city: "aasza",
            country:"lop",
        }
        await User(userr).save();
    });

    afterEach(async()=>{
        await User.deleteMany();
    });

    it("Update user - Failure - User not found", async()=>{

        const res = await request.put("/api/v1/users/6183ca078a2f4b727036d711");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual("User not found");
    });

    it("Update user - Password Update - success", async()=>{

        const res = await request.put("/api/v1/users/6283ca078a2f4b727036d711").send({
            passwordHash: "newpassword"
        });

        expect(res.statusCode).toBe(200)

    });

    it("Update user- success - Updated", async()=>{

        const res = await request.put("/api/v1/users/6283ca078a2f4b727036d711").send({
            name: "updated user",
            street: "pol09",
            email: "updatedemail@gmail.com"
        });

        expect(res.body.message).toEqual("Successfully updated");
        expect(res.body.success).toBeTruthy();
        expect(res.statusCode).toBe(200);
    
    });
});


// describe("User Login /POST", ()=>{

//     beforeAll(async()=>{
//         const userr = {
//             _id:"6283ca078a2f4b727036d711",
//             name: "tester",
//             email:"tester@gmail.com",
//             passwordHash: "12345",
//             phone: "1234567890",
//             isAdmin: false,
//             street: "96/EE",
//             apartment: "Werty",
//             zip:"063022",
//             city: "aasza",
//             country:"lop",
//         }
//         await User(userr).save();
//     });

//     afterAll(async()=>{
//         await User.deleteMany();
//     });

//     it("User Login - failure - wrong email", async()=>{

//         const res = await request.post("/api/v1/users/login").send({
//             email:"op@gmail.com",
//             passwordHash:"12345"
//         });

//         console.log(res.body)

//     })

// })




  




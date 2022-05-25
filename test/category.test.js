const app=  require("../index");
const supertest = require("supertest");
const Category  =require("../models/Category")
const request = supertest(app);
const mongoose = require("mongoose");
const databaseName = "testuserroute";

const TOKEN = "abcdefhijklmnopqrstuvqxyz"

beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`
    await mongoose.connect(url, { useNewUrlParser: true });

});

afterAll(async () => {
    //disconnect mongoose
    await mongoose.connection.close()
});

describe("Category pass /POST", ()=>{

    beforeEach(async()=>{
        await Category.deleteMany();
    });
    
    it("Category post - success", async ()=>{
        const res  =await request.post("/api/v1/categories").send({
            name : "Cars",
            color: "black"
        })

        expect(res.statusCode).toBe(201);
    });

    it("Response Body- Valid", async()=>{
        const res = await request.post("/api/v1/categories").send({
            name : "Cars",
            color: "black"
        })

        expect(res.body).toBeTruthy();
        expect(res.body._id).toBeDefined();
    });

    it("Content Type Json In headers", async()=>{
        const res = await request.post("/api/v1/categories").send({
            name : "Cars",
            color: "black"
        })
        expect(res.headers['content-type']).toEqual(expect.stringContaining("json"));
    });

    it('Input field missing/invalid - failure 500', async()=>{
        const res = await request.post("/api/v1/categories").send({
            name : "",
        })
        
        expect(res.statusCode).toBe(500);
    })

});

describe("Delete Category /DELETE", ()=>{

    beforeAll(async ()=>{
        const category = {
            _id: "628cd6d47eb286cf58a2e368",
            name:"top",
            icon:"icon-9665",
            color:"green",
        }

        await Category(category).save();
    })


    it("Delete Category - Failure- Category not exist", async()=>{
        const res = await request.delete("/api/v1/categories/628ca6ddc9b3ae056d3726da");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message : "Category doesn't exist"
        })
    });

    it("Delete Category -Success - Successfully Deleted", async()=>{
       
        const res = await request.delete("/api/v1/categories/628cd6d47eb286cf58a2e368");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message : "Category successfully deleted"
        })
    })
   
});

describe("Get Category /GET", ()=>{

    beforeEach(async ()=>{
        const category = {
            _id: "628cd6d47eb286cf58a2e363",
            name:"phone",
            icon:"dev-9665",
            color:"blue",
        }

        await Category(category).save();
    });

    afterEach(async()=>{
        await Category.deleteMany();
    })

    
    it("Get Category - Failure - Category not exist", async()=>{
        const res = await request.get("/api/v1/categories/628ca6ddc9b3ae056d3726da");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message : "Item you requested doesn't exist"
        });
    });

    it("Get Category - Success - Found", async()=>{
        const res = await request.get("/api/v1/categories/628cd6d47eb286cf58a2e363");

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBeDefined();
        expect(res.body.color).toBeDefined(); 
    });

    it("Get all categories -success", async()=>{
        const res  =await request.get("/api/v1/categories");

        expect(res.body).toBeTruthy();
        expect(res.body.message).toEqual("success");
        expect(res.statusCode).toBe(200);
    });
});

describe("Update Category /PUT", ()=>{

    beforeEach(async ()=>{
        const category = {
            _id: "628cd6d47eb286cf58a2e361",
            name:"tab",
            icon:"pol-45265",
            color:"black",
        }

        await Category(category).save();
    });

    afterEach(async()=>{
        await Category.deleteMany();
    })

    it("Update category - failure - not found", async()=>{
        const res = await request.put("/api/v1/categories/628ca6ddc9b3ae056d3726da").send({
            name: "updatedone",
            icon: "op-9+30",
            color:"newcolor"
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            status: false,
            message: "Category doesnt exist"
        });
    });

    it("Update category -success -Updated", async()=>{
        const res = await request.put("/api/v1/categories/628cd6d47eb286cf58a2e361").send({
            name: "updated tab",
            icon: "biqw-31",
            color:"rose gold"
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Successfully updated");
        expect(res.body).toBeTruthy();
    });

});

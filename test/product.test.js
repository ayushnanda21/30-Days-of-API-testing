const app=  require("../index");
const supertest = require("supertest");
const Category  =require("../models/Category")
const Product  =require("../models/Product")
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

describe("GET Products /:id /GET", ()=>{

    beforeEach(async ()=>{
        const categorycreated = {
            _id: "628cd6d47eb286cf58a2e363",
            name:"phone",
            icon:"dev-9665",
            color:"blue",
        }

        const product = {
            _id: "6234a9c563734dda3c74e62b",
            description: "testing product",
            richDescription: "maybe working perfect",
            image: "img/98-a-63es",
            images:[
                
            ],
            brand: "apple",
            price: 96352,
            category: "628cd6d47eb286cf58a2e363",
            countInStock : 96,
            rating: 4,
            numReviews: 65436,
            isFeatured: false
        }

        await Product(product).save();
        await Category(categorycreated).save();
    });

    afterEach(async()=>{
        await Category.deleteMany();
        await Product.deleteMany();
    })

    it("Get product - success ", async()=>{
        const res = await request.get("/api/v1/products/6234a9c563734dda3c74e62b")
        
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Product found")
        expect(res.body.data).toBeDefined();
    })

    it("Get product - failure - Product doesn't exist", async()=>{
        const res = await request.get("/api/v1/products/6234aa30dbe66dfc1633323c");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message : "Product you requested doesn't exist"
        })
    })

    it("Get all products -success", async()=>{
        const res  =await request.get("/api/v1/products");

        expect(res.body).toBeTruthy();
        expect(res.body.message).toEqual("All products fetching success");
        expect(res.statusCode).toBe(200);
    });
});

describe("Delete Products /DELETE", ()=>{

    beforeAll(async()=>{
        const categorycreated = {
            _id: "628cd6d47eb286cf58a2e363",
            name:"phone",
            icon:"dev-9665",
            color:"blue",
        }

        const product = {
            _id: "6234a9c563734dda3c74e62b",
            description: "testing product",
            richDescription: "maybe working perfect",
            image: "img/98-a-63es",
            images:[
                
            ],
            brand: "apple",
            price: 96352,
            category: "628cd6d47eb286cf58a2e363",
            countInStock : 96,
            rating: 4,
            numReviews: 65436,
            isFeatured: false
        }

        await Product(product).save();
        await Category(categorycreated).save();
    });

    afterAll(async()=>{
        await Category.deleteMany();
    });

    it("Delete Product - Success -  Deleted", async()=>{

        const res = await request.delete("/api/v1/products/6234a9c563734dda3c74e62b");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message : "Product successfully deleted"
        });
    })

    it("Delete Product - failure - Doesn't exist", async()=>{

        const res = await request.delete("/api/v1/products/6234aa30dbe66dfc1633323c");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message : "Product doesn't exist"
        })
    })
});

describe("Aggregrate Products /GET/SUCCESS", ()=>{

    beforeAll(async()=>{
        const categorycreated = {
            _id: "628cd6d47eb286cf58a2e363",
            name:"phone",
            icon:"dev-9665",
            color:"blue",
        }

        const product = {
            _id: "6234a9c563734dda3c74e62b",
            description: "testing product",
            richDescription: "maybe working perfect",
            image: "img/98-a-63es",
            images:[
                
            ],
            brand: "apple",
            price: 96352,
            category: "628cd6d47eb286cf58a2e363",
            countInStock : 96,
            rating: 4,
            numReviews: 65436,
            isFeatured: false
        }

        await Product(product).save();
        await Category(categorycreated).save();
    });

    afterAll(async()=>{
        await Category.deleteMany();
        await Product.deleteMany();
    });

    it("Get Products count /DB", async()=>{

        const res = await request.get("/api/v1/products/get/count")
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    })

});

describe("Aggregrate Products /GET/FAILURE", ()=>{

    it("Get Products /NULL", async()=>{
        const res = await request.get("/api/v1/products/get/count")
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            success: false,
            message: "Count error!"
        })
    })
});

describe("Featured Products /FEATURED/COUNT/SUCCESS", ()=>{

    beforeAll(async()=>{
        const categorycreated = {
            _id: "628cd6d47eb286cf58a2e363",
            name:"phone",
            icon:"dev-9665",
            color:"blue",
        }

        const product = 
        {
            _id: "6234a9c563734dda3c74e62b",
            description: "testing product",
            richDescription: "maybe working perfect",
            image: "img/98-a-63es",
            images:[
                
            ],
            brand: "apple",
            price: 96352,
            category: "628cd6d47eb286cf58a2e363",
            countInStock : 96,
            rating: 4,
            numReviews: 65436,
            isFeatured: true
        }

        await Product(product).save();
        await Category(categorycreated).save();
    });

    afterAll(async()=>{
        await Category.deleteMany();
        await Product.deleteMany();
    });

    it("Get Featured /GET/ SUCCESS", async()=>{

        const res  =await request.get("/api/v1/products/get/featured/0");
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBeTruthy();

    });
});

describe("Featured Products /FEATURED/COUNT/ FAILURE", ()=>{

    beforeAll(async()=>{
        const categorycreated = {
            _id: "628cd6d47eb286cf58a2e363",
            name:"phone",
            icon:"dev-9665",
            color:"blue",
        }

        const product = 
        {
            _id: "6234a9c563734dda3c74e62b",
            description: "testing product",
            richDescription: "maybe working perfect",
            image: "img/98-a-63es",
            images:[
                
            ],
            brand: "apple",
            price: 96352,
            category: "628cd6d47eb286cf58a2e363",
            countInStock : 96,
            rating: 4,
            numReviews: 65436,
            isFeatured: false
        }

        await Product(product).save();
        await Category(categorycreated).save();
    });

    afterAll(async()=>{
        await Category.deleteMany();
        await Product.deleteMany();
    });

    it("Get Featured /GET/ FAILURE", async()=>{

        const res  =await request.get("/api/v1/products/get/featured/0");
        expect(res.body.data).toEqual([]);
    });
});

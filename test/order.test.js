const app=  require("../index");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const Order = require("../models/Order");
const OrderItem = require("../models/Order-Item");
const User = require("../models/User")
const databaseName = "testuserroute";

beforeAll(async () => {
    const url = `mongodb://127.0.0.1/${databaseName}`
    await mongoose.connect(url, { useNewUrlParser: true });

});

afterAll(async () => {
    //disconnect mongoose
    await mongoose.connection.close()
});


describe("Get Orders /GET", ()=>{

    beforeEach(async ()=>{
        const orders = 
            {
                "orderItems": [
                    "628f3c7450a1a15bcf7638cc",
                    "628f3c7450a1a15bcf7638cd"
                ],
                "shippingAddress1": "Office Ow2",
                "shippingAddress2": "Near tech",
                "city": "Singapore",
                "zip": "94704596",
                "country": "Singapore",
                "phone": 6010634,
                "status": "pending",
                "totalPrice": 84130,
                "user": "6284979547db9dd1bcd0296d",
                "_id": "628f3c7450a1a15bcf7638d4",
            }

        const user = {
                _id: "6284979547db9dd1bcd0296d",
                name: "tester",
                email:"tester@gmail.com",
                passwordHash: "12345",
                phone: "1234567890"
            }

        const orderItems = 
                {
                    quantity: 1,
                    product: "628f3c7450a1a15bcf7638cc",
                }
    
        await Order(orders).save();
        await User(user).save();
        await OrderItem(orderItems).save();    

    });
    afterEach(async()=>{
        await Order.deleteMany();
        await User.deleteMany();
        await OrderItem.deleteMany();
    });

    it("GET order by id - success", async()=>{
        const res = await request.get("/api/v1/orders/628f3c7450a1a15bcf7638d4");

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toEqual("Order found");
        expect(res.body.success).toBeTruthy();
        expect(res.body.data.user).toBeDefined();

    });

    it("GET order by id - failure - order not found", async()=>{
        const res = await request.get("/api/v1/orders/628f3c7450a1a15bcf7631a1");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            message: "Order not found",
            success: false
        });
    });

    it("Get all orders -success", async()=>{
        const res  =await request.get("/api/v1/orders");

        expect(res.body).toBeTruthy();
        expect(res.body.message).toEqual("Success");
        expect(res.statusCode).toBe(200);
    });

});

describe("Delete Orders /DELETE", ()=>{

    beforeAll(async ()=>{
        const orders = 
            {
                "orderItems": [
                    "628f3c7450a1a15bcf7638cc",
                    "628f3c7450a1a15bcf7638cd"
                ],
                "shippingAddress1": "Office Ow2",
                "shippingAddress2": "Near tech",
                "city": "Singapore",
                "zip": "94704596",
                "country": "Singapore",
                "phone": 6010634,
                "status": "pending",
                "totalPrice": 84130,
                "user": "6284979547db9dd1bcd0296d",
                "_id": "628f3c7450a1a15bcf7638d4",
            }

        const user = {
                _id: "6284979547db9dd1bcd0296d",
                name: "tester",
                email:"tester@gmail.com",
                passwordHash: "12345",
                phone: "1234567890"
            }
        await Order(orders).save();
        await User(user).save();
    });

    afterAll( async()=>{
        await Order.deleteMany();
        await User.deleteMany()
    })

    it("Delete Order - failure - Order not found/deleted", async()=>{

        const res = await request.delete("/api/v1/orders/628f3c7450a1a15bcf7631a6");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Order not deleted...err"
        });

    });

    it("Delete Order - success - Succesfully deleted", async()=>{

        const res = await request.delete("/api/v1/orders/628f3c7450a1a15bcf7638d4");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            success: true,
            message : "Order has been deleted"
        })
    });
});

// describe("Create Orders /POST", ()=>{

//     it("Post order - Success - Created", async()=>{

//         const orderItemsIds = [
//             "628f3c7450a1a15bcf7638cc",
//             "628f3c7450a1a15bcf7638cd"
//         ]
//         const totalPrice = 65912
//         const res = await request.post("/api/v1/orders").send({
//             "orderItems": orderItemsIds,
//             "shippingAddress1": "Office Ow2",
//             "shippingAddress2": "Near tech",
//             "city": "Singapore",
//             "zip": "94704596",
//             "country": "Singapore",
//             "phone": 6010634,
//             "status": "pending",
//             "totalPrice": totalPrice,
//             "user": "6284979547db9dd1bcd0296d",
//             "_id": "628f3c7450a1a15bcf7638d4",
//         })
//         console.log(res);
//     });

// });


describe("Aggregrate Orders /GET/SUCCESS", ()=>{

    beforeAll(async()=>{
        const orders = 
            {
                "orderItems": [
                    "628f3c7450a1a15bcf7638cc",
                    "628f3c7450a1a15bcf7638cd"
                ],
                "shippingAddress1": "Office Ow2",
                "shippingAddress2": "Near tech",
                "city": "Singapore",
                "zip": "94704596",
                "country": "Singapore",
                "phone": 6010634,
                "status": "pending",
                "totalPrice": 84130,
                "user": "6284979547db9dd1bcd0296d",
                "_id": "628f3c7450a1a15bcf7638d4",
            }

        const user = {
                _id: "6284979547db9dd1bcd0296d",
                name: "tester",
                email:"tester@gmail.com",
                passwordHash: "12345",
                phone: "1234567890"
            }
        await Order(orders).save();
        await User(user).save();
    });

    afterAll(async()=>{
        await Order.deleteMany();
        await User.deleteMany();
    });

    it("Get Orders count /DB", async()=>{

        const res = await request.get("/api/v1/orders/get/count")
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    })

});

describe("Aggregrate Orders /GET/FAILURE", ()=>{

    it("Get Orders /NULL", async()=>{
        const res = await request.get("/api/v1/orders/get/count")
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            success: false,
            message: "Count error!"
        })
    })
});


describe("Getting order in frontend for user display /GET", ()=>{

    beforeAll(async()=>{
        const orders = 
            {
                "orderItems": [
                    "628f3c7450a1a15bcf7638cc",
                    "628f3c7450a1a15bcf7638cd"
                ],
                "shippingAddress1": "Office Ow2",
                "shippingAddress2": "Near tech",
                "city": "Singapore",
                "zip": "94704596",
                "country": "Singapore",
                "phone": 6010634,
                "status": "pending",
                "totalPrice": 84130,
                "user": "6284979547db9dd1bcd0296d",
                "_id": "628f3c7450a1a15bcf7638d4",
            }

        const user = {
                _id: "6284979547db9dd1bcd0296d",
                name: "tester",
                email:"tester@gmail.com",
                passwordHash: "12345",
                phone: "1234567890"
            }
        await Order(orders).save();
        await User(user).save();
    });

    afterAll(async()=>{
        await Order.deleteMany();
        await User.deleteMany();
    });

    it("Get order for frontend user display / SUCCESS", async()=>{
        const res = await request.get("/api/v1/orders/get/userorders/6284979547db9dd1bcd0296d");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBeTruthy();
    });

    it("Get order for frontend user display / FAILURE", async()=>{
        const res = await request.get("/api/v1/orders/get/userorders/6284979541fb9dd1bcd0296a");

        expect(res.body.data).toEqual([]);
    });



})






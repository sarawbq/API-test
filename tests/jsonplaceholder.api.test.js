const axios= require('axios');
const process= require('process');
require('dotenv').config();


// const baseUrl = 'https://jsonplaceholder.typicode.com';
const baseUrl=process.env.JSON_PLACE_HOLDER_URL;

describe ('Get /posts',()=>{

    let responseOfGet;

    beforeAll(async ()=>{
        responseOfGet= await axios.get(`${baseUrl}/posts`);
    });

    test ('properties',()=>{
       
        expect(responseOfGet.status).toBe(200);

        for (let item of responseOfGet.data){
            expect(item).toHaveProperty('userId');
            expect(item).toHaveProperty('title');
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('body');
        }
    });

    test('title check of number 5', ()=>{
        const responseOf5= responseOfGet.data.find(item=> item.id ===5);
        expect(responseOf5.title).toBe("nesciunt quas odio");
        expect(responseOf5.body).toContain('veniam');
  
    });

    test('the response should contain 100 posts',()=>{
        expect(responseOfGet.data).toHaveLength(100);

    });

    test('all userIds should be number',()=>{
        for (let item of responseOfGet.data){
            expect(typeof item.userId).toBe('number');  
        }
    });
});

describe('post /post',()=>{

    test('creating a post',async()=>{

        const response= await axios.post(`${baseUrl}/posts`,
            { userId : 329, title: 'test',body:'this a test'});

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data.title).toBe('test');
        expect(typeof response.data.userId).toBe("number");
    });

});

describe('put /post/1',()=>{

    test('updating',async()=>{
        const response=await axios.put(`${baseUrl}/posts/1`, { userId : 329, title: 'test',body:'this a test'});
        expect(response.status).toBe(200);
        expect(response.data.title).toBe('test');
        expect(response.data.userId).toBe(329);
    });
});

describe('patch /post/1',()=>{

    test('patch',async()=>{
        const response=await axios.put(`${baseUrl}/posts/1`, { userId : 777});
        expect(response.status).toBe(200);
        expect(response.data.userId).toBe(777);
    });
});


describe('delete /post/1',()=>{

    test('deleting',async()=>{
        const response=await axios.delete(`${baseUrl}/posts/1`);
        expect(response.status).toBe(200);
    });
});

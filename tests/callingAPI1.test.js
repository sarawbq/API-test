const axios= require('axios');

const baseUrl = 'https://jsonplaceholder.typicode.com'
describe ('Get /posts',()=>{

  // beforeAll(async ()=>{
  //   const response= await axios.get(`${baseUrl}/posts`)
  // })??????????????????????????????????????????

test ('properties',async()=>{
  const response = await axios.get (`${baseUrl}/posts`)
  expect(response.status).toBe(200);
  
  response.data.forEach(item =>{
    expect(item).toHaveProperty('userId');
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('body');
  })
})

test('title check of number 5',async ()=>{
  const response = await axios.get (`${baseUrl}/posts`)
  const responseOf5= response.data.find(item=> item.id ===5);
  expect(responseOf5.title).toBe("nesciunt quas odio")
  expect(responseOf5.body).toContain('veniam')
  
})

test('the response should contain 100 posts',async()=>{
const response= await axios.get(`${baseUrl}/posts`);
expect(response.data).toHaveLength(100);

})

test('all userIds should be number',async()=>{
  const response= await axios.get(`${baseUrl}/posts`)
  response.data.forEach(item=>{
    expect(typeof item.userId).toBe('number');
  })
})


})

describe('post /post',()=>{

  test('creating a post',async()=>{

  const response= await axios.post(`${baseUrl}/posts`,
    { userId : 329, title: 'test',body:'this a test'})

    // console.log(response.data)

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.title).toBe('test');
    expect(typeof response.data.userId).toBe("number");
  })

})

describe('put /post/1',()=>{

  test('updating',async()=>{
  const response=await axios.put(`${baseUrl}/posts/1`, { userId : 329, title: 'test',body:'this a test'})
 expect(response.status).toBe(200);
 expect(response.data.title).toBe('test');
 expect(response.data.userId).toBe(329);
  })
})

describe('patch /post/1',()=>{

  test('patch',async()=>{
  const response=await axios.put(`${baseUrl}/posts/1`, { userId : 777})
 expect(response.status).toBe(200);
 expect(response.data.userId).toBe(777);
  })
})


describe('delete /post/1',()=>{

  test('deleting',async()=>{
  const response=await axios.delete(`${baseUrl}/posts/1`)
 expect(response.status).toBe(200);//204??????


//  const response1 = await axios.get (`${baseUrl}/posts/1`)
//  expect(response.status).toBe(404);  ????????????????????????????????
  })
})





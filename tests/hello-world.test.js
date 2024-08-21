const axios = require ('axios');


describe ("hello world test",()=>{

test ("first test", async()=>{
  const response= await axios.get("https://api.jsonserver.io/test",{ headers: {"X-Jsio-Token": "b89b563ab481b4f7632e2987e73e3fdd"}
  })

expect(response.data.text).toBe("Hello World");
})
})

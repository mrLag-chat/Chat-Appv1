let server = require("./app");
const db = require("./Config/dbConfig")

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log("server started listening in port " + port)
})


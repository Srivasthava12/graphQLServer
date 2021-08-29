const app = require('express')()

const { graphqlHTTP } = require('express-graphql')

const schema = require('./schema/schema.js')

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}))

app.use('/test', (req, res) => {
    res.send('lolol')
})
app.listen(4000, () => {
    console.log("started listing")
})
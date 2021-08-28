const app = require('express')()

const { graphqlHTTP } = require('express-graphql')

const schema = require('./schema/schema.js')


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}))
app.listen(4000, () => {
    console.log("started listing")
})
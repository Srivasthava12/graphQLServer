const graphql = require('graphql');
const axios = require('axios')
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLSchema, GraphQLList } = graphql


const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve: (parentValue, args) => {
                return axios.get(`http://localhost:5000/companies/${parentValue.id}/users`).then((response) => response.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve: (parentValue, args) => {
                const { companyId } = parentValue
                return axios.get(`http://localhost:5000/companies/${companyId}`).then((response) => response.data)
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve: (parentValue, args) => {
                return axios.get(`http://localhost:5000/users/${args.id}`).then((response) => response.data)
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve: (parentValue, args) => {
                return axios.get(`http://localhost:5000/companies/${args.id}`).then((response) => response.data)
            }
        },
        companies: {
            type: new GraphQLList(CompanyType),
            args: { },
            resolve: (parentValue, args) => {
                return axios.get(`http://localhost:5000/companies`).then((response) => response.data)
            }
        },
        users: {
            type: new GraphQLList(UserType),
            args: { },
            resolve: (parentValue, args) => {
                return axios.get(`http://localhost:5000/users`).then((response) => response.data)
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve: (parentValue, args) => {
                const { firstName, age } = args
                return axios.post(`http://localhost:5000/users`, { firstName, age }).then((response) => response.data)
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parentValue, args) => {
                const { id } = args
                return axios.delete(`http://localhost:5000/users/${id}`).then((response) => response.data)
            }
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString }
            },
            resolve: (parentValue, args) => {
                const { id, firstName, age, companyId } = args
                return axios.patch(`http://localhost:5000/users/${id}`, {
                    firstName,
                    age,
                    companyId
                }).then((response) => response.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})


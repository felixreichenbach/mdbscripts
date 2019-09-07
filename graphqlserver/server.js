const { ApolloServer, gql } = require('apollo-server');
// Construct a schema, using GraphQL schema language

const customers = [{ "name": "Felix", "lastname": "Reichenbach" }, { "name": "Simon", "lastname": "Reichenbach" },{"name": "Felix"}];


const typeDefs = gql`
  type Query {
    customers(name:String): [Customer]
  }

  type Customer {
    name: String
    lastname: String
  }
`;
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    customers(parent, args, context, info) {
      return customers.filter(function (customer) {
        return customer.name == args.name;
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});
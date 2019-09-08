const { ApolloServer, gql } = require('apollo-server');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// MongoDB Connection String
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

// Create a new MongoClient
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

//Static data set
const customers = [{ "name": "Felix", "lastname": "Reichenbach" }, { "name": "Simon", "lastname": "Reichenbach" }, { "name": "Felix" }];


// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    customers(name:String): [Customer]
    customer(name:String): [Customer]
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
    },
    customer(parent, args, context, info) {
      return client.db(dbName).collection('customers').find({ "name": args.name }).toArray();
    }
  }
};

client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to MongoDB");

});

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});
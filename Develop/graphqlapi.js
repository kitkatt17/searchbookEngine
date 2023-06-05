const { ApolloServer, gql } = require('apollo-server-express');
const axios = require('axios');

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    authors: [String]
    description: String
  }

  type Query {
    books(q: String!): [Book]
  }
`;

// To test the GraphQL API
// query {
//     books(q: "Harry Potter") {
//       id
//       title
//       authors
//       description
//     }
//   }
  

const resolvers = {
  Query: {
    books: async (_, { q }) => {
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q,
          },
        });
        const books = response.data.items.map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          authors: item.volumeInfo.authors,
          description: item.volumeInfo.description,
        }));
        return books;
      } catch (error) {
        console.error(error);
        throw new Error('Unable to fetch books');
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen(3001, () => {
  console.log(`Server is running on http://localhost:3000${server.graphqlPath}`);
});

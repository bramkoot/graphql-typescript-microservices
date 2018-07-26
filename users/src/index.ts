import { GraphQLServer } from 'graphql-yoga'

const PORT = 4001

const typeDefs = `
  type Query {
    user(id: Int!): User
    users: [User]
    userByCompany(companyId: Int!): User
  }
  
  type User {
    id: Int!
    name: String!
    companyId: Int
    age: Int!
    isAdmin: Boolean!
  }
`

interface User {
  id: number
  name: string
  companyId?: number
  age: number
  isAdmin: boolean
}

const users: {[id: string]: User} = {
  1: {
    id: 1,
    name: 'Alice',
    companyId: 2,
    age: 445,
    isAdmin: false
  },
  2: {
    id: 2,
    name: 'Bob',
    companyId: 1,
    age: 556,
    isAdmin: true
  },
  3: {
    id: 3,
    name: 'Perry',
    age: 333,
    isAdmin: false
  },
  4: {
    id: 4,
    name: 'Charles',
    age: 12,
    isAdmin: true,
    companyId: 3
  }  
}

const resolvers = {
  Query: {
    user: (_, { id }) => users[id],
    users: _ => Object.values(users),
    userByCompany: (_, { companyId }) => Object.values(users).find(u => u.companyId === companyId)
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start({port:PORT}, () => console.log(`Server is running on localhost:${PORT}`))
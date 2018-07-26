import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { makeRemoteExecutableSchema, introspectSchema, mergeSchemas } from 'graphql-tools'
import { GraphQLServer } from 'graphql-yoga'

const PORT = 4000

const init = async () => {
  // users service
  const usersLink = new HttpLink({ uri: 'http://localhost:4001', fetch })
  const usersSchema = makeRemoteExecutableSchema({ 
    schema: await introspectSchema(usersLink),
    link: usersLink
  });

  // companies service
  const companiesLink = new HttpLink({ uri: 'http://localhost:4002', fetch })
  const companiesSchema = makeRemoteExecutableSchema({ 
    schema: await introspectSchema(companiesLink),
    link: companiesLink
  });

  const relationsSchema = `
    extend type User {
      company: Company
    }
    extend type Company {
      owner: User!
    }
  `

  const fullSchema = mergeSchemas({
    schemas: [
      usersSchema,
      companiesSchema,
      relationsSchema
    ],
    resolvers: {
      User: {
        company: {
          fragment: `... on User { companyId }`,
          resolve(user, _args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: companiesSchema,
              operation: 'query',
              fieldName: 'company',
              args: {
                id: user.companyId,
              },
              context,
              info
            })
          }
        }
      },
      Company: {
        owner: {
          fragment: `... on Company { id }`,
          resolve(company, _args, context, info) {
            return info.mergeInfo.delegateToSchema({
              schema: usersSchema,
              operation: 'query',
              fieldName: 'userByCompany',
              args: {
                companyId: company.id,
              },
              context,
              info
            })
          }
        }
      }
    }
  })

  const server = new GraphQLServer({ schema: fullSchema })
  server.start({ port: PORT }, () => console.log(`Server is running on localhost:${ PORT }`))
}

init().catch(console.error.bind(console))
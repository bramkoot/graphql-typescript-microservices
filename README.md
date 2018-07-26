# GraphQL Typescript Microservices

This project contains two microservices and an API gateway that are using GraphQL. The API gatway uses schema stitching and remote schemas to redirect requests to the microservices. 

## Run using ts-node

To run, use `yarn ts-node src` in every folder (users, companies and graphql-master as the last one) and go to `http://localhost:4000` to access the GraphQL playground. 
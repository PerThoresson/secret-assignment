# Setup
## Prerequisites
- Node.js
- Docker
## Running
- Install dependencies `npm install`
- Start the db `npm run start:docker`
- Run db migrations `npm run db:migrate`
- Start app `npm run start:dev`

# Usage
## Uploading data
```
curl -X POST http://localhost:3000/articles -H "Content-Type: application/json" -d @./articles.json
```
```
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d @./products.json
```
## Making queries
Get all products
```
curl --request GET \
  --url http://localhost:3000/products
```
Buy Products
```
curl --request PUT \
  --url http://localhost:3000/products/buy \
  --header 'Content-Type: application/json' \
  --data '{
	"products": [
		{"id": 9, "quantity": 1}
	]
}'
```

# Development
## Running test suit
- Make sure the db is running and that the latest migrations have been run. If not:
  - Start the db `npm run start:docker`
  - Run db migrations `npm run db:migrate`
- Run `npm test`

# Assumptions
- Input data can be sent via HTTP 
- Uploading an article again will update the stock property according to the new data
- You can not upload a product with the same name again.
- Input data is valid (😉)

# Proccess
We could have done without a database entirely as this is an example assignment. But as I think it's fun I included one anyways

I usually start with the data model. What is it we need to store, what will the access patterns be etc. Then we can start building the database structure. I went with a Postgres DB with simple associations. The DB consists of three tables. Products, Articles and a join table ProductsArticles. As for picking an ORM I've seen a lot of hype around Prisma but never got the chance to check it out so perfect time! One fun thing is that you can run a simple visual database browser with `npx prisma studio`

To simplify the local development setup for other developers I put the DB in a docker container.

I added a linter and prettier. These should be extended with team specific rules that we come up with.

# Future work
There is a lot to do in order for this to be a complete service. Here follows a sample of what I would like to do in order to get this more production ready:
- Testing
  - Add more test cases. I just added a unit test and a simple integration test for showcasing.
  - Have the integration test DB run separetely from your local dev DB to not wipe your local environment when running the integration test suite.
- Input validation
  - I did not add any input validation but if this was a real application we would need to validate the input. Potentially with something like Zod which has the possibility to give you typings based on the validated data.
- .env file should most likely not be comitted, I added it due to simplicity with the Prisma lib.
- A proper logger such as winston
- Add API docs with Swagger
- Depending on the preferred way of deploying we probably want to add a Dockerfile for the node app.

### Database
Another discussion should be had around the database access pattern. For this simple assignment I'm doing far more queries than necessary when inserting articles and products due to a lack in Prisma in terms of doing "createMany" with many-to-many associations. If the number of products/articles in the jsoin files would increase a lot we should probably make this into a batch insert instead of many inserts as it is now.
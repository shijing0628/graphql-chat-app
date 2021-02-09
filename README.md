### chat app - graphql+mysql_sequelize

2021-2-7

http://localhost:4000/

frontend repo link: https://github.com/shijing0628/graphql-chat-app-client

- https://github.com/apollographql/apollo-server
- https://sequelize.org/master/manual/getting-started.html
- https://www.apollographql.com/docs/tutorial/introduction/

**some command in console**

- sequelize model:generate (Generates a model and its migration)
- sequelize init
- sequelize --help
- npm install mysql2 -g
- npm i -g sequelize-cli
- npm install --save sequelize
- npm install node-sass
- sequelize db:migrate:undo:all (for seeds)
- sequelize db:seed:all
- sequelize model:generate --name Message --attributes content:String,uuid:uuid,from:string,to:string (cli create a message table)
  <br>
  https://www.youtube.com/watch?v=aieNcEqCLHg&list=PLMhAeHCz8S3_VYiYxpcXtMz96vePOuOX3&index=3
  <br>
  http://www.semlinker.com/node-sequelize-quickstart/

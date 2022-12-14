import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';

import { CacheModule, Module } from '@nestjs/common';
import { GqlContextType, GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './Excel/excel.controller';
import { AppResolver } from './Excel/excel.resolver';
import { AppService } from './Excel/excel.service';
import { AuthModule } from './Auth/auth.module';
import { MessageConsumer } from './Excel/message.consumer';
import { MessageProducerService } from './Excel/message.provider';
import { TodoModule } from './Todo/todo.module';
import { UserModule } from './User/user.module';
const jwt = require('jsonwebtoken')

@Module({
  imports: [CacheModule.register(),

  GraphQLModule.forRoot<ApolloDriverConfig>({

    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    installSubscriptionHandlers: true,
    context: (connection, req) => {
      // console.log(req)
      return connection
    },
    subscriptions: {
      'subscriptions-transport-ws': {
        onConnect: async (connectionParams) => {
          const connectionParamsLowerKeys: Object = connectionParams.Authorization
          const authToken = connectionParams.Authorization;
          const token = authToken.split(' ')[1]
          // // extract user information from token
          const user = await jwt.verify(token, 'secretKey')
          // // return user info to add them to the context later
          return {
            currentUser: user.username,
            user,
            headers: { authorization: connectionParamsLowerKeys },
          };
        },
      },
    },


  }), UserModule, AuthModule, TodoModule,
  MongooseModule.forRoot('mongodb+srv://huongdz2003:Huongdzcogisai2003@nodeexpressprojects.ybqix.mongodb.net/TodoList'),
  BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }),
  BullModule.registerQueue({
    name: "message-queue"
  }),

  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, MessageProducerService, MessageConsumer],
})
export class AppModule { }

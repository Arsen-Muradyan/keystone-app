const dotenv = require("dotenv").config();
const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const PROJECT_NAME = "Keystone Blog";
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const adapterConfig = { mongoUri: process.env.MONGO_URI };
const { AuthedRelationship  } = require('@keystonejs/fields-authed-relationship')

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: process.env.COOKIE_SECRET,
});

const isAdmin = ({authentication: {item: user}}) => {
  return !!user && !!user.isAdmin
}
const isLoggedIn = ({authentication: {item: user}}) => {
  return !!user;
}

const PostSchema = require("./lists/Post");
const UserSchema = require("./lists/User");

keystone.createList("Post", {
  fields: {
    ...PostSchema.fields,
    author: {
      type: AuthedRelationship,
      ref: 'User', 
      access: {
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin
      }
    }
  },
  access: {
    read: true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn
  }
});
keystone.createList("User", {
  fields: UserSchema.fields,
  access: {
    read: true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin
  }
});

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "User",
  config: {
    identifyField: "email",
    secretField: "password",
  },
});
module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: PROJECT_NAME,
      enableDefaultRoute: true,
      authStrategy,
      isAccessAllowed: isLoggedIn
    }),
  ],
};

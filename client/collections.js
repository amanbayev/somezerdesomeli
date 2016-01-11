Schools = new Mongo.Collection("schools");
Branches = new Mongo.Collection("branches");
Meteor.subscribe("schools");
Meteor.subscribe("branches");

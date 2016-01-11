Schools = new Mongo.Collection("schools");
Branches = new Mongo.Collection("branches");
Subjects = new Mongo.Collection("subjects");
Teachers = new Mongo.Collection("teachers");
Groups = new Mongo.Collection("groups");
Students = new Mongo.Collection('students');

Meteor.subscribe("schools");
Meteor.subscribe("branches");
Meteor.subscribe("subjects");
Meteor.subscribe("teachers");
Meteor.subscribe("groups");
Meteor.subscribe("students");

Schools = new Mongo.Collection("schools");
Branches = new Mongo.Collection("branches");
Subjects = new Mongo.Collection("subjects");
Teachers = new Mongo.Collection("teachers");
Groups = new Mongo.Collection("groups");
Students = new Mongo.Collection('students');
Attendances = new Mongo.Collection('attendances');
Money = new Mongo.Collection('money');
PurseTransactions = new Mongo.Collection('PurseTransactions');


Meteor.subscribe("schools");

Meteor.subscribe("branches");
Meteor.subscribe("subjects");
Meteor.subscribe("teachers");
Meteor.subscribe("groups");
Meteor.subscribe("students");
Meteor.subscribe("attendances");
Meteor.subscribe('users');
Meteor.subscribe("money");
Meteor.subscribe("PurseTransactions");

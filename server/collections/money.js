Money = new Mongo.Collection('money');
Meteor.publish("money", function(argument){
  return Money.find({isActive:true});
});

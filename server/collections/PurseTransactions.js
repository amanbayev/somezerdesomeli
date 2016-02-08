PurseTransactions = new Mongo.Collection('PurseTransactions');
Meteor.publish("PurseTransactions", function(argument){
  return PurseTransactions.find({isActive:true},{sort: {'date':-1}});
});
Meteor.methods({
  addPurseTransaction: function(TransactionJSON){
    TransactionJSON.createdBy = this.userId;
    TransactionJSON.createdAt = new Date();
    TransactionJSON.isActive = true;
    var trId = PurseTransactions.insert(TransactionJSON);

    return trId;
  }
});

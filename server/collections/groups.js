Groups = new Mongo.Collection('groups');
Meteor.publish("groups", function(argument){
  return Groups.find({isActive:true});
});
Meteor.methods({
  deleteGroup: function(rowId){
    Groups.update({_id:rowId}, {$set:{
      isActive: false
    }});
  },
  addGroup: function(GroupJSON){
    GroupJSON.createdBy = this.userId;
    GroupJSON.createdAt = new Date();
    GroupJSON.isActive = true;
    GroupJSON.students = [];
    return Groups.insert(GroupJSON);
  },
  editGroup: function(GroupId, GroupJSON){
    Groups.update(
      {_id:GroupId},
      {
        $set:
        {
          name : GroupJSON.name,
          address : GroupJSON.address,
          isActive: GroupJSON.isActive,
          students: GroupJSON.students,
          updatedAt: new Date(),
          updatedBy: this.userId
        }
      });
  },
  getGroupsCount: function(){
    return Groups.find({isActive:true}).count();
  }
});

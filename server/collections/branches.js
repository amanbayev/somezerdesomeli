Branches = new Mongo.Collection('branches');
Meteor.publish("branches", function(argument){
  return Branches.find({isActive:true});
});
Meteor.methods({
  deleteBranch: function(rowId){
    Branches.update({_id:rowId}, {$set:{
      isActive: false
    }});
  },
  addBranch: function(BranchJSON){
    BranchJSON.createdBy = this.userId;
    BranchJSON.createdAt = new Date();
    BranchJSON.isActive = true;
    BranchJSON.students = [];
    return Branches.insert(BranchJSON);
  },
  editBranch: function(schoolId, schoolJSON){
    Branches.update(
      {_id:schoolId},
      {
        $set:
        {
          name : schoolJSON.name,
          address : schoolJSON.address,
          isActive: schoolJSON.isActive,
          students: schoolJSON.students,
          updatedAt: new Date(),
          updatedBy: this.userId
        }
      });
  },
  getBranchesCount: function(){
    return Branches.find({isActive:true}).count();
  }
});

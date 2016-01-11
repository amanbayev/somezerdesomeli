Schools = new Mongo.Collection('schools');
Meteor.publish("schools", function(argument){
  return Schools.find({
    isActive: true
  });
});
Meteor.methods({
  deleteSchool: function(rowId){
    Schools.update({_id:rowId}, {$set:{
      isActive: false
    }});
  },
  addSchool: function(schoolJSON){
    schoolJSON.createdBy = this.userId;
    schoolJSON.createdAt = new Date();
    schoolJSON.isActive = true;
    schoolJSON.students = [];
    return Schools.insert(schoolJSON);
  },
  editSchool: function(schoolId, schoolJSON){
    Schools.update(
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
  getSchoolsCount: function(){
    var count = Schools.find({isActive: true}).count();
    return count;
  }
});

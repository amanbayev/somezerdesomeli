Students = new Mongo.Collection('students');
Meteor.publish("students", function(argument){
  return Students.find({isActive:true});
});
Meteor.methods({
  deleteStudent: function(rowId){
    Students.update({_id:rowId}, {$set:{
      isActive: false
    }});
  },
  addStudent: function(StudentJSON){
    StudentJSON.createdBy = this.userId;
    StudentJSON.createdAt = new Date();
    StudentJSON.isActive = true;
    StudentJSON.students = [];
    return Students.insert(StudentJSON);
  },
  editStudent: function(StudentId, StudentJSON){
    Students.update(
      {_id:StudentId},
      {
        $set:
        {
          name : StudentJSON.name,
          address : StudentJSON.address,
          isActive: StudentJSON.isActive,
          students: StudentJSON.students,
          updatedAt: new Date(),
          updatedBy: this.userId
        }
      });
  },
  getStudentsCount: function(){
    return Students.find({isActive:true}).count();
  }
});

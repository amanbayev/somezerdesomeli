Subjects = new Mongo.Collection('subjects');
Meteor.publish("subjects", function(argument){
  return Subjects.find({isActive:true});
});
Meteor.methods({
  deleteSubject: function(rowId){
    Subjects.update({_id:rowId}, {$set:{
      isActive: false
    }});
  },
  addSubject: function(SubjectJSON){
    SubjectJSON.createdBy = this.userId;
    SubjectJSON.createdAt = new Date();
    SubjectJSON.isActive = true;
    SubjectJSON.students = [];
    SubjectJSON.teachers = [];
    return Subjects.insert(SubjectJSON);
  },
  editSubject: function(schoolId, schoolJSON){
    Subjects.update(
      {_id:schoolId},
      {
        $set:
        {
          name : schoolJSON.name,
          address : schoolJSON.address,
          isActive: schoolJSON.isActive,
          students: schoolJSON.students,
          teachers: schoolJSON.teachers,
          updatedAt: new Date(),
          updatedBy: this.userId
        }
      });
  },
  getSubjectsCount: function(){
    return Subjects.find({isActive:true}).count();
  }
});

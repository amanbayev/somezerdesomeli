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
    var sId = Students.insert(StudentJSON);
    var groups = StudentJSON.groups;
    groups.forEach(function(gId,index){
      var cGroup = Groups.findOne({_id: gId});
      var groupStudents = cGroup.students;
      var add = true;
      groupStudents.forEach(function(studentId, ind){
        if (studentId === sId)
          add = false;
      });
      if (add){
        groupStudents.push(sId);
        Groups.update({_id:gId}, {$set:{
          students: groupStudents
        }});
      }
    });
    return sId;
  },
  editStudent: function(StudentId, StudentJSON, removedGroups){
    Students.update(
      {_id:StudentId},
      {
        $set:
        {
          firstName : StudentJSON.firstName,
          lastName : StudentJSON.lastName,
          patronimicName : StudentJSON.patronimicName,
          mobile : StudentJSON.mobile,
          groups: StudentJSON.groups,
          branch : StudentJSON.branch,
          discount: StudentJSON.discount,
          school: StudentJSON.school,
          isActive: StudentJSON.isActive,
          updatedAt: new Date(),
          updatedBy: this.userId
        }
    });
    var sId = StudentId;
    var groups = StudentJSON.groups;
    groups.forEach(function(groupObj, i){
      var add = true;
      var cGroup = Groups.findOne({_id:groupObj});
      var groupStudents = cGroup.students;
      groupStudents.forEach(function(gsId, ind){
        if (gsId === sId)
          add = false;
      });
      if (add) {
        groupStudents.push(sId);
        Groups.update({_id: cGroup._id},
          {$set:{
            students: groupStudents
        }});
      }
    });
    removedGroups.forEach(function(o,i){
      var cGroup = Groups.findOne({_id:o});
      var groupStudents = cGroup.students;
      groupStudents.forEach(function(gsId, ind){
        if (gsId === sId) {
          groupStudents.splice(ind, 1);
        }
      });
      Groups.update({_id:cGroup._id}, {$set:{
        students: groupStudents
      }});
    });
  },
  getStudentsCount: function(){
    return Students.find({isActive:true}).count();
  }
});

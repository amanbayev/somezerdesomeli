Teachers = new Mongo.Collection('teachers');
Meteor.publish("teachers", function(argument){
  return Teachers.find({isActive:true}, {sort: {lastName:1, firstName:1}});
});

Meteor.methods({
  deleteTeacher: function(rowId){
    Teachers.update({_id:rowId}, {$set:{
      isActive: false
    }});
  },
  addTeacher: function(TeacherJSON){
    TeacherJSON.createdBy = this.userId;
    TeacherJSON.createdAt = new Date();
    TeacherJSON.isActive = true;
    TeacherJSON.debts = [];
    TeacherJSON.paymentsDue = [];
    TeacherJSON.attendances = [];
    TeacherJSON.groups = [];
    TeacherJSON.students = [];
    var subs = TeacherJSON.subjects;
    var teacherId = Teachers.insert(TeacherJSON);
    if ((subs !== []) || (subs !== undefined)) {
      subs.forEach(function(o,i){
        var sCursor = Subjects.findOne({_id:o, isActive:true});
        if (sCursor) {
          var sTeachers = sCursor.teachers;
          var add = sTeachers.indexOf(teacherId);
          // sTeachers.forEach(function(oo,ii){
          //   if (oo = teacherId) {
          //     add = false;
          //   }
          // });
          if (add === -1){
            sTeachers.push(teacherId);
            Subjects.update({_id:sCursor._id}, {$set:{
              teachers: sTeachers
            }});
          }
        }
      });
    }
    return teacherId;
  },
  editTeacher: function(teacherId, teacherJSON){
    var cTeacher = Teachers.findOne({_id : teacherId });
    var origSubs = cTeacher.subjects;
    Teachers.update(
      {_id:teacherId},
      {
        $set:
        {
          firstName : teacherJSON.firstName,
          lastName: teacherJSON.lastName,
          patronimicName: teacherJSON.patronimicName,
          mobile: teacherJSON.mobile,
          address : teacherJSON.address,
          isActive: teacherJSON.isActive,
          subjects: teacherJSON.subjects,
          debts: teacherJSON.debts,
          percent: teacherJSON.percent,
          students: teacherJSON.students,
          paymentsDue: teacherJSON.paymentsDue,
          attendances: teacherJSON.attendances,
          interestRate: teacherJSON.interestRate,
          updatedAt: new Date(),
          updatedBy: this.userId
        }
      });
    var subs = teacherJSON.subjects;
    console.log(subs+', original is '+origSubs+' and tId is '+teacherId);
    if ((subs !== []) || (subs !== undefined)) {
      origSubs.forEach(function(orSubId, orSubIndex) {
        var deleted = subs.indexOf(orSubId);
        if (deleted === -1) {
          var cDeletedSubject = Subjects.findOne({_id : orSubId });
          var newTeachers = cDeletedSubject.teachers;
          var position = newTeachers.indexOf(teacherId);
          console.log('removing teacher from subject '+cDeletedSubject.name);
          newTeachers.splice(position,1);
          Subjects.update({_id : orSubId }, {$set: {
            teachers: newTeachers
          }});
        }
      });
      subs.forEach(function(o,i){
        console.log('for subject id: '+o);
        var sCursor = Subjects.findOne({_id:o, isActive:true});
        if (sCursor) {
          var sTeachers = sCursor.teachers;
          var add = sTeachers.indexOf(teacherId);
          if (add === -1) {
            sTeachers.push(teacherId);
            Subjects.update({_id:sCursor._id}, {$set:{
              teachers: sTeachers
            }});
          }
        }
      });
    }
    return teacherId;
  },
  getTeachersCount: function(){
    return Teachers.find({isActive:true}).count();
  }
});

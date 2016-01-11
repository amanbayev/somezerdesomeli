Template.groups.onRendered(function(){
  $("#GroupSubjectsSelect")[0].selectedIndex = 0;
});

Template.groups.helpers({
  'isCreatingGroup': function(){
    return Session.get('isCreatingGroup');
  },
  Teachers: function(){
    var sId = Session.get('currentGroupSubjectId');
    var sCursor = Subjects.findOne({_id:sId, isActive:true});
    if (sCursor === undefined) return [];
    else {
      var teachers = sCursor.teachers;
      var teacherNames = [];
      teachers.forEach(function(o,i){
        var cTeacher = Teachers.findOne({_id:o, isActive: true});
        var temp = {};
        temp.firstName = cTeacher.firstName;
        temp.lastName = cTeacher.lastName;
        temp._id = cTeacher._id;
        teacherNames.push(temp);
      });
      return teacherNames;
    }
  },
  Subjects: function(){
    return Subjects.find({isActive:true},{sort: {name:1}});
  },
  groupTeachers: function(){
    return Session.get('thisGroupTeachers');
  },
  getTeacherById: function(rowId){
    var cTeacher = Teachers.findOne({_id:rowId});
    return cTeacher.firstName + ' ' + cTeacher.lastName;
  },
  hideOrNot: function(){
    if (Session.get('isCreatingGroup'))
      {
        return "show";
        console.log('showing');
      }
    else
    {
      return "hidden";
      console.log('hiding');
    }
  },
  createButtonShow: function(){
    if (Session.get('isCreatingGroup'))
      return "hidden";
    else
      return "show";
  },
  deleteButtonShow: function(){
    if (Session.get('isEditingGroup'))
      return "show";
    else {
      return "hidden";
    }
  }
});

Template.groups.events({
  "change #GroupSubjectsSelect": function(e,t){
    e.preventDefault();
    var sName = t.find('#GroupSubjectsSelect').value;
    console.log('sName = '+sName);
    var sCursor = Subjects.findOne({name: sName});
    Session.set('currentGroupSubjectId',sCursor._id);
  },
  "click #createNewGroup": function(e, t){
     e.preventDefault();
     Session.set('isCreatingGroup', true);
     Session.set('isEditingGroup', false);
  },
  "click #cancelGroupCreate": function(e, t){
     e.preventDefault();
     Session.set('isCreatingGroup', false);
     if ('isEditingGroup') {
       $('#'+Session.get('currentGroupId')).removeClass('warning');
       Session.set('isEditingGroup', false);
     }
  },
  "click .removeTeacherFromGroup": function(e,t){
    e.preventDefault();
    var sId = $(e.currentTarget).attr("id");
    var teachers = Session.get('thisGroupTeachers');
    teachers.forEach(function(o,i){
      if (o === sId){
        teachers.splice(i,1);
      }
    });
    Session.set('thisGroupTeachers',teachers);
  },
  "click #addTeacherToGroup": function(e, t){
     e.preventDefault();
     var fullName = t.find('#GroupTeachersSelect').value;
     var nameArr = fullName.split(' ');
     var fName = nameArr[0];
     var lName = nameArr[1];
     var cTeacher = Teachers.findOne({
       firstName: fName,
       lastName: lName
     });
     var teachers = Session.get('thisGroupTeachers');
     if (teachers === undefined) teachers = [];
     teachers.push(cTeacher._id);
     Session.set('thisGroupTeachers', teachers);
  }
});

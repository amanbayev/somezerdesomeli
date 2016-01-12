Template.students.helpers({
  Branches: function(){
    return Branches.find({isActive:true});
  },
  Groups: function(){
    return Groups.find({isActive:true});
  },
  hideOrNot: function(){
    if (Session.get('isCreatingStudent'))
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
    if (Session.get('isCreatingStudent'))
      return "hidden";
    else
      return "show";
  },
  deleteButtonShow: function(){
    if (Session.get('isEditingStudent'))
      return "show";
    else {
      return "hidden";
    }
  },
  studentGroups: function(){
    return Session.get('thisStudentGroups');
  },
  getGroupNameById: function(gId){
    return Groups.findOne({_id:gId}).name;
  },
  getGroupById: function(gId){
    var cGroup = Groups.findOne({_id: gId});
    var gName = cGroup.name;
    var gTeacherArr = cGroup.teachers;
    var gTeachers = '';
    var comma = false;
    var cSep = ', ';
    gTeacherArr.forEach(function(o,i){
      var cTeacher = Teachers.findOne({_id:o});
      var tName = cTeacher.firstName + ' ' + cTeacher.lastName;
      if (comma) gTeachers += cSep;
      gTeachers += tName;
      comma = true;
    })
    // gTeachers = gTeachers.substring(0, gTeachers.length - 2);
    // console.log('teachers: '+gTeachers);
    return gName + ' (' + gTeachers + ')';
  },
  Schools: function(){
    return Schools.find({isActive:true});
  }
});

Template.students.events({
  "click #createNewStudent": function(e, t){
     e.preventDefault();
     if ('isEditingStudent') {
       $('#'+Session.get('currentStudentId')).removeClass('warning');
       Session.set('isEditingStudent', false);
     }
     t.find('#studentFirstNameField').value = '';
     t.find('#studentLastName').value = '';
     t.find('#studentPatronimicName').value = '';
     t.find('#studentMobileField').value = '';
     t.find('#studentDiscountField').value = '0';
     Session.set('thisStudentGroups', []);
     Session.set('isCreatingStudent', true);
     $('#createStudentForm').removeClass('animated bounceOutLeft');
     $('#createStudentForm').addClass('animated bounceInLeft');
  },
  "click #cancelStudent": function(e,t){
    e.preventDefault();
    Session.set('isCancellingStudent', true);
    // Session.set('isEditingStudent', false);
    // Session.set('isCreatingStudent', false);
    $('#createStudentForm').removeClass('animated bounceInLeft');
    $('#createStudentForm').addClass('animated bounceOutLeft');
    $('#createStudentForm').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
     function(){
       if (Session.get('isCancellingStudent')){
         Session.set('isEditingStudent', false);
         Session.set('isCreatingStudent', false);
         Session.set('isCancellingStudent', false);
       }
     });
  },
  "click #addGroupToStudent": function(e,t){
    e.preventDefault();
    var gName = t.find('#studentGroupSelect').value;
    // console.log('group name to add: '+gName);
    var cGroup = Groups.findOne({_id: gName});
    var groups = Session.get('thisStudentGroups');
    var add = true;
    if (groups === undefined)
      groups = [];
    else
      groups.forEach(function(o,i){
        if (o === cGroup._id)
          add = false;
      });

    if (add) {
      groups.push(cGroup._id);
      Session.set('thisStudentGroups', groups);
    }
  },
  "click .removeGroupFromStudent": function(e,t){
    e.preventDefault();
    var gId = $(e.currentTarget).attr("id");
    var groups = Session.get('thisStudentGroups');
    groups.forEach(function(o,i){
      if (o===gId)
        groups.splice(i,1);
    });
    Session.set('thisStudentGroups', groups);
  },
  "click #saveStudent": function(e,t){
    e.preventDefault();
    var fName = t.find('#studentFirstNameField').value;
    var lName = t.find('#studentLastName').value;
    var pName = t.find('#studentPatronimicName').value;
    var mobile = t.find('#studentMobileField').value;
    var branch = t.find('#studentBranchField').value;
    var discount = t.find('#studentDiscountField').value;
    var school = t.find('#studentSchoolSelect').value;
    var groups = Session.get('thisStudentGroups');

  }
});

Template.students.helpers({
  Branches: function(){
    return Branches.find({isActive:true});
  },
  Groups: function(){
    return Groups.find({isActive:true});
  },
  totalStudentsCount: function(){
    return Students.find({isActive:true}).length;
  },
  Students: function(){
    return Students.find({isActive:true});
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
    console.log(gId+' is the group id');
    var cGroup = Groups.findOne({_id:gId});
    console.log(cGroup);
    if (cGroup)
      return cGroup.name;
    else '';
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
     if (Session.get('isEditingStudent')) {
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
    if (Session.get('isEditingStudent')) {
      $('#'+Session.get('currentStudentId')).removeClass('warning');
      Session.set('isEditingStudent', false);
    }
    $('#createStudentForm').removeClass('animated bounceOutRight');
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
    console.log(school);
    var groups = Session.get('thisStudentGroups');
    var StudentJSON = {};
    StudentJSON.firstName = fName;
    StudentJSON.lastName = lName;
    StudentJSON.patronimicName = pName;
    StudentJSON.mobile = mobile;
    StudentJSON.branch = branch;
    StudentJSON.discount = discount;
    StudentJSON.school = school;
    StudentJSON.groups = groups;
    if (Session.get('isEditingStudent')){
      var cStudent = Students.findOne({_id: Session.get('currentStudentId')});
      StudentJSON.isActive = cStudent.isActive;
      StudentJSON.attendances = cStudent.attendances;
      if (StudentJSON.attendances === undefined)
        StudentJSON.attendances = [];
      StudentJSON.createdAt = cStudent.createdAt;
      StudentJSON.createdBy = cStudent.createdBy;
      var originalStudentGroups = Session.get('originalStudentGroups');
      var removedGroups = [];
      originalStudentGroups.forEach(function(gId, ind){
        var add = true;
        groups.forEach(function(ngId, nind){
          if (gId === ngId)
            add=false;
        })
        if (add)
          removedGroups.push(gId);
      });
      Meteor.call('editStudent',
        cStudent._id,
        StudentJSON,
        removedGroups,
        function(error){
          if (error) console.log('error: '+error.reason);
          else {
            toastr.success(fName+' '+lName+' оқушы өзгерістері сақталды');
            Session.set('currentStudentId', undefined);
            Session.set('originalStudentGroups', []);
            $('#'+cStudent._id).removeClass('warning');

            $('#createStudentForm').removeClass('animated bounceOutRight');
            $('#createStudentForm').removeClass('animated bounceInLeft');
            $('#createStudentForm').addClass('animated bounceOutLeft');
            $('#createStudentForm').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
             function(){

                 Session.set('isEditingStudent', false);
                 Session.set('isCreatingStudent', false);
                 Session.set('isCancellingStudent', false);
               
             });
          }
        }
      );
    } else {
      Meteor.call('addStudent', StudentJSON, function(error){
        if (error)
          console.log(error.reason);
        else
        {
          toastr.success(fName+' '+lName+' оқушы тіркелді');
          $('#createStudentForm').removeClass('animated bounceOutRight');
          $('#createStudentForm').removeClass('animated bounceInLeft');
          $('#createStudentForm').addClass('animated bounceOutLeft');
          $('#createStudentForm').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
           function(){

               Session.set('isEditingStudent', false);
               Session.set('isCreatingStudent', false);
               Session.set('isCancellingStudent', false);

           });
        }
      });
    }
  },
  "click .dataRow": function (e,t){
    e.preventDefault();

    if (Session.get('isEditingStudent')) {
      $('#'+Session.get('currentStudentId')).removeClass('warning');
      Session.set('isEditingStudent', false);
      $('#createStudentForm').removeClass('animated bounceInLeft');
      $('#createStudentForm').addClass('animated bounceOutRight');
      $('#createStudentForm').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
       function(){
         $('#createStudentForm').removeClass('animated bounceOutRight');
         $('#createStudentForm').addClass('animated bounceInLeft');
         Session.set('isCreatingStudent',true);
         Session.set('isEditingStudent',true);
       });
    } else {
      $('#createStudentForm').removeClass('animated bounceOutLeft');
      $('#createStudentForm').addClass('animated bounceInLeft');
      Session.set('isCreatingStudent',true);
      Session.set('isEditingStudent',true);
    }
    var sId = $(e.currentTarget).attr('id');
    Session.set('currentStudentId', sId);
    var cStudent = Students.findOne({_id: sId});
    t.find('#studentFirstNameField').value = cStudent.firstName;
    t.find('#studentLastName').value = cStudent.lastName;
    t.find('#studentPatronimicName').value = cStudent.patronimicName;
    t.find('#studentMobileField').value = cStudent.mobile;
    t.find('#studentDiscountField').value = cStudent.discount;
    schoolId = cStudent.school;
    // $('#studentSchoolSelect option:[value="'+schoolId+'"]');
    $('#studentSchoolSelect').val(schoolId);
    Session.set('thisStudentGroups', cStudent.groups);
    Session.set('originalStudentGroups', cStudent.groups);
    e.currentTarget.classList.add('warning');
  }
});

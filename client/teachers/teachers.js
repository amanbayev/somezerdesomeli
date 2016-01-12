Template.teachers.helpers({
  teacherGroupsCount: function(gArr){
    var counter = 0;
    gArr.forEach(function(o,i){
      var tG = Groups.findOne({_id:o, isActive:true});
      if (tG) counter++;
    });
    return counter;
  },
  Subjects: function(){
    return Subjects.find({isActive:true});
  },
  teacherSubjects: function(){
    return Session.get('thisTeacherSubjects');
  },
  isCreatingTeacher: function(){
    return Session.get('isCreatingTeacher');
  },
  Teachers: function(){
    return Teachers.find({isActive: true});
  },
  hideOrNot: function(){
    if (Session.get('isCreatingTeacher'))
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
    if (Session.get('isCreatingTeacher'))
      return "hidden";
    else
      return "show";
  },
  deleteButtonShow: function(){
    if (Session.get('isEditingTeacher'))
      return "show";
    else {
      return "hidden";
    }
  },
  getSubjectById: function(sId){
    var sCursor = Subjects.findOne({_id:sId});
    return sCursor.name;
  }
});


Template.teachers.events({
  "click .removeSubjectFromTeacher": function(e,t){
    e.preventDefault();
    var sId = $(e.currentTarget).attr("id");
    var subjects = Session.get('thisTeacherSubjects');
    subjects.forEach(function(o,i){
      if (o === sId){
        subjects.splice(i,1);
      }
    });
    Session.set('thisTeacherSubjects',subjects);
  },
  "click #deleteTeacherEdit": function(e,t){
    e.preventDefault();
    var rowId = Session.get('currentTeacherId');
    Meteor.call('deleteTeacher', rowId, function(error){
    });
    toastr.success("Мектеп архивке жіберілді");

    Session.set('currentTeacherId', undefined);
    Session.set('isCreatingTeacher', false);
    Session.set('isEditingTeacher', false);
  },
  "click .dataRow": function(e,t){
    if ('isEditingTeacher') {
      $('#'+Session.get('currentTeacherId')).removeClass('warning');
      Session.set('isEditingTeacher', false);
    }
    var rowId = $(e.currentTarget).attr('id');
    Session.set('currentTeacherId', rowId);
    Session.set('isCreatingTeacher', true);
    Session.set('isEditingTeacher', true);
    var cTeacher = Teachers.findOne({_id:rowId});

    t.find('#TeacherNameField').value = cTeacher.firstName;
    t.find('#TeacherLastNameField').value = cTeacher.lastName;
    t.find('#TeacherPatronimicNameField').value = cTeacher.patronimicName;
    t.find('#TeacherMobileField').value = cTeacher.mobilePhone;
    t.find('#TeacherPercentField').value = cTeacher.percent;
    Session.set('thisTeacherSubjects', cTeacher.subjects);

    e.currentTarget.classList.add('warning');
  },
  "click #addSubjectToTeacher": function(e,t){
    e.preventDefault();
    var sName = t.find("#TeacherSubjectsSelect").value;
    var sCursor = Subjects.findOne({name:sName});

    var subjects = Session.get('thisTeacherSubjects');

    if (subjects === undefined)
      {
        subjects = [];
      }

    var ok = true;

    subjects.forEach(function(o,i){
      if (o === sCursor._id) {
        ok = false;
      }
    });

    if (ok) {
      subjects.push(sCursor._id);
      Session.set('thisTeacherSubjects', subjects);
    }
  },
  "click #createNewTeacher": function(e, t){
     e.preventDefault();
     Session.set('isCreatingTeacher', true);
     Session.set('isEditingTeacher', false);
  },
  "click #cancelTeacherCreate": function(e, t){
     e.preventDefault();
     Session.set('isCreatingTeacher', false);
     if ('isEditingTeacher') {
       $('#'+Session.get('currentTeacherId')).removeClass('warning');
       Session.set('isEditingTeacher', false);
     }
     t.find('#TeacherNameField').value = "";
     t.find('#TeacherLastNameField').value = "";
     t.find('#TeacherPatronimicNameField').value = "";
     t.find('#TeacherMobileField').value = "";
     t.find('#TeacherPercentField').value = "";
     Session.set('thisTeacherSubjects',[]);
  },
  "click #saveTeacherCreate":function(e,t){
    e.preventDefault();

    var sName = t.find('#TeacherNameField').value;
    var sLastName = t.find('#TeacherLastNameField').value;
    var sPName = t.find('#TeacherPatronimicNameField').value;
    var sMobile = t.find('#TeacherMobileField').value;
    var sPercent = t.find('#TeacherPercentField').value;
    var sSubjects = Session.get('thisTeacherSubjects');
    if (sSubjects === undefined)
      sSubjects = [];
    var TeacherJSON = {};

    TeacherJSON.firstName = sName;
    TeacherJSON.lastName = sLastName;
    TeacherJSON.patronimicName = sPName;
    TeacherJSON.mobilePhone = sMobile;
    TeacherJSON.percent = sPercent;
    TeacherJSON.subjects = sSubjects;
    // TeacherJSON.students = [];

    t.find('#TeacherNameField').value = "";
    t.find('#TeacherLastNameField').value = "";
    t.find('#TeacherPatronimicNameField').value = "";
    t.find('#TeacherMobileField').value = "";
    t.find('#TeacherPercentField').value = "";
    Session.set('thisTeacherSubjects',[]);

    if (Session.get('isEditingTeacher')){
      var cTeacher = Teachers.findOne({_id:Session.get('currentTeacherId')});
      $("#"+cTeacher._id).removeClass('warning');
      TeacherJSON.isActive = cTeacher.isActive;
      TeacherJSON.debts = cTeacher.debts;
      TeacherJSON.paymentsDue = cTeacher.paymentsDue;
      TeacherJSON.attendances = cTeacher.attendances;
      TeacherJSON.groups = cTeacher.groups;
      if (cTeacher.students === undefined)
        TeacherJSON.students = [];
      else
        TeacherJSON.students = cTeacher.students;
      // subjects etc

      Meteor.call('editTeacher',
        Session.get('currentTeacherId'),
        TeacherJSON, function(error){
        if (error)
          console.log(error);
        else {
          toastr.success(sName+' мектеп өзгерістері сақталды');
          Session.set('isEditingTeacher',false);
          Session.set('isCreatingTeacher', false);
        }
      });
    } else {
      Meteor.call('addTeacher',TeacherJSON, function(error){
        if (error)
          console.log(error.reason);
        else
        {
          toastr.success(sName+' мектебі тіркелді');
          Session.set('isCreatingTeacher', false);
        }
      });
    }
  }
});

// Template.groups.onRendered(function(){
//   $("#GroupSubjectsSelect")[0].selectedIndex = 0;
// });

Template.groups.helpers({
  getTeachers: function(tArr){
    var teachers = [];
    tArr.forEach(function(o,i){
      var cTeacher = Teachers.findOne({_id:o});
      var fName = cTeacher.firstName + ' ' + cTeacher.lastName;
      teachers.push(fName);
    })
    return teachers;
  },
  Groups: function(){
    return Groups.find({isActive:true},{sort: {name:1}});
  },
  isCreatingGroup: function(){
    return Session.get('isCreatingGroup');
  },
  Branches: function(){
    return Branches.find({isActive:true},{sort: {name:1}});
  },
  Teachers: function(){
    var sId = Session.get('currentGroupSubjectId');
    if (sId === undefined) return [];
    var sCursor = Subjects.findOne({_id:sId, isActive:true});
    if (sCursor === undefined) return [];
    else {
      var teachers = sCursor.teachers;
      var TeacherNames = [];
      teachers.forEach(function(o,i){
        var cTeacher = Teachers.findOne({_id:o, isActive: true});
        var temp = {};
        temp.firstName = cTeacher.firstName;
        temp.lastName = cTeacher.lastName;
        temp._id = cTeacher._id;
        TeacherNames.push(temp);
      });
      return TeacherNames;
    }
  },
  Subjects: function(){
    return Subjects.find({isActive:true},{sort: {name:1}});
  },
  groupTeachers: function(){
    return Session.get('thisGroupTeachers');
  },
  getTeacherById: function(rowId){
    var cGroup = Teachers.findOne({_id:rowId});
    return cGroup.firstName + ' ' + cGroup.lastName;
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
  "click .dataRow": function(e,t){
    // e.preventDefault();
    if (Session.get('isEditingGroup')) {
      $('#'+Session.get('currentGroupId')).removeClass('warning');
      Session.set('isEditingGroup', false);
    }
    var rowId = $(e.currentTarget).attr('id');
    Session.set('currentGroupId', rowId);
    Session.set('isCreatingGroup', true);
    Session.set('isEditingGroup', true);
    var cGroup = Groups.findOne({_id:rowId});

    t.find('#GroupNameField').value = cGroup.name;
    t.find('#GroupPrice').value = cGroup.price;
    t.find('#GroupBranch').value = cGroup.branch;
    t.find('#GroupSubjectsSelect').value = cGroup.subject;
    Session.set('thisGroupTeachers', cGroup.teachers);
    Session.set('originalTeachers', cGroup.teachers);

    e.currentTarget.classList.add('warning');
  },
  "click #deleteGroupEdit": function(e,t){
    e.preventDefault();
    var rowId = Session.get('currentGroupId');
    Meteor.call('deleteGroup', rowId, function(error){
    });
    toastr.success("Топ архивке жіберілді");

    Session.set('currentGroupId', undefined);
    Session.set('isCreatingGroup', false);
    Session.set('isEditingGroup', false);
    Session.set('thisGroupTeachers', []);
  },
  "change #GroupSubjectsSelect": function(e,t){
    e.preventDefault();
    var sName = t.find('#GroupSubjectsSelect').value;
    console.log('sName = '+sName);
    var sCursor = Subjects.findOne({name: sName});
    Session.set('currentGroupSubjectId',sCursor._id);
    Session.set('thisGroupTeachers', []);
  },
  "click #createNewGroup": function(e, t){
     e.preventDefault();
     Session.set('isCreatingGroup', true);
     Session.set('isEditingGroup', false);
  },
  "click #cancelGroupCreate": function(e, t){
     e.preventDefault();
     Session.set('isCreatingGroup', false);
     Session.set('thisGroupTeachers', []);
     t.find('#GroupNameField').value = "";
     t.find('#GroupPrice').value = "";

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
    //  console.log(nameArr);
     var groups = Session.get('thisGroupTeachers');
     if (groups === undefined) groups = [];
     var add = true;
     groups.forEach(function(o,i){
       if (o === cTeacher._id)
        add = false;
     });
     if (add) {
       groups.push(cTeacher._id);
       Session.set('thisGroupTeachers', groups);
     }
  },
  "click #saveGroupCreate":function(e,t){
    e.preventDefault();

    var gName = t.find('#GroupNameField').value;
    var gPrice = t.find('#GroupPrice').value;
    var gBranch = t.find('#GroupBranch').value;
    var gSubject = t.find('#GroupSubjectsSelect').value;
    var gPricePerDay = t.find('#GroupDailyPrice').value;
    var gTeachers = Session.get('thisGroupTeachers');
    var originalTeachers = Session.get('originalTeachers');

    if (originalTeachers === undefined)
      originalTeachers = [];

    if (gTeachers === undefined)
      gTeachers = [];

    var GroupJSON = {};

    GroupJSON.name = gName;
    GroupJSON.price = gPrice;
    GroupJSON.branch = gBranch;
    GroupJSON.pricePerDay = gPricePerDay;
    GroupJSON.subject = gSubject;
    GroupJSON.teachers = gTeachers;
    // GroupJSON.students = [];

    t.find('#GroupNameField').value = "";
    t.find('#GroupPrice').value = "";
    t.find('#GroupDailyPrice').value = "";
    Session.set('thisGroupTeachers',[]);

    if (Session.get('isEditingGroup')){
      var cGroup = Groups.findOne({_id:Session.get('currentGroupId')});
      $("#"+cGroup._id).removeClass('warning');
      GroupJSON.isActive = cGroup.isActive;
      GroupJSON.attendances = cGroup.attendances;

      if (cGroup.students === undefined)
        GroupJSON.students = [];
      else
        GroupJSON.students = cGroup.students;

      var removedTeachers = [];
      originalTeachers.forEach(function(tId, ind){
        var add = true;
        gTeachers.forEach(function(nId, i){
          if (tId === nId)
            add = false;
        });
        if (add)
          removedTeachers.push(tId);
      });


      Meteor.call('editGroup',
        Session.get('currentGroupId'),
        GroupJSON,
        removedTeachers,
        function(error){
        if (error)
          console.log(error);
        else {
          toastr.success(gName+' топ өзгерістері сақталды');
          Session.set('isEditingGroup',false);
          Session.set('isCreatingGroup', false);
        }
      });
    } else {
      Meteor.call('addGroup',GroupJSON, function(error){
        if (error)
          console.log(error.reason);
        else
        {
          toastr.success(gName+' топ тіркелді');
          Session.set('isCreatingGroup', false);
        }
      });
    }
  }
});

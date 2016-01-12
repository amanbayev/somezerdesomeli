Template.subjects.helpers({
  isCreatingSubject: function(){
    return Session.get('isCreatingSubject');
  },
  Subjects: function(){
    return Subjects.find({});
  },
  hideOrNot: function(){
    if (Session.get('isCreatingSubject'))
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
    if (Session.get('isCreatingSubject'))
      return "hidden";
    else
      return "show";
  },
  deleteButtonShow: function(){
    if (Session.get('isEditingSubject'))
      return "show";
    else {
      return "hidden";
    }
  }
});

Template.subjects.events({
  "click #deleteSubjectEdit": function(e,t){
    e.preventDefault();
    var rowId = Session.get('currentSubjectId');
    Meteor.call('deleteSubject', rowId, function(error){
    });
    toastr.success("Пән архивке жіберілді");

    Session.set('currentSubjectId', undefined);
    Session.set('isCreatingSubject', false);
    Session.set('isEditingSubject', false);
  },
  "click .dataRow": function(e,t){
    if (Session.get('isEditingSubject')){
      var cSubject = Subjects.findOne({_id:Session.get('currentSubjectId')});
      $("#"+cSubject._id).removeClass('warning');
    }
    var rowId = $(e.currentTarget).attr('id');
    Session.set('currentSubjectId', rowId);
    Session.set('isCreatingSubject', true);
    Session.set('isEditingSubject', true);
    var cSubject = Subjects.findOne({_id:rowId});
    t.find('#SubjectNameField').value = cSubject.name;
    e.currentTarget.classList.add('warning');
  },
  "click #createNewSubject": function(e, t){
     e.preventDefault();
     Session.set('isCreatingSubject', true);
     Session.set('isEditingSubject', false);
  },
  "click #cancelSubjectCreate": function(e, t){
     e.preventDefault();
     Session.set('isCreatingSubject', false);
     if ('isEditingSubject') {
       $('#'+Session.get('currentSubjectId')).removeClass('warning');
       Session.set('isEditingSubject', false);
     }
  },
  "click #saveSubjectCreate":function(e,t){
    e.preventDefault();
    var sName = t.find('#SubjectNameField').value;
    var SubjectJSON = {};
    SubjectJSON.name = sName;
    t.find('#SubjectNameField').value = "";
    if (Session.get('isEditingSubject')){
      var cSubject = Subjects.findOne({_id:Session.get('currentSubjectId')});
      $("#"+cSubject._id).removeClass('warning');
      SubjectJSON.students = cSubject.students;
      SubjectJSON.teachers = cSubject.teachers;
      SubjectJSON.isActive = cSubject.isActive;

      Meteor.call('editSubject',
        Session.get('currentSubjectId'),
        SubjectJSON, function(error){
        if (error)
          console.log(error);
        else {
          toastr.success(sName+' мектеп өзгерістері сақталды');
          Session.set('isEditingSubject',false);
          Session.set('isCreatingSubject', false);
        }
      });
    } else {
      Meteor.call('addSubject',SubjectJSON, function(error){
        if (error)
          console.log(error.reason);
        else
        {
          toastr.success(sName+' мектебі тіркелді');
          Session.set('isCreatingSubject', false);
        }
      });
    }
  }
});

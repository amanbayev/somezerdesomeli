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
     Session.set('thisStudentGroups', []);
     Session.set('isCreatingStudent', true);
  },
  "click #cancelStudent": function(e,t){
    e.preventDefault();
    Session.set('isEditingStudent', false);
    Session.set('isCreatingStudent', false);
  }
});

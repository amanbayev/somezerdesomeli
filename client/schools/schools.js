Template.schools.helpers({
  isCreatingSchool: function(){
    return Session.get('isCreatingSchool');
  },
  Schools: function(){
    return Schools.find({isActive:true});
  },
  hideOrNot: function(){
    if (Session.get('isCreatingSchool'))
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
    if (Session.get('isCreatingSchool'))
      return "hidden";
    else
      return "show";
  },
  deleteButtonShow: function(){
    if (Session.get('isEditingSchool'))
      return "show";
    else {
      return "hidden";
    }
  }
});

Template.schools.events({
  "click #deleteSchoolEdit": function(e,t){
    e.preventDefault();
    var rowId = Session.get('currentSchoolId');
    Meteor.call('deleteSchool', rowId, function(error){
    });
    toastr.success("Мектеп архивке жіберілді");

    Session.set('currentSchoolId', undefined);
    Session.set('isCreatingSchool', false);
    Session.set('isEditingSchool', false);
  },
  "click .dataRow": function(e,t){
    if ('isEditingSchool') {
      $('#'+Session.get('currentSchoolId')).removeClass('warning');
      Session.set('isEditingSchool', false);
    }
    var rowId = $(e.currentTarget).attr('id');
    Session.set('currentSchoolId', rowId);
    Session.set('isCreatingSchool', true);
    Session.set('isEditingSchool', true);
    var cSchool = Schools.findOne({_id:rowId});
    t.find('#schoolNameField').value = cSchool.name;
    sAddress = t.find('#schoolAddressField').value = cSchool.address;
    e.currentTarget.classList.add('warning');
  },
  "click #createNewSchool": function(e, t){
     e.preventDefault();
     Session.set('isCreatingSchool', true);
     Session.set('isEditingSchool', false);
  },
  "click #cancelSchoolCreate": function(e, t){
     e.preventDefault();
     Session.set('isCreatingSchool', false);
     if ('isEditingSchool') {
       $('#'+Session.get('currentSchoolId')).removeClass('warning');
       Session.set('isEditingSchool', false);
     }
  },
  "click #saveSchoolCreate":function(e,t){
    e.preventDefault();
    var sName = t.find('#schoolNameField').value;
    var sAddress = t.find('#schoolAddressField').value;
    var SchoolJSON = {};
    SchoolJSON.name = sName;
    SchoolJSON.address = sAddress;
    t.find('#schoolNameField').value = "";
    t.find('#schoolAddressField').value = "";
    if (Session.get('isEditingSchool')){
      var cSchool = Schools.findOne({_id:Session.get('currentSchoolId')});
      $("#"+cSchool._id).removeClass('warning');
      SchoolJSON.students = cSchool.students;
      SchoolJSON.isActive = cSchool.isActive;

      Meteor.call('editSchool',
        Session.get('currentSchoolId'),
        SchoolJSON, function(error){
        if (error)
          console.log(error);
        else {
          toastr.success(sName+' мектеп өзгерістері сақталды');
          Session.set('isEditingSchool',false);
          Session.set('isCreatingSchool', false);
        }
      });
    } else {
      Meteor.call('addSchool',SchoolJSON, function(error){
        if (error)
          console.log(error.reason);
        else
        {
          toastr.success(sName+' мектебі тіркелді');
          Session.set('isCreatingSchool', false);
        }
      });
    }
  }
});

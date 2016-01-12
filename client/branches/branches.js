Template.branches.helpers({
  isCreatingBranch: function(){
    return Session.get('isCreatingBranch');
  },
  Branches: function(){
    return Branches.find({
      isActive: true
    });
  },
  hideOrNot: function(){
    if (Session.get('isCreatingBranch'))
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
    if (Session.get('isCreatingBranch'))
      return "hidden";
    else
      return "show";
  },
  deleteButtonShow: function(){
    if (Session.get('isEditingBranch'))
      return "show";
    else {
      return "hidden";
    }
  }
});


Template.branches.events({
  "click #deleteBranchEdit": function(e,t){
    e.preventDefault();
    var rowId = Session.get('currentBranchId');
    Meteor.call('deleteBranch', rowId, function(error){
    });
    toastr.success("Филиал архивке жіберілді");

    Session.set('currentBranchId', undefined);
    Session.set('isCreatingBranch', false);
    Session.set('isEditingBranch', false);
  },
  "click .dataRow": function(e,t){
    if (Session.get('isEditingBranch')){
      var cBranch = Branches.findOne({_id:Session.get('currentBranchId')});
      $("#"+cBranch._id).removeClass('warning');
    }
    var rowId = $(e.currentTarget).attr('id');
    Session.set('currentBranchId', rowId);
    Session.set('isCreatingBranch', true);
    Session.set('isEditingBranch', true);
    var cBranch = Branches.findOne({_id:rowId});
    t.find('#branchNameField').value = cBranch.name;
    sAddress = t.find('#branchAddressField').value = cBranch.address;
    e.currentTarget.classList.add('warning');
  },
  "click #createNewBranch": function(e, t){
     e.preventDefault();
     Session.set('isCreatingBranch', true);
     Session.set('isEditingBranch', false);
  },
  "click #cancelBranchCreate": function(e, t){
     e.preventDefault();
     Session.set('isCreatingBranch', false);
     if ('isEditingBranch') {
       $('#'+Session.get('currentBranchId')).removeClass('warning');
       Session.set('isEditingBranch', false);
     }
  },
  "click #saveBranchCreate":function(e,t){
    e.preventDefault();
    var sName = t.find('#branchNameField').value;
    var sAddress = t.find('#branchAddressField').value;
    var BranchJSON = {};
    BranchJSON.name = sName;
    BranchJSON.address = sAddress;
    t.find('#branchNameField').value = "";
    t.find('#branchAddressField').value = "";
    if (Session.get('isEditingBranch')){
      var cBranch = Branches.findOne({_id:Session.get('currentBranchId')});
      $("#"+cBranch._id).removeClass('warning');
      BranchJSON.students = cBranch.students;
      BranchJSON.isActive = cBranch.isActive;

      Meteor.call('editBranch',
        Session.get('currentBranchId'),
        BranchJSON, function(error){
        if (error)
          console.log(error);
        else {
          toastr.success(sName+' мектеп өзгерістері сақталды');
          Session.set('isEditingBranch',false);
          Session.set('isCreatingBranch', false);
        }
      });
    } else {
      Meteor.call('addBranch',BranchJSON, function(error){
        if (error)
          console.log(error.reason);
        else
        {
          toastr.success(sName+' мектебі тіркелді');
          Session.set('isCreatingBranch', false);
        }
      });
    }
  }
});

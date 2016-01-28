Template.managers.helpers({
  registeredUsers: function(){
    return Meteor.users.find({});
  },
  addOne: function(number){
    return number + 1;
  },
  checkManager: function(id){
    var bool = Roles.userIsInRole(id,['manager']);
    return bool;
  },
  checkChecker: function(id){
    var bool = Roles.userIsInRole(id, ['checker']);
    return bool;
  },
  checkAccountant: function(id){
    var bool = Roles.userIsInRole(id, ['accountant']);
    return bool;
  }
});

Template.managers.events({
  "change .isManagerCheckbox": function(e, t){
    var id = e.currentTarget.id;
    var state = e.currentTarget.checked;
    if (state) {
      Meteor.call('makeManager', id, function(error){
        if (error) console.log(error);
        else
        console.log('success');
      });
    } else {
        Meteor.call('removeManager', id, function(error){
          if (error) {
            console.log(error);
            toastr.error(error.reason);
          }
          else
          console.log('success');
        });
    }
  },
  "change .isAccountantCheckbox": function(e, t){
    var id = e.currentTarget.id;
    var state = e.currentTarget.checked;
    if (state) {
      Meteor.call('makeAccountant', id, function(error){
        if (error) console.log(error);
        else
        console.log('success');
      });
    } else {
        Meteor.call('removeAccountant', id, function(error){
          if (error) {
            console.log(error);
            toastr.error(error.reason);
          }
          else
          console.log('success');
        });
    }
  },
  "change .isCheckerCheckbox": function(e, t){
    var id = e.currentTarget.id;
    var state = e.currentTarget.checked;
    if (state) {
      Meteor.call('makeChecker', id, function(error){
        if (error) console.log(error);
        else
        console.log('success');
      });
    } else {
        Meteor.call('removeChecker', id, function(error){
          if (error) {
            console.log(error);
            toastr.error(error.reason);
          }
          else
          console.log('success');
        });
    }
  }
});

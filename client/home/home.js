Template.Home.onRendered(function(){
  var self = this;
    if (self.view.isRendered) {
        var body = $('body');
            body.removeClass();
            body.addClass("skin-blue sidebar-mini");

        $(function () {
            MeteorAdminLTE.run()
        });
    }
});

Template.Home.events({
  "click #registerBtnR": function(e, t){
    e.preventDefault();
    var name = t.find("#nameFieldR").value;
    var Lname = t.find("#lastNameFieldR").value;
    var Pname = t.find("#pNameFieldR").value;
    var email = t.find("#loginFieldR").value;
    var pw = t.find("#passwordFieldR").value;
    var pw2 = t.find("#passwordAgainFieldR").value;
    var ok = true;
    toastr.options.closeButton = true;
    toastr.options.preventDuplicates = true;
    toastr.options.progressBar = true;
    toastr.info(pw);
    if (name === '') {
      ok = false;
      toastr.error('Сіздің атыңыз формада толтырынбаған','Атыңызды толтырыңыз');
    }
    if (ok) {
      // var userJSON = {};
      // userJSON.username = email;
      // userJSON.email = email;
      // userJSON.password = pw;
      // userJSON.profile = {};

      var userObject = {
        email: email,
        password: pw,
        profile: {}
      };

      userObject.profile.firstName = name;
      userObject.profile.lastName = Lname;
      userObject.profile.patronimic = Pname;

      Accounts.createUser(userObject, function(){
         console.log('success');
         toastr.success('Сіз тіркелдіңіз');
         Session.set('isRegisteringUser',false);
      });
    }
  },
  "click #signOutButton": function(event, template){
     event.preventDefault();
     Meteor.logout();
     Router.go('/');
  },
  "click #signUpBtn": function(e, t){
    e.preventDefault();
    Session.set('isRegisteringUser',true);
  },
  "click #loginBtn": function(e,t){
    e.preventDefault();
    var email = t.find("#loginField").value;
    var pw = t.find("#passwordField").value;
    // console.log(email+' '+pw);
    Meteor.loginWithPassword(email, pw, function(error){
      if (error) {
        if (error.error === 403) {
          toastr.error('Мұндай адам тіркелмеген','Қате');
        }
        console.log(error);
      } else {
        console.log('success');
        toastr.success('Қощ келдіңіз, '+Meteor.user().profile.firstName);
      }
    })
  },
  "click #cancelBtnR": function(e,t){
    e.preventDefault();
    Session.set('isRegisteringUser',false);
  }
});

Template.Home.helpers({
  isRegisteringUser: function(){
    return Session.get('isRegisteringUser');
  }
});

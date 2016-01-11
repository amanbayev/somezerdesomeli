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

Template.Home.onRendered(function(){
  toastr.options.closeButton = true;
  toastr.options.preventDuplicates = true;
  toastr.options.progressBar = true;
});

Template.Home.events({
  "click #signOutButton": function(event, template){
     event.preventDefault();
     Meteor.logout();
     Router.go('/');
  }
});

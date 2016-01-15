Template.attendances.onRendered(function () {
  moment.locale('kk', {
        months : 'Қаңтар_Ақпан_Наурыз_Сәуір_Мамыр_Маусым_Шілде_Тамыз_Қыркүйек_Қазан_Қараша_Желтоқсан'.split('_'),
        monthsShort : 'Қаң_Ақп_Нау_Сәу_Мам_Мау_Шіл_Там_Қыр_Қаз_Қар_Жел'.split('_'),
        weekdays : 'Жексенбі_Дүйсенбі_Сейсенбі_Сәрсенбі_Бейсенбі_Жұма_Сенбі'.split('_'),
        weekdaysShort : 'Жек_Дүй_Сей_Сәр_Бей_Жұм_Сен'.split('_'),
        weekdaysMin : 'Жк_Дй_Сй_Ср_Бй_Жм_Сн'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'HH:mm:ss',
            L : 'DD.MM.YYYY',
            LL : 'D MMMM YYYY',
            LLL : 'D MMMM YYYY HH:mm',
            LLLL : 'dddd, D MMMM YYYY HH:mm'
        },
        calendar : {
            sameDay : '[Бүгін сағат] LT',
            nextDay : '[Ертең сағат] LT',
            nextWeek : 'dddd [сағат] LT',
            lastDay : '[Кеше сағат] LT',
            lastWeek : '[Өткен аптаның] dddd [сағат] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : '%s ішінде',
            past : '%s бұрын',
            s : 'бірнеше секунд',
            m : 'бір минут',
            mm : '%d минут',
            h : 'бір сағат',
            hh : '%d сағат',
            d : 'бір күн',
            dd : '%d күн',
            M : 'бір ай',
            MM : '%d ай',
            y : 'бір жыл',
            yy : '%d жыл'
        },
        ordinalParse: /\d{1,2}-(ші|шы)/,
        ordinal : function (number) {
            var a = number % 10,
                b = number >= 100 ? 100 : null;
            return number + (suffixes[number] || suffixes[a] || suffixes[b]);
        },
        week : {
            dow : 1, // Monday is the first day of the week.
            doy : 7  // The week that contains Jan 1st is the first week of the year.
        }
  });

  $.fn.datepicker.dates['kk'] = {
      days: ["Жексенбі", "Дүйсенбі","Сейсенбі","Сәрсенбі","Бейсенбі","Жұма","Сенбі"],
      daysShort:["Жек","Дүй","Сей","Сәр","Бей","Жұм","Сен"],
      daysMin:["Жк","Дс","Сс","Ср","Бс","Жм","Сн"],
      months:["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"],
      monthsShort:["Қаң","Ақп","Нау","Сәу","Мамыр","Мау","Шлд","Тмз","Қыр","Қзн","Қар","Жел"],
      today:"Бүгін",
      clear: "Болдырмау",
      format: "d MM (dd.mm.yyyy)",
      titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
      weekStart: 1
  };
  $('#attendanceDateField').datepicker({
    language: 'kk',
    autoclose: true,
    todayHighlight: true,
    todayBtn: "linked"
  });

  Session.setDefault('thisAttendanceStudents',[]);
  Session.setDefault('attendingStudents',[]);
  Session.setDefault('excusedStudents',[]);
  Session.setDefault('skippingStudents',[]);
  Session.setDefault('thisAttendanceTeachers',[]);

  Session.setDefault('dateFilter',"0");
  Session.setDefault('groupFilter',"0");
});

Template.attendances.helpers({
  studentsCount: function(aId){
    var cAttendance = Attendances.findOne({_id: aId});
    return cAttendance.students.length;
  },
  missingStudentsCount: function(aId){
    var cAttendance = Attendances.findOne({_id: aId});
    return cAttendance.absentStudents.length + cAttendance.excusedStudents.length;
  },
  getUserById: function(userId){
    var cUser = Meteor.users.findOne({_id:userId});
    return cUser.profile.firstName + ' ' + cUser.profile.lastName;
  },
  getGroupNameById: function(gId){
    var cGroup = Groups.findOne({_id:gId, isActive:true});
    return cGroup.name;
  },
  getDate: function(date){
    var date2 = moment(date).format("DD.MM.YYYY");
    var Fdate = moment(date).format('LL');
    // console.log(date);
    return Fdate + ' ('+date2+')';
  },
  getTeacherNamesByIds: function(tId){
    var cTeacher = Teachers.findOne({_id: tId });
    if (cTeacher)
      return cTeacher.firstName + ' ' + cTeacher.lastName;
  },
  Teachers: function(){
    var subjectId = Session.get('thisGroupSubject');
    var teachers = Subjects.findOne({name:subjectId, isActive:true});
    if (teachers)
      return teachers.teachers;
    else {
      return [];
    }
  },
  addOne: function(number){
    return number + 1;
  },
  getStudentNameById: function(sId){
    var cStudent = Students.findOne({_id: sId, isActive:true});
    if (cStudent) return cStudent.firstName;
    else return '';
  },
  getStudentLastNameById: function(sId){
    var cStudent = Students.findOne({_id: sId, isActive:true});
    if (cStudent) return cStudent.lastName;
    else return '';
  },
  thisAttendanceStudents: function(){
    return Session.get('thisAttendanceStudents');
  },
  Groups: function(){
    return Groups.find({isActive:true});
  },
  Attendances: function(){
    var gDateFilter = Session.get('dateFilter');
    var gFilter = Session.get('groupFilter');
    console.log('filter is being refreshed: '+gFilter);
    if (gFilter === undefined) gFilter = "0";

    var today = new Date();
    var mToday = moment(today);

    if (gDateFilter === undefined) {gDateFilter = "0";}
    switch(gDateFilter) {
      case "0": // all
          if (gFilter !== "0") {
            return Attendances.find({
              isActive:true,
              group: gFilter
            }, {
              sort: {date: -1}
            });
          } else {
            return Attendances.find({
              isActive:true
            }, {
              sort: {date: -1}
            });
          }
          break;
      case "1": // this week
          var startDate = mToday.startOf('week').utc(6).toISOString();
          var endDate = mToday.endOf('week').utc(6).toISOString();
          if (gFilter !== "0") {
            return Attendances.find({
              isActive:true,
              group: gFilter,
              date: {
                  $gte: startDate,
                  $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          } else {
            return Attendances.find({
              isActive:true,
              date: {
                $gte: startDate,
                $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          }
          break;
      case "2": // prev week
          mToday = mToday.subtract(1, 'weeks');
          var startDate = mToday.startOf('week').utc(6).toISOString();
          var endDate = mToday.endOf('week').utc(6).toISOString();
          if (gFilter !== "0") {
            return Attendances.find({
              isActive:true,
              group: gFilter,
              date: {
                  $gte: startDate,
                  $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          } else {
            return Attendances.find({
              isActive:true,
              date: {
                $gte: startDate,
                $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          }
          break;
      case "3": // this month
          var startDate = mToday.startOf('month').utc(6).toISOString();
          var endDate = mToday.endOf('month').utc(6).toISOString();
          if (gFilter !== "0") {
            return Attendances.find({
              isActive:true,
              group: gFilter,
              date: {
                  $gte: startDate,
                  $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          } else {
            return Attendances.find({
              isActive:true,
              date: {
                $gte: startDate,
                $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          }
          break;
      case "4": // last month
          mToday = mToday.subtract(1,'months');
          var startDate = mToday.startOf('month').utc(6).toISOString();
          var endDate = mToday.endOf('month').utc(6).toISOString();
          if (gFilter !== "0") {
            return Attendances.find({
              isActive:true,
              group: gFilter,
              date: {
                  $gte: startDate,
                  $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          } else {
            return Attendances.find({
              isActive:true,
              date: {
                $gte: startDate,
                $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          }
          break;
      case "5": // this year
          var startDate = mToday.startOf('year').utc(6).toISOString();
          var endDate = mToday.endOf('year').utc(6).toISOString();
          if (gFilter !== "0") {
            return Attendances.find({
              isActive:true,
              group: gFilter,
              date: {
                  $gte: startDate,
                  $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          } else {
            return Attendances.find({
              isActive:true,
              date: {
                $gte: startDate,
                $lt: endDate
              }
            }, {
              sort: {date: -1}
            });
          }
          break;
      default: gDateFilter = "0";
    }

    if (gFilter !== "0") {
      return Attendances.find({
        isActive:true,
        group: gFilter
      }, {
        sort: {date: -1}
      });
    }
    console.log('returning all');
    return Attendances.find({
      isActive:true
    }, {
      sort: {date: -1}
    });
  },
  hideOrNot: function(){
    if (Session.get('isCreatingAttendance'))
      {
        return "show";
      }
    else
    {
      return "hidden";
    }
  },
  createButtonShow: function(){
    if (Session.get('isCreatingAttendance'))
      return "hidden";
    else
      return "show";
  },
  deleteButtonShow: function(){
    if (Session.get('isEditingAttendance'))
      return "show";
    else {
      return "hidden";
    }
  },
  groupName: function(){
    return Session.get('thisGroupName');
  },
  teachersNames: function(){
    var teacherIds = Session.get('thisAttendanceTeachers');
    var tNames = [];
    if (teacherIds) {
      teacherIds.forEach(function(tId, ind){
        var cTeacher = Teachers.findOne({_id: tId});
        if (cTeacher)
          tNames.push({id : cTeacher._id, firstName : cTeacher.firstName, lastName : cTeacher.lastName });
      });
    }
    return tNames;
  },
  thisGroupSubjectName: function(){
    var gId = Session.get('thisGroupId');
    var cGroup = Groups.findOne({_id: gId , isActive: true });
    if (cGroup){
      Session.set('thisGroupSubject', cGroup.subject);
      return cGroup.subject;
    }
    else {
      return '(топты таңданыз)';
    }
  }
});

Template.attendances.events({
  "click .filterByDateDD": function(e,t){
    e.preventDefault();
    var val1 = $(e.currentTarget).attr('value');
    var text1 = $(e.currentTarget).text();
    console.log(val1+' '+text1);
    Session.set('dateFilter', val1);
    if (val1 === undefined) val1 = "0";

    t.find('#filterByDateBtn').value=val1;
    $('#filterByDateBtn').text(text1);
  },
  "click .filterByGroupDD": function(e,t){
    e.preventDefault();
    var val1 = $(e.currentTarget).attr('value');
    var text1 = $(e.currentTarget).text();
    console.log(val1 + ' ' + text1);
    if (val1 === undefined) val1 = "0";
    t.find('#filterByGroupBtn').value = val1;
    $('#filterByGroupBtn').text(text1);

    Session.set('groupFilter', val1);
  },
  // "change #filterByGroupSelect": function(e,t){
  //   e.preventDefault();
  //   var newFilterGroup = t.find('#filterByGroupSelect').value;
  //   // console.log(newFilterGroup);
  //   Session.set('groupFilter', newFilterGroup);
  // },
  "click .addTeacherToAttendance": function(e, t){
    e.preventDefault();
    var tId = t.find('#selectTeacherForAttendance').value;
    var teachers = Session.get('thisAttendanceTeachers');
    if (teachers) {
      var add = true;
      teachers.forEach(function(tId2, ind){
        if (tId === tId2)
          add = false;
      });
      if (add) {
        teachers.push(tId);
        Session.set('thisAttendanceTeachers', teachers);
      }
    }
  },
  "click .removeTeacherFromAttendance": function(e, t){
    e.preventDefault();
    var thisId = $(e.currentTarget).attr('id');

    var thisTeachers = Session.get('thisAttendanceTeachers');
    if (thisTeachers.length < 2) {
      // console.log('the only teacher');
      toastr.warning('Бір ғана мұғалімді алып тастауға болмайды. Басқа мұғалімді қосыңыз алдымен.');
    } else {
      thisTeachers.forEach(function(tId, ind){
        if (tId === $(e.currentTarget).attr('id'))
        {
          thisTeachers.splice(ind,1);
        }
      });
      Session.set('thisAttendanceTeachers', thisTeachers);

    }
  },
  "change #attendanceGroupSelect": function(e,t){
    e.preventDefault();
    var gId = t.find('#attendanceGroupSelect').value;
    var cGroup = Groups.findOne({isActive:true, _id: gId});
    if (cGroup) {
      Session.set('thisGroupName', cGroup.name);
      Session.set('thisAttendanceStudents', cGroup.students);
      Session.set('attendingStudents', cGroup.students);
      Session.set('skippingStudents', []);
      Session.set('excusedStudents', []);
      Session.set('thisGroupId', cGroup._id);
      Session.set('thisAttendanceTeachers', cGroup.teachers);
      $('.excusedBtn').removeClass('btn-warning');
      $('.excusedBtn').removeClass('btn-default');
      $('.excusedBtn').addClass('btn-default');
      $('.skippingBtn').removeClass('btn-danger');
      $('.skippingBtn').removeClass('btn-default');
      $('.skippingBtn').addClass('btn-default');
      $('.attendingBtn').removeClass('btn-success');
      $('.attendingBtn').removeClass('btn-default');
      $('.attendingBtn').addClass('btn-success');
    }
  },
  "click #createNewAttendance": function(e, t){
    e.preventDefault();
    Session.set('isCreatingAttendance', true);
    Session.set('isEditingAttendance', false);
    $("#attendanceGroupSelect :nth-child(1)").attr("selected", "selected");
    var gId = t.find('#attendanceGroupSelect').value;
    var cGroup = Groups.findOne({isActive:true, _id: gId});
    Session.set('thisAttendanceStudents', cGroup.students);
    Session.set('attendingStudents', cGroup.students);
    Session.set('skippingStudents', []);
    Session.set('excusedStudents', []);
    $('.excusedBtn').removeClass('btn-warning');
    $('.excusedBtn').removeClass('btn-default');
    $('.excusedBtn').addClass('btn-default');
    $('.skippingBtn').removeClass('btn-danger');
    $('.skippingBtn').removeClass('btn-default');
    $('.skippingBtn').addClass('btn-default');
    $('.attendingBtn').removeClass('btn-success');
    $('.attendingBtn').removeClass('btn-default');
    $('.attendingBtn').addClass('btn-success');
    Session.set('thisGroupName', cGroup.name);
    Session.set('thisGroupId', cGroup._id);
    Session.set('thisAttendanceTeachers', cGroup.teachers);
    Session.set('isCancellingAttendance', false);
    $('#createAttendanceForm').removeClass('animated bounceOutLeft');
    $('#createAttendanceForm').addClass('animated bounceInLeft');
  },
  "click #cancelAttendance": function(e,t){
    e.preventDefault();
    Session.set('thisAttendanceTeachers',[]);
    Session.set('attendingStudents',[]);
    Session.set('skippingStudents',[]);
    Session.set('excusedStudents',[]);
    Session.set('isCancellingAttendance', true);
    $('#createAttendanceForm').removeClass('animated bounceInLeft');
    $('#createAttendanceForm').addClass('animated bounceOutLeft');
    $('#createAttendanceForm').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
     function(){
       if (Session.get('isCancellingAttendance')){
         Session.set('isEditingAttendance', false);
         Session.set('isCreatingAttendance', false);
         Session.set('isCancellingAttendance', false);
       }
     });
    //to add more editing and reset values
  },
  "click .attendingBtn": function(e,t){
    e.preventDefault();
    e.stopPropagation();
    if (!($(e.currentTarget).hasClass('btn-success'))) {
      var sId = $(e.currentTarget).data('student-id');
      var studentsArr = Session.get('attendingStudents');
      var add = true;
      studentsArr.forEach(function(stId, ind){
        if (stId === sId)
          add = false;
      });
      if (add) {
        studentsArr.push(sId);
        Session.set('attendingStudents', studentsArr);
      }
      $(e.currentTarget).removeClass('btn-default');
      $(e.currentTarget).addClass('btn-success');

      var excused = $(".btn-warning[data-student-id='"+sId+"']");
      if (excused.text()!=='') {
        excused.removeClass('btn-warning');
        excused.addClass('btn-default');
        var excusedArr = Session.get('excusedStudents');
        excusedArr.forEach(function(o,i){
          if (o===sId)
            {
              excusedArr.splice(i,1);
              Session.set('excusedStudents', excusedArr);
            }
        });
      }

      var skipping = $(".btn-danger[data-student-id='"+sId+"']");
      if (skipping.text()!==''){
        skipping.removeClass('btn-danger');
        skipping.addClass('btn-default');
        var skippingArr = Session.get('skippingStudents');
        skippingArr.forEach(function(o,i){
          if (o===sId)
            {
              skippingArr.splice(i,1);
              Session.set('skippingStudents', skippingArr);
            }
        });
      }

    } else
      console.log('already attending');
  },
  "click .excusedBtn": function(e,t){
    e.preventDefault();
    e.stopPropagation();
    if (!($(e.currentTarget).hasClass('btn-warning'))) {
      var sId = $(e.currentTarget).data('student-id');
      var studentsArr = Session.get('excusedStudents');
      var add = true;
      studentsArr.forEach(function(stId, ind){
        if (stId === sId)
          add = false;
      });
      if (add) {
        studentsArr.push(sId);
        Session.set('excusedStudents', studentsArr);
      }
      $(e.currentTarget).removeClass('btn-default');
      $(e.currentTarget).addClass('btn-warning');

      var success = $(".btn-success[data-student-id='"+sId+"']");
      if (success.text()!=='') {
        success.removeClass('btn-success');
        success.addClass('btn-default');
        var attendingArr = Session.get('attendingStudents');
        attendingArr.forEach(function(o,i){
          if (o===sId)
            {
              attendingArr.splice(i,1);
              Session.set('attendingStudents', attendingArr);
            }
        });
      }

      var skipping = $(".btn-danger[data-student-id='"+sId+"']");
      if (skipping.text()!==''){
        skipping.removeClass('btn-danger');
        skipping.addClass('btn-default');
        var skippingArr = Session.get('skippingStudents');
        skippingArr.forEach(function(o,i){
          if (o===sId)
            {
              skippingArr.splice(i,1);
              Session.set('skippingStudents', skippingArr);
            }
        });
      }

    } else
      console.log('already excused');
  },
  "click .skippingBtn": function(e,t){
    e.preventDefault();
    e.stopPropagation();
    if (!($(e.currentTarget).hasClass('btn-danger'))) {
      var sId = $(e.currentTarget).data('student-id');
      var studentsArr = Session.get('skippingStudents');
      var add = true;
      studentsArr.forEach(function(stId, ind){
        if (stId === sId)
          add = false;
      });
      if (add) {
        studentsArr.push(sId);
        Session.set('skippingStudents', studentsArr);
      }
      $(e.currentTarget).removeClass('btn-default');
      $(e.currentTarget).addClass('btn-danger');

      var success = $(".btn-success[data-student-id='"+sId+"']");
      if (success.text()!=='') {

        success.removeClass('btn-success');
        success.addClass('btn-default');
        var attendingArr = Session.get('attendingStudents');
        attendingArr.forEach(function(o,i){
          if (o===sId)
            {
              attendingArr.splice(i,1);
              Session.set('attendingStudents', attendingArr);
            }
        });
      }

      var excused = $(".btn-warning[data-student-id='"+sId+"']");
      if (excused.text()!=='') {
        excused.removeClass('btn-warning');
        excused.addClass('btn-default');
        var excusedArr = Session.get('excusedStudents');
        excusedArr.forEach(function(o,i){
          if (o===sId)
            {
              excusedArr.splice(i,1);
              Session.set('excusedStudents', excusedArr);
            }
        });
      }

    } else
      console.log('already skipping');
  },
  "click #attendanceDateIcon": function(e,t){
    e.preventDefault();
    $('#attendanceDateField').datepicker({
      language: 'kk',
      autoclose: true,
      todayHighlight: true,
      todayBtn: "linked"
    });
    $('#attendanceDateField').focus();
    $('#attendanceDateField').blur();
  },
  "click #attendanceDateField": function(e,t){
    e.preventDefault();
    $('#attendanceDateField').datepicker({
      language: 'kk',
      autoclose: true,
      todayHighlight: true,
      todayBtn: "linked"
    });
    $('#attendanceDateField').focus();
    $('#attendanceDateField').blur();
  },
  "click #saveAttendance": function(e,t){
    e.preventDefault();
    var AttendanceJSON = {};
    var ok = true;
    var date = t.find('#attendanceDateField').value;
    if (date !== '') {
      date = date.split('(');
      date = date[1].split(')');
      var isoDate = moment(date[0], 'DD.MM.YYYY').utc(6).toISOString();
      AttendanceJSON.date = isoDate;
      // console.log('iso date: '+isoDate);
    } else {
      toastr.warning('Күнді таңданыз');
      $('#attendanceDateField').datepicker({
        language: 'kk',
        autoclose: true,
        todayHighlight: true,
        todayBtn: "linked"
      });
      $('#attendanceDateField').focus();
      ok = false;
    }
    var gId = t.find('#attendanceGroupSelect').value;
    AttendanceJSON.group = gId;
    AttendanceJSON.students = Session.get('thisAttendanceStudents');
    AttendanceJSON.attendedStudents = Session.get('attendingStudents');
    AttendanceJSON.absentStudents = Session.get('skippingStudents');
    AttendanceJSON.excusedStudents = Session.get('excusedStudents');
    // console.log(AttendanceJSON.students);
    // console.log('gre: '+AttendanceJSON.attendedStudents);
    // console.log('yel: '+AttendanceJSON.excusedStudents);
    // console.log('red: '+AttendanceJSON.absentStudents);
    AttendanceJSON.teachers = Session.get('thisAttendanceTeachers');
    // ok = false;
    if (ok) {
      Meteor.call('addAttendance', AttendanceJSON, function(error){
        if (error)
          toastr.warning(error.reason);
        else {
          toastr.success('Журнал жазылды!');
          Session.set('thisAttendanceTeachers',[]);
          Session.set('attendingStudents',[]);
          Session.set('skippingStudents',[]);
          Session.set('excusedStudents',[]);
          Session.set('isCancellingAttendance', true);
          $('#createAttendanceForm').removeClass('animated bounceInLeft');
          $('#createAttendanceForm').addClass('animated bounceOutLeft');
          $('#createAttendanceForm').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
           function(){
             if (Session.get('isCancellingAttendance')){
               Session.set('isEditingAttendance', false);
               Session.set('isCreatingAttendance', false);
               Session.set('isCancellingAttendance', false);
             }
           });
        }
      });
    }
  }
});

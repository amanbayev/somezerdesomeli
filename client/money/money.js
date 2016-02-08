Template.money.helpers({
  payToTeacher: function(){
    var tId = Session.get('currentTeacherId');
    var cTeacher = Teachers.findOne({_id:tId, isActive:true});
    var percent = cTeacher.percent;
    var totalToPay = Session.get('totalToPay');
    console.log(totalToPay+" total to pay");
    console.log(percent+" percent");
    return totalToPay / 100 * percent;
  },
  hasAllDataToShow: function(){
    var gId = Session.get('currentGroupId');
    var tId = Session.get('currentTeacherId');
    var mId = Session.get('selectedMonth');
    var yId = Session.get('selectedYear');
    return (gId && tId && mId && yId);
  },
  classPrice: function(){
    var gId = Session.get('currentGroupId');
    if (gId){
      var cGroup = Groups.findOne({_id:gId});
      if (cGroup){
        var pricePerDay = cGroup.pricePerDay;
        return pricePerDay;
      }
    }
  },
  attendanceCount: function(sId){
    var gId = Session.get('currentGroupId');
    if (!gId) return;
    var monthNumber = Session.get('selectedMonth');
    if (monthNumber == undefined) monthNumber = 0;
    var yearNumber = Session.get('selectedYear');
    if (yearNumber == undefined) yearNumber = 2016;
    monthNumber++;
    var dateStr = "01-"+monthNumber+"-"+yearNumber;
    // console.log('dateStr '+dateStr);
    var startDate = moment(dateStr, 'DD-M-YYYY').startOf('month').utc(6).toISOString();
    // console.log('date is '+startDate);
    var endDate = moment(dateStr, 'DD-M-YYYY').endOf('month').utc(6).toISOString();
    Session.set('moneyStartDate',startDate);
    Session.set('moneyEndDate',endDate);
    // console.log('end is '+endDate);
    var attendances = Attendances.find({
      group: gId,
      attendedStudents: {$in: [sId]},
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });
    return attendances.count();
  },
  totalToPay: function(){
    return Session.get('totalToPay');
  },
  totalAttendances: function(){
    var gId = Session.get('currentGroupId');
    var monthNumber = Session.get('selectedMonth');
    if (monthNumber == undefined) monthNumber = 0;
    var yearNumber = Session.get('selectedYear');
    if (yearNumber == undefined) yearNumber = 2016;
    monthNumber++;
    var dateStr = "01-"+monthNumber+"-"+yearNumber;
    // console.log('dateStr '+dateStr);
    var startDate = moment(dateStr, 'DD-M-YYYY').startOf('month').utc(6).toISOString();
    // console.log('date is '+startDate);
    var endDate = moment(dateStr, 'DD-M-YYYY').endOf('month').utc(6).toISOString();
    Session.set('moneyStartDate',startDate);
    Session.set('moneyEndDate',endDate);
    // console.log('end is '+endDate);
    var attendances = Attendances.find({
      group: gId,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });
    var total = 0;
    attendances.forEach(function(cAttend, attendInd){
      // console.log(cAttend.date+' '+cAttend.attendedStudents.length);
      total += cAttend.attendedStudents.length;
    });
    return total;
  },
  classesCount: function(){
    var gId = Session.get('currentGroupId');
    var monthNumber = Session.get('selectedMonth');
    if (monthNumber == undefined) monthNumber = 0;
    var yearNumber = Session.get('selectedYear');
    if (yearNumber == undefined) yearNumber = 2016;
    monthNumber++;
    var dateStr = "01-"+monthNumber+"-"+yearNumber;
    // console.log('dateStr '+dateStr);
    var startDate = moment(dateStr, 'DD-M-YYYY').startOf('month').utc(6).toISOString();

    // console.log('date is '+startDate);
    var endDate = moment(dateStr, 'DD-M-YYYY').endOf('month').utc(6).toISOString();
    Session.set('moneyStartDate',startDate);
    Session.set('moneyEndDate',endDate);
    // console.log('end is '+endDate);
    var attendances = Attendances.find({
      group: gId,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });
    return attendances.count();
  },
  duePayment: function(sId){
    var gId = Session.get('currentGroupId');
    var startDate = Session.get('moneyStartDate');
    var endDate = Session.get('moneyEndDate');
    // console.log('start is '+startDate+' and end is '+endDate);
    var attendances = Attendances.find({
      group: gId,
      date: {
        $gte: startDate,
        $lt: endDate
      },
      attendedStudents: {$in: [sId]}});
    var cGroup = Groups.findOne({_id:gId});
    var pricePerDay = cGroup.pricePerDay;
    var sum = parseInt(pricePerDay) * attendances.count();
    // pricePerDay+' * '+attendances.count()+' = '+
    return sum;
  },
  studentDebt: function(sId){
    var cStudent = Students.find({isActive:true, _id: sId});
    var debt = cStudent.debt;
    if (debt) return debt;
    else return 0;
  },
  studentPurse: function(sId){
    var studentTransactions = PurseTransactions.find({student: sId, isActive:true});
    var total = 0;
    studentTransactions.forEach(function(trans, ind){
      total += trans.amount;
    });
    return total;
  },
  Students: function(){
    var gId = Session.get('currentGroupId');
    if (gId) {
      var cGroup = Groups.findOne({isActive:true, _id: gId});
      if (cGroup){
        // console.log(cGroup.name);
        var students = Students.find(
          {
            isActive: true,
           _id: {$in: cGroup.students}
         });
        // console.log(students.fetch());
        return students;
      } else return [];
    } else return [];
  },
  studentsCount: function(){
    var gId = Session.get('currentGroupId');
    if (gId) {
      var cGroup = Groups.findOne({isActive:true, _id: gId});
      if (cGroup){
        var students = Students.find(
          {
            isActive: true,
           _id: {$in: cGroup.students}
         });

        return students.count();
      }
    }
  },
  totalMoneyMustBePaid: function(){
    return 0;
  },
  Teachers: function(){
    return Teachers.find({isActive:true},{sort: {lastName:1, firstName:1}});
  },
  addOne: function(number){
    return number +1;
  },
  TeacherGroups: function(){
    var tId = Session.get('currentTeacherId');
    if (tId)
      return Groups.find({isActive:true,
        teachers: {$in: [tId] }});
    else return [];
  },
  currentGroupId: function(){
    var sId = Session.get('currentGroupId');
    var cGroup = Groups.findOne({isActive: true, _id: sId});
    if (cGroup){
      $('.subjectNameTableText').removeClass('text-muted');
      $('.subjectNameTableText').addClass('text-success');
      Session.set('currentGroupName', cGroup.name);
      return cGroup.name;
    }
    else {
      $('.subjectNameTableText').removeClass('text-success');
      $('.subjectNameTableText').addClass('text-muted');
      return 'Мұғалім тобын таңданыз';
    }
  },
  getMonths: function(){
    var months = 'Қаңтар_Ақпан_Наурыз_Сәуір_Мамыр_Маусым_Шілде_Тамыз_Қыркүйек_Қазан_Қараша_Желтоқсан'.split('_');
    // console.log(months);
    return months;
  },
  getYears: function(){
    var years = ['2015','2016','2017','2018','2019','2020'];
    return years;
  }
});

Template.money.events({
  "click #saveAndRecount": function(e,t){
    e.preventDefault();
    $('#myModal').modal('show');
  },
  "click #recountMoney": function(e,t){
    e.preventDefault();
    var total = 0;
    $(".paymentPaid").each(function(ind, el){
      // console.log(el.value);
      if (el.value !== '')
        total += parseInt(el.value, 10);
    });
    Session.set('totalToPay', total);
    // console.log('total is '+total);

    var table = t.find('#AttendancesTable');
    // console.log(table);
    for (var i = 0, row; row = table.rows[i]; i++){
      var cell1 = row.cells[4].innerHTML;
      var len1 = cell1.length
      // console.log(cell1.substring(0,len1-7));
      // console.log(row.cells[5].innerHTML);
    }
  },
  "click .teacherSelector": function(e,t){
    e.preventDefault();
    var tId = e.currentTarget.id;
    // console.log(tId);
    Session.set('currentTeacherId', tId);
    $('.teacherNameBtn').text(e.currentTarget.text);
    Session.set('currentGroupId', undefined);
    $('.subjectNameBtn').text('Мұғалім тобын таңданыз');
  },
  "click .subjectSelector": function(e,t){
    e.preventDefault();
    var sId = e.currentTarget.id;
    // console.log(sId);
    Session.set('currentGroupId', sId);
    $('.subjectNameBtn').text(e.currentTarget.text);
  },
  "click #saveChangesAgreeBtn": function(e,t){
    e.preventDefault();
    $('#myModal').modal('hide');

    var total = 0;
    var forTeacherAmount = t.find(".payToTeacherInput").value;
    var TransactionJSON = {};
    TransactionJSON.amount = parseInt(forTeacherAmount,10);
    TransactionJSON.date = moment().utc(6).toISOString();
    TransactionJSON.teacherId = Session.get('currentTeacherId');
    TransactionJSON.forStudent = false;
    Meteor.call("addPurseTransaction", TransactionJSON, function(error, result){
      if(error){
        console.log("error", error);
      }
      if(result){
         console.log("for teacher: "+TransactionJSON);
      }
    });

    console.log(forTeacherAmount);
    $(".paymentPaid").each(function(ind, el){
      // console.log(el.value);
      if (el.value !== '') {
        var sId = el.id;
        var sTransactionNeg = parseInt(el.value, 10);
        var TransactionJSON = {};
        TransactionJSON.amount = -sTransactionNeg;
        TransactionJSON.date = moment().utc(6).toISOString();
        TransactionJSON.student = sId;
        TransactionJSON.forStudent = true;
        Meteor.call("addPurseTransaction", TransactionJSON, function(error, result){
          if(error){
            console.log("error", error);
          }
          if(result){
             console.log(result);
          }
        });
        total += parseInt(el.value, 10);
      }
    });
    Session.set('totalToPay', total);
  },
  "click .monthSelector": function(e,t){
    e.preventDefault();
    var mId = e.currentTarget.id;
    Session.set('selectedMonth', mId);
    $('.monthPickBtn').text(e.currentTarget.text);
    Session.set('totalToPay', 0);
  },
  "click .yearSelector": function(e,t){
    e.preventDefault();
    var yId = e.currentTarget.id;
    Session.set('selectedYear', yId);
    $('.yearPickBtn').text(e.currentTarget.text);
  },
  "change .paymentPaid": function(e,t){
    e.preventDefault();
    var total = 0;
    $(".paymentPaid").each(function(ind, el){
      // console.log(el.value);
      if (el.value !== '')
        total += parseInt(el.value, 10);
    });
    Session.set('totalToPay', total);
    // console.log('total is '+total);
  }
});

Template.money.onRendered(function () {
  Session.set('selectedYear','2016');
  Session.set('selectedMonth',undefined);
  Session.set('totalToPay', 'Есептелмеген');

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
});

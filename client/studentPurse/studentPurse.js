Template.studentPurse.helpers({
  Students: function(){
    return Students.find({isActive:true});
  },
  addOne: function(num){
    return num+1;
  },
  TeacherPurseTransactions: function(){
    return PurseTransactions.find({forStudent:false});
  },
  PurseTransactions: function(){
    return PurseTransactions.find({forStudent:true});
  },
  parseDate: function(date){
    var newDate = moment(date).format('DD.MM.YYYY');
    return newDate;
  },
  getTeacher: function(tId){
    var cTeacher = Teachers.findOne({_id: tId});
    return cTeacher.firstName +' ' + cTeacher.lastName;
  },
  getStudent: function(sId){
    var cStudent = Students.findOne({_id: sId});
    return cStudent.firstName + ' ' + cStudent.lastName;
  },
  getStudentTotal: function(sId){
    var transactions = PurseTransactions.find({student: sId}).fetch();
    // console.log('for studnet '+sId+' trans: '+transactions);
    if (transactions.length > 0) {
      var sum = 0;
      transactions.forEach(function(trObj, trPos){
        // console.log('adding to sum '+sum+' += '+trObj.amount);
        sum += trObj.amount;
      });
      return sum;
    }
    else return 0;
  },
  isCreatingTransaction: function(){
    return Session.get('isCreatingTransaction');
  },
  hideOrNot: function(){
    if (Session.get('isCreatingTransaction'))
      {
        return "show";
      }
    else
    {
      return "hidden";
    }
  },
  createButtonShow: function(){
    if (Session.get('isCreatingTransaction'))
      return "hidden";
    else
      return "show";
  }
});

Template.studentPurse.events({
  "click #saveTransactionCreate": function(e, t){
     e.preventDefault();
     var date = t.find('#DateFieldTransactionCreate').value;
     if (date !== '') {
       date = date.split('(');
       date = date[1].split(')');
       var isoDate = moment(date[0], 'DD.MM.YYYY').utc(6).toISOString();
      //  console.log('iso date: '+isoDate);
     } else {
       toastr.warning('Күнді таңданыз');
       $('#DateFieldTransactionCreate').datepicker({
         language: 'kk',
         autoclose: true,
         todayHighlight: true,
         todayBtn: "linked"
       });
       $('#DateFieldTransactionCreate').focus();
       ok = false;
     }
     var sId = $("#StudentNameTransactionCreate").find('option:selected').attr('id');
    //  console.log(sId);
    var amount = t.find('#AmountTransactionCreate').value;
    var ok = true;
    if (date == '') ok = false;
    if (sId == undefined) ok=false;
    if ((amount == '') ||  (amount == '0')) ok=false;
    if (ok) {
      // console.log('OK!');
      // console.log(amount);
      TransactionJSON = {};
      TransactionJSON.amount = parseInt(amount, 10);
      TransactionJSON.date = isoDate;
      TransactionJSON.forStudent = true;
      TransactionJSON.student = sId;
      Meteor.call('addPurseTransaction', TransactionJSON);
      Session.set('isCreatingTransaction',false);
      t.find('#DateFieldTransactionCreate').value = '';
      t.find('#AmountTransactionCreate').value = '';
    }
  },
  "click #cancelTransactionCreate": function(e, t){
     e.preventDefault();
     Session.set('isCreatingTransaction', false);
  },
  "click #startTransactionCreate": function(e, t){
     e.preventDefault();
     Session.set('isCreatingTransaction', true);
  }
});

Template.studentPurse.onRendered(function () {
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
  $('#DateFieldTransactionCreate').datepicker({
    language: 'kk',
    autoclose: true,
    todayHighlight: true,
    todayBtn: "linked",
    orientation: "top auto"
  });
});

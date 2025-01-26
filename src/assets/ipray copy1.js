const currDate = () => new Date();
const wdays = ["AHAD", "ISNIN", "SELASA", "RABU", "KHAMIS", "JUMAAT", "SABTU"];
const DateTime = {
  year: 0,
  mon: 0,
  day: 0,
  dow: 0,
  yearh: 0,
  monh: 0,
  dayh: 0,
  hour: 0, // Jam dalam 24 jam
  hour12: 0, // Jam dalam 12 jam
  min: 0,
  sec: 0,
  mins: 0,
  time: -1, // Waktu dalam 24 jam (hhmm)
  time12: -1, // Waktu dalam 12 jam (hhmm)
  timesec: -1, // Waktu dalam detik
  days: 0,
  daysm: 0,
  maghrib: 0,
  wnow: 0,
  wmasuk: false,
};
const mdays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const sysData = {};
const mname = [
  "MASIHI",
  "JAN",
  "FEB",
  "MAC",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const hname = [
  "HIJRAH",
  "MUHARRAM",
  "SAFAR",
  "RAB.AWAL",
  "RAB.AKHIR",
  "JAM.AWAL",
  "JAM.AKHIR",
  "REJAB",
  "SYA`BAN",
  "RAMADHAN",
  "SYAWAL",
  "ZULKAEDAH",
  "ZULHIJJAH",
];
const wname = ["MASA", "SUBUH", "SYURUK", "ZOHOR", "ASAR", "MAGHRIB", "ISYAK"];
const cname = ["K.LUMPUR", "MEKAH", "MADINAH", "AL-AQSA"];

function Digit2(dd) {
  if (parseInt(dd) < 10) return "0" + dd;
  return "" + dd;
}
function MinToTime(dd) {
  dd = parseInt(dd);
  return (dd / 60) * 100 + (dd % 60);
}
function TimeToMin(dd) {
  dd = parseInt(dd);
  return (dd / 100) * 60 + (dd % 100);
}
function TimeToVal(txt) {
  var atxt = txt.split(":"),
    min = parseInt(atxt[0]) * 100 + parseInt(atxt[1]);
  return min;
}
/* function ValToTime(dd) {
  dd = parseInt(dd);
  return "" + parseInt(min / 100) + ":" + Digit2(min % 100);
} */
function TimeToTime(dd) {
  var h = parseInt(dd / 100),
    m = parseInt(dd % 100);
  if (h == 0) {
    h = 12;
  } else if (h > 12) {
    h -= 12;
  }
  return "" + h + ":" + Digit2(m);
}
function GetYearDays(year, mon, day) {
  var days = day;
  for (var i = 1; i < mon; i++) days += mdays[i];
  var daysm = days,
    yy = year % 100;
  if (yy > 0) {
    daysm += yy * 365 + parseInt((yy - 1) / 4) + 1;
  }
  return { days, daysm };
}
function convert12To24(jam, period) {
  let hour = parseInt(jam, 10);
  if (period === "PM" && hour !== 12) {
    hour += 12;
  }
  if (period === "AM" && hour === 12) {
    hour = 0;
  }
  return hour;
}

function HijriDate() {
  var DayH = 24; //01 Sabtu
  var MonH = 9; //Jan
  var YearH = 1420; //2000
  var DaysH = DateTime.daysm;
  if (DateTime.maghrib <= DateTime.mins && DateTime.mins < 1440) DaysH++;

  // DayH = sysData.hdata[0];    // start day (24)
  var SetF = 29 - DayH; // first month days
  var DatP = 1,
    BitP = 0;
  var SetS = sysData.hdata[DatP];
  while (DaysH > 0) {
    if (SetS & 0x01) {
      SetF++;
    }
    if (DaysH > SetF) {
      DayH = 0;
      DaysH = DaysH - SetF;
      MonH = MonH + 1;
      if (MonH === 13) {
        MonH = 1;
        YearH = YearH + 1;
      }
      SetS = SetS >> 1;
      SetF = 29;
      BitP++;
      if (BitP == 8) {
        DatP++;
        BitP = 0;
        SetS = sysData.hdata[DatP];
      }
    } else {
      DayH = DayH + DaysH;
      DaysH = 0;
    }
  }
  // return { YearH, MonH, DayH };

  DateTime.yearh = YearH;
  DateTime.monh = MonH;
  DateTime.dayh = DayH;
}
function GetDateTime() {
  let currentDate = new Date();
  let dow = currentDate.getDay();
  let day = currentDate.getDate();
  let mon = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let hour24 = currentDate.getHours(); // 24 jam
  let min = currentDate.getMinutes();
  let sec = currentDate.getSeconds();
  let hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12; // Konversi ke 12 jam
  let period = hour24 >= 12 ? "PM" : "AM"; // AM/PM
  let time24 = hour24 * 100 + min; // Format 24 jam (hhmm)
  let time12 = hour12 * 100 + min; // Format 12 jam (hhmm)
  const timesec = hour24 * 10000 + min * 100 + sec;

  if (DateTime.timesec !== timesec) DateTime.timesec = timesec;
  if (DateTime.time === time24) return false;
  DateTime.dow = dow;
  DateTime.time = time24;
  DateTime.time12 = time12;
  DateTime.year = year;
  DateTime.mon = mon;
  DateTime.day = day;
  DateTime.hour = hour24; // 24 jam
  DateTime.hour12 = hour12; // 12 jam
  DateTime.min = min;
  DateTime.sec = sec;
  DateTime.mins = hour24 * 60 + min;

  var { days, daysm } = GetYearDays(year, mon, day);
  DateTime.days = days;
  DateTime.daysm = daysm;

  return true;
}

function ShowWaktu() {
  DateTime.dayNow = wdays[DateTime.dow];
  DateTime.mdate =
    Digit2(DateTime.day) + " " + mname[DateTime.mon] + " " + DateTime.year;

  var maghrib = 0,
    min1 = 0,
    min2 = 0,
    wnow = 0,
    mins = DateTime.mins,
    wsolat = [];
  for (var i = 1; i <= 6; i++) {
    var masa = sysData.wdata[DateTime.days][i];
    if (i < 6) {
      min1 = TimeToMin(masa);
      min2 = TimeToMin(sysData.wdata[DateTime.days][i + 1]);
      if (mins >= min1 && mins < min2) wnow = i;
    } else {
      min1 = TimeToMin(masa);
      min2 = TimeToMin(sysData.wdata[DateTime.days][1]);
      if (mins >= min1 && mins < min2) wnow = i;
    }
    if (i == 5) maghrib = TimeToMin(masa);
    wsolat.push({ masa: TimeToTime(masa), waktu: wname[i] });
  }
  DateTime.wsolat = wsolat;
  var wnxt = wnow + 1;
  if (wnxt > 6) wnxt = 1;
  const nxtw = sysData.wdata[DateTime.days][wnxt];
  DateTime.wnxt = {
    waktu: wname[wnxt],
    masa: TimeToTime(nxtw),
    timesec: parseInt(nxtw ?? -1) * 100,
  };

  // const curw = parseInt(nxtw ?? -1) * 100;
  // const tnow = DateTime.time;
  // if (nxtw === tnow && DateTime.wmasuk === false) DateTime.wmasuk = true;
  // if (nxtw !== tnow && DateTime.wmasuk === true) DateTime.wmasuk = false;

  DateTime.maghrib = maghrib;
  HijriDate();
  DateTime.hdate =
    Digit2(DateTime.dayh) + " " + hname[DateTime.monh] + " " + DateTime.yearh;
}
export function ParseWaktu(text) {
  var atext = text.split("\r\n");
  // console.log(atext.length);
  var btext = atext[1].split("=");
  var ctext = btext[1];
  var hdata = [24];
  // console.log(ctext.length);
  for (var i = 0, j = ctext.length; i < j; i += 2) {
    var dd = parseInt(ctext.substr(i, 2), 16);
    // console.log(dd,ctext.substr(i,2),i,j)
    hdata.push(dd);
  }
  var wdata = [0];
  for (var i = 2, j = atext.length; i < j; i++) {
    var dtext = atext[i].split("\t");
    // console.log(dtext)
    if (dtext.length == 8) {
      var data = [];
      for (var k = 1; k < 8; k++) {
        data.push(TimeToVal(dtext[k]));
      }
      data.push(dtext[0]);
      wdata.push(data);
    }
  }
  sysData.hdata = hdata;
  sysData.wdata = wdata;
}
export async function ReadWaktu(code) {
  let response = await fetch("./data/" + code + ".txt");
  if (response.status !== 200) {
    throw new Error("Server Error");
  }
  let text = await response.text();
  ParseWaktu(text);
  ShowWaktu();
  return ShowTime();
}
export function ShowTime() {
  const dot = currDate().getSeconds() % 2 ? true : false;
  const blink = dot ? ":" : "";

  if (GetDateTime()) {
    ShowWaktu();
  }

  return {
    jam: Digit2(DateTime.hour12), // Jam dalam 12 jam
    jam24: Digit2(DateTime.hour), // Jam dalam 24 jam
    min: Digit2(DateTime.min),
    dot: blink,
    dayn: DateTime.dayNow,
    hdate: DateTime.hdate,
    mdate: DateTime.mdate,
    wsolat: DateTime.wsolat,
    wnxt: DateTime.wnxt,
    timesec: DateTime.timesec,
    period: DateTime.hour >= 12 ? "PM" : "AM", // AM/PM
  };
}

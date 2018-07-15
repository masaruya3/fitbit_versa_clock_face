import document from "document";
import clock from "clock";
import * as fs from "fs";
import * as messaging from "messaging";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { HeartRateSensor } from "heart-rate";
import { today } from "user-activity";
import { battery } from "power";

// TIME
let hours1 = document.getElementById("hours1");
let hours2 = document.getElementById("hours2");
let mins1 = document.getElementById("mins1");
let mins2 = document.getElementById("mins2");

// DATE
let day = document.getElementById("day");
let date1 = document.getElementById("date1");
let date2 = document.getElementById("date2");

// WATCH
let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

// HEART RATE
let hr1 = document.getElementById("hr1");
let hr2 = document.getElementById("hr2");
let hr3 = document.getElementById("hr3");

// STEP
let step1 = document.getElementById("step1");
let step2 = document.getElementById("step2");
let step3 = document.getElementById("step3");
let step4 = document.getElementById("step4");
let step5 = document.getElementById("step5");

// BATTERY
//let cl = document.getElementById("cl");
let cl1 = document.getElementById("cl1");
let cl2 = document.getElementById("cl2");

let hrm = new HeartRateSensor();
hrm.onreading = () => setHR();

// Begin monitoring the sensor
hrm.start();

// Battery 
setCL();

// Update the clock every second
clock.granularity = "seconds";

// Update the clock every tick event
clock.ontick = evt => updateClock(evt);

function updateClock(evt) {
  let d = evt.date;

  let hours = d.getHours() % 12;
  let mins = d.getMinutes();
  let secs = d.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
  

  // DATE
  setDate(d.getDate());

  // DAY NAME
  setDay(d.getDay());

  // HOURS
  let hours = d.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  setHours(hours);

  // MINUTES
  let minute = ("0" + d.getMinutes()).slice(-2);
  setMins(minute);
  
  setAct();
}

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

function setHR() {
  let val = hrm.heartRate;
  drawDigit(Math.floor(val / 100 % 10), hr1)
  drawDigit(Math.floor(val / 10 % 10), hr2);
  drawDigit(Math.floor(val % 10), hr3);
}

function setHours(val) {
  if (val > 9) {
    drawDigit(Math.floor(val / 10), hours1);
  } else {
    drawDigit(0, hours1);
  }
  drawDigit(Math.floor(val % 10), hours2);
}

function setMins(val) {
  drawDigit(Math.floor(val / 10), mins1);
  drawDigit(Math.floor(val % 10), mins2);
}

function setDate(val) {
  drawDigit(Math.floor(val / 10), date1);
  drawDigit(Math.floor(val % 10), date2);
}

function setDay(val) {
  day.image = getDayImg(val);
}

function drawDigit(val, place) {
  place.image = `${val}.png`;
}

function getDayImg(index) {
  let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return `day_${days[index]}.png`;
}

function setAct(){
  let steps = today.local.steps || 0;
  drawDigit(Math.floor(steps / 10000 % 10), step1);
  drawDigit(Math.floor(steps / 1000 % 10), step2);
  drawDigit(Math.floor(steps / 100 % 10), step3);
  drawDigit(Math.floor(steps / 10 % 10), step4);
  drawDigit(Math.floor(steps % 10), step5);
}

function setCL(){
  let chargeLevel = Math.floor(battery.chargeLevel);
  
  //let barLength = Math.floor(chargeLevel / 100 * 20);
  //cl.width = barLength;
  
  drawDigit(Math.floor(chargeLevel / 10), cl1);
  drawDigit(Math.floor(chargeLevel % 10), cl2);
  
}
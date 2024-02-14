import {useState} from 'react';
import React from 'react';
import Calendar from 'react-calendar';
import moment from "moment";
import './App.css';

let caltrend="";
let protrend="";
let sugtrend="";

class Day {
  constructor(date,calories,proteins,sugar){
    this.date = date;
    this.calories = calories;
    this.proteins = proteins;
    this.sugar = sugar;
    this.calmet = false;
    this.promet = false;
  }
}
let days = [new Day(moment().format("MMM DD YYYY"),0,0,0)];


let calgoal = 2000;
let progoal = 100;
let suglim = 50;


function App() {
  const [date, setDate] = useState(new Date())
  React.useEffect(() => {
    document.getElementById("maindiv").addEventListener('mousedown', (event) => {
      document.getElementById("display_calories").innerHTML = caloriesforthisday() + "/" + calgoal + " Calories";
      document.getElementById("display_protein").innerHTML = proteinsforthisday() + "/" + progoal + " grams Protein";
      document.getElementById("display_sugar").innerHTML = sugarsforthisday() + "/" + suglim + " grams Sugar";
      document.getElementById("display_caloriest").innerHTML = caltrend;
      document.getElementById("display_proteint").innerHTML = protrend;
      document.getElementById("display_sugart").innerHTML = sugtrend;
    });
    document.getElementById("maindiv").addEventListener('keyup', (e) => {
      if (e.code === "Enter"){
        document.getElementById("display_calories").innerHTML = caloriesforthisday() + "/" + calgoal + " Calories";
        document.getElementById("display_protein").innerHTML = proteinsforthisday() + "/" + progoal + " grams Protein";
        document.getElementById("display_sugar").innerHTML = sugarsforthisday() + "/" + suglim + " grams Sugar";

      }
    });
  });
  return (
    <div id="maindiv" className="App">
      <button id="test" onClick={falsedates}>*</button>
      <h1 id="dateheading"> {moment().format("MMM DD YYYY")} </h1>
      <div id="calendar_and_nutrients">
      <div className="calendar-container">
        <Calendar onChange={setDate} value={date}/>
        <div id="date_needed" className="text-center">
          <label id="date_needed">Selected date: {date.toDateString()} </label>
        </div>
      </div>
      <div id="nutrients_and_button">
      <div id="nutrients-div">
        <input type="number" placeholder='Calories' className="nutrients-container" min="0" id="calin"></input>
        <input type="number" placeholder='Protein' className="nutrients-container" min="0" id="proin"></input>
        <input type="number" placeholder='Sugar' className="nutrients-container" min="0" id="sugin"></input>
       
      </div>
      <button type="button" onClick={addnutrients} id="Add_nutrients"> Add </button>
 
      <div id="nutrients-div">
        <input type="number" placeholder='Calories Goal' className="nutrients-goal-container" min="0" id="calgol"></input>
        <input type="number" placeholder='Protein Goal' className="nutrients-goal-container" min="0" id="progol"></input>
        <input type="number" placeholder='Sugar Limit' className="nutrients-goal-container" min="0" id="suglim"></input>
       
      </div>
      <button type="button" onClick={addnutrientsgoals} id="Add_nutrients_goals"> Set New Goals </button>
     
      <div id="display_nutrients_div" >
        <h3>Today's Stats</h3>
          <p id="display_calories"></p>
          <p id="display_protein"></p>
          <p id="display_sugar"></p>
      </div>
      <div class="display_trends">
        <h3>Trends</h3>
         <p id="display_caloriest">{caltrend}</p>
         <p id="display_proteint">{protrend}</p>
         <p id="display_sugart">{sugtrend}</p>
      </div>

      </div>
      </div>
    <button onClick={createtrends}> Calculate Trends </button>
    {/* <button onclick="falsedates()"> The Ultimate Testing Button </button> */}
    {/* This div must go at the very bottom */} <div id="overlay">
        <img id="goalimg" src="data:image/jpeg;base64,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" alt=""></img>
      </div>
    </div>
  );
}

function showOverlay(goalmet){
  if (goalmet === "calories"){
    //change the src of the image to something else
    document.getElementById("goalimg").src = require("./calorie_badge.jpg");
    document.getElementById("goalimg").alt = "calorie_badge.jpg";
  } else if (goalmet === "proteins"){
    //change the src of the image to something else
    document.getElementById("goalimg").src = require("./protein_badge.jpg");
    document.getElementById("goalimg").alt = "protein_badge.jpg";
  } else {
    return;
  }
  //goalmet equals either "none" or "calories" or "proteins"
  document.getElementById("overlay").style.display = 'block';
  let x = setTimeout(function(){
    document.getElementById("overlay").style.display = 'none';
    if (days[days.length-1].proteins >= progoal && days[days.length-1].promet === false){
      clearTimeout(x);
      days[days.length-1].promet = true;
      showOverlay("proteins");
    } else {
      clearTimeout(x);
    }
  }, 3000);
}


function caloriesforthisday(){
  for (let i = 0; i < days.length; i++){
    console.log(moment().format("MMM DD YYYY"))
    console.log(days[i].date)
    if (days[i].date.replaceAll("th","") === document.getElementById("date_needed").innerText.slice(19) || days[i].date === moment().format("MMM DD YYYY") || days[i].date.replaceAll("nd","") === document.getElementById("date_needed").innerText.slice(19)|| days[i].date.replaceAll("rd","") === document.getElementById("date_needed").innerText.slice(19)){
      return days[i].calories;
    }
  }
  return 0;
}
function proteinsforthisday(){
  for (let i = 0; i < days.length; i++){
    if (days[i].date.replaceAll("th","") === document.getElementById("date_needed").innerText.slice(19) || days[i].date === moment().format("MMM DD YYYY") || days[i].date.replaceAll("nd","") === document.getElementById("date_needed").innerText.slice(19)|| days[i].date.replaceAll("rd","") === document.getElementById("date_needed").innerText.slice(19)){
      return days[i].proteins;
    }
  }
  return 0;
}
function sugarsforthisday(){
  for (let i = 0; i < days.length; i++){
    if (days[i].date.replaceAll("th","") === document.getElementById("date_needed").innerText.slice(19) || days[i].date === moment().format("MMM DD YYYY") || days[i].date.replaceAll("nd","") === document.getElementById("date_needed").innerText.slice(19)|| days[i].date.replaceAll("rd","") === document.getElementById("date_needed").innerText.slice(19)){
      return days[i].sugar;
    }
  }
  return 0;
}


function falsedates(){
  for (let i = 16; i >= 1; i--){
    days.push(moment().subtract(i, 'days').format("MMM DD YYYY"),2100, 130, 29);
  }
  document.getElementById("test").disabled = true;
}


function addnutrients() {
  let caladd = document.getElementById("calin").value;
  let proadd = document.getElementById("proin").value;
  let sugadd = document.getElementById("sugin").value;
  if (caladd === ""){
    caladd = 0;
  }
  if (proadd === ""){
    proadd = 0;
  }
  if (sugadd === ""){
    sugadd = 0;
  }
  // eslint-disable-next-line
  if (days == []){} else {
    if (days[days.length-1].date !== moment().format("MMM DD YYYY")){
      days.push(new Day(moment().format("MMM DD YYYY")),0,0,0);
      let thisday = days[days.length-1];
      thisday.calories = parseInt(caladd);
      thisday.proteins = parseInt(proadd);
      thisday.sugar = parseInt(sugadd);
      // days[days.length-1] = thisday;
    } else {
      let thisday = days[days.length-1];
      thisday.calories += parseInt(caladd);
      thisday.proteins += parseInt(proadd);
      thisday.sugar += parseInt(sugadd);
    }
  }
  if (days[days.length-1].calories >= calgoal && days[days.length-1].calmet === false){
    days[days.length-1].calmet = true;
    showOverlay("calories");
  } else if (days[days.length-1].proteins >= progoal && days[days.length-1].promet === false){
    days[days.length-1].promet = true;
    showOverlay("proteins");
  }
}




function addnutrientsgoals() {
  calgoal = document.getElementById("calgol").value;
  if (isNaN(calgoal)){
    calgoal = 2000;
  }
  progoal = document.getElementById("progol").value;
  if (isNaN(progoal)){
    progoal = 2000;
  }
  suglim = document.getElementById("suglim").value;
  if (isNaN(suglim)){
    suglim = 2000;
  }
}


function createtrends(){
  falsedates();
  // alert("gee")
  caltrend="";
  protrend="";
  sugtrend="";
  let reccal = [];
  let recpro = [];
  let recsug = [];
  alert(days.length)
  if (days.length>=6){
    for (let ii = 1; ii <= 6; ii++){
      // let i = days.length-ii;
      alert(days[ii].calories)
      reccal.push(days[ii].calories);
      recpro.push(days[ii].proteins);
      recsug.push(days[ii].sugar);
      alert(reccal)
    }
    let caltotalsbefore;
    let caltotalsafter;
    let prototalsbefore;
    let prototalsafter;
    let sugtotalsbefore;
    let sugtotalsafter;
    for (let i = 0; i < 3; i++){
      caltotalsbefore += reccal[i].parseInt;
      prototalsbefore += recpro[i].parseInt;
      sugtotalsbefore += recsug[i].parseInt;
    }
    for (let i = 3; i < 6; i++){
      caltotalsafter += reccal[i].parseInt;
      prototalsafter += recpro[i].parseInt;
      sugtotalsafter += recsug[i].parseInt;
    }
    if (caltotalsbefore - 10 > caltotalsafter){
      caltrend = "Your calorie intake over the past 3 days has been greater than the 3 days before it.";
    } else if (caltotalsbefore + 10 < caltotalsafter){
      caltrend = "Your calorie intake over the past 3 days has been less than the 3 days before it.";
    } else {
      caltrend = "Your calorie intake over the past 6 days has been stable.";
    }
    if (prototalsbefore - 10 > prototalsafter){
      protrend = "Your protein intake over the past 3 days has been greater than the 3 days before it.";
    } else if (prototalsbefore + 10 < prototalsafter){
      protrend = "Your protein intake over the past 3 days has been less than the 3 days before it.";
    } else {
      protrend = "Your protein intake over the past 6 days has been stable.";
    }
    if (sugtotalsbefore - 5 > sugtotalsafter){
      protrend = "Careful! Your sugar intake over the past 3 days has been greater than the 3 days before it.";
    } else if (sugtotalsbefore + 5 < sugtotalsafter){
      protrend = "Good job! Your sugar intake over the past 3 days has been less than the 3 days before it.";
    } else {
      protrend = "Your sugar intake over the past 6 days has been stable.";
    }
  } else {
    caltrend = "Not enough data for analysis.";
    protrend = "6 days of data is needed for accurate trend analysis.";
    sugtrend = "Make sure you keep logging your data!";
  }
}

export default App;

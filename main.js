const today = new Date();

const ans = document.body.querySelector(`#ans`);

const waitForm = document.body.querySelector(`#waiting-time-form`);

if (today.getHours() < 10) {
  if (today.getMinutes() < 10) {
    waitForm.start.value = `0${today.getHours()}:0${today.getMinutes()}`;
  } else {
    waitForm.start.value = `0${today.getHours()}:${today.getMinutes()}`;
  }
} else {
  if (today.getMinutes() < 10) {
    waitForm.start.value = `${today.getHours()}:0${today.getMinutes()}`;
  } else {
    waitForm.start.value = `${today.getHours()}:${today.getMinutes()}`;
  }
}

waitForm.addEventListener("submit", (e) => {onSubmit(e)});

function onSubmit(e) {
  e.preventDefault();
  ans.innerText = calcWait(waitForm.start.value, waitForm.wait.value, waitForm.cycle.checked);
};

function calcWait(start, wait, cycle) {
  const startHrs = Number(start.slice(0, 2));
  const startMin = Number(start.slice(3, 5));

  const waitHrs = Math.floor((Number(wait) / 60) - (Number(wait) / 60 % 1));
  const waitMin = Math.floor(Number(wait) % 60);

  let endHrs = startHrs + waitHrs;
  let endMin = startMin + waitMin;
  let endAmPm = "";

  if (endHrs > 24) {
    const val = Math.floor(endHrs / 24) * 24;
    endHrs = endHrs - val;
  }
  
  if (endMin >= 60) {
    const val = Math.floor(endMin / 60);
    const val2 = val * 60;
    endMin = endMin - val2;
    endHrs = endHrs + val;
  }

  //converts to 12 hour cycle
  if (cycle) {
    if (endHrs < 12) {
      endAmPm = " AM";
    } else {
      endAmPm = " PM";
    }
    if (endHrs < 1) {
      endHrs += 12;
    }
    if (endHrs > 12) {
      endHrs = endHrs - 12;
    }
  }

  endHrs = `${endHrs}`;
  if (endHrs.length < 2) {
    endHrs = "0" + endHrs;
  }
  endMin = `${endMin}`;
  if (endMin.length < 2) {
    endMin = "0" + endMin;
  }
  
  return endHrs + ":" + endMin + endAmPm;
};

function runWaitFormDefault() {
  ans.innerText = calcWait(waitForm.start.value, waitForm.wait.value, waitForm.cycle.checked);
}
runWaitFormDefault();

/////////////////////////////////

let cdVal, cdCache;

const cdCntrlStart = document.body.querySelector(`#cd-cntrl-start`);

const cdCntrlPause = document.body.querySelector(`#cd-cntrl-pause`);

const cdCntrlReset = document.body.querySelector(`#cd-cntrl-reset`);

const cdValDOM = document.body.querySelector(`#count-down-num`);

const cdForm = document.body.querySelector(`#count-down-form`);

function cdUnitConvert() {
  const cdSelected = cdForm.inputUnit.value;
  let magniMult = 1;
  if (cdSelected === "1") {
    magniMult = 1;
  } else if (cdSelected === "2") {
    magniMult = 60;
  } else if (cdSelected === "3") {
    magniMult = 3600;
  }
  cdVal = cdForm.num.value * magniMult;
}

function formatTime(secs) {
  let hours, minutes, seconds;
  hours = `${Math.floor(cdVal / 3600)}`;
  minutes = `${Math.floor((cdVal / 60) - (hours * 60))}`;
  seconds = `${cdVal - ((minutes * 60) + (hours * 3600))}`;
  if (hours.length < 2) {
    if (minutes.length < 2) {
      if (seconds.length < 2) {
        return "0" + hours + " : " + "0" + minutes + " : " + "0" + seconds;
      } else {
        return "0" + hours + " : " + "0" + minutes + " : " + seconds;
      }
    } else {
      if (seconds.length < 2) {
        return "0" + hours + " : " + minutes + " : " + "0" + seconds;
      } else {
        return "0" + hours + " : " + minutes + " : " + seconds;
      }
    }
  } else {
    if (minutes.length < 2) {
      if (seconds.length < 2) {
        return hours + " : " + "0" + minutes + " : " + "0" + seconds;
      } else {
        return hours + " : " + "0" + minutes + " : " + seconds;
      }
    } else {
      if (seconds.length < 2) {
        return hours + " : " + minutes + " : " + "0" + seconds;
      } else {
        return hours + " : " + minutes + " : " + seconds;
      }
    }
  }
}

function countDown() {
  cdCache = setInterval(() => {
    cdVal -= 1;
    if (cdVal >= 0) {
      cdValDOM.innerText = formatTime(cdVal);
    } else {
      clearInterval(cdCache);
      cdStartListen();
    }
  }, 1000)
};

let cdPauseToggle = true;
function cdPause() {
  if (cdPauseToggle) {
    clearInterval(cdCache);
  } else {
    countDown();
  }
  cdPauseToggle = !cdPauseToggle;
};

function cdReset() {
  clearInterval(cdCache);
  cdVal = cdForm.num.value;
  cdUnitConvert();
  cdValDOM.innerText = formatTime(cdVal);
};

function cdStartListen() {
  cdCntrlStart.addEventListener("click", l1 = (e) => {
    e.preventDefault();
    cdForm.inputUnit.removeEventListener("change", runCdFormDefault);
    cdUnitConvert();
    cdValDOM.innerText = formatTime(cdVal);
    countDown();

    cdPauseToggle = true;
    cdCntrlPause.addEventListener("click", l2 = () => {
      cdPause();
    });
    
    cdCntrlReset.addEventListener("click", l3 =  () => {
      cdCntrlPause.removeEventListener("click", l2);
      cdForm.inputUnit.addEventListener("change", runCdFormDefault);
      cdReset();
      cdStartListen();
    }, {once:true});
    
  }, {once:true});
};

function runCdFormDefault() {
  cdUnitConvert();
  cdValDOM.innerText = formatTime(cdVal);
};
runCdFormDefault();
cdStartListen();

cdForm.inputUnit.addEventListener("change", runCdFormDefault);

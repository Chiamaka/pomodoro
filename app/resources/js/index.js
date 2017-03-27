// Inspiration from: https://codepen.io/eddyerburgh/pen/yOjdqo?editors=0010

var pomodoro = {
    init: function() {
        // These would be called automatically
        this.domVariables();
        this.timerVariables();
        this.bindEvents();
        this.updateAllDisplays();
        this.info();
    },
    domVariables() {
        // Session and Break buttons
        this.increaseSession = document.getElementById('js--session-plus');
        this.decreaseSession = document.getElementById('js--session-minus');
        this.increaseBreak   = document.getElementById('js--break-plus');
        this.decreaseBreak   = document.getElementById('js--break-minus');
        this.circle          = document.getElementById('js--circle');
        this.buttons         = document.getElementsByTagName('button');
        this.infoButton      = document.getElementById('js--info');

        // Timer display
        this.sessionLengthDisplay = document.getElementById('session-length');
        this.breakLengthDisplay   = document.getElementById('break-length');

        // Countdown
        this.timerDisplay = document.getElementById('timer');
        this.typeDisplay  = document.getElementById('type');
    },
    timerVariables() {
        // Initial length values
        this.sessionLength = 25;
        this.breakLength = 5;
        this.longBreakLength = 15;
        
        this.workSession = 0;
        this.pause       = false;
        this.timeoutHandle  = 0;
    },
    bindEvents() {
        // Bind Increase & Decrease session length to buttons
        this.increaseSession.onclick = pomodoro.incrSession;
        this.decreaseSession.onclick = pomodoro.decrSession;
        this.increaseBreak.onclick   = pomodoro.incrBreak;
        this.decreaseBreak.onclick   = pomodoro.decrBreak;
        this.circle.onclick          = pomodoro.startTimer;
        this.infoButton.onclick      = pomodoro.info;
    },
    updateAllDisplays() {
        pomodoro.sessionLengthDisplay.innerHTML = this.sessionLength;
        pomodoro.breakLengthDisplay.innerHTML   = this.breakLength;
        this.timerDisplay.innerHTML             = this.sessionLength + ':00';
        this.resetVariables();
    },
    incrSession() {
        if (pomodoro.sessionLength < 59) {
            pomodoro.sessionLength++;
        }
        pomodoro.updateAllDisplays();
    },
    decrSession() {
        if (pomodoro.sessionLength > 1) {
            pomodoro.sessionLength--;
        }
        pomodoro.updateAllDisplays();
    },
    incrBreak() {
        if (pomodoro.breakLength < 30) {
            pomodoro.breakLength++;
        }
        pomodoro.updateAllDisplays();
    },
    decrBreak() {
        if (pomodoro.breakLength > 1) {
            pomodoro.breakLength--;
        }
        pomodoro.updateAllDisplays();
    },
    resetVariables() {
        this.workSession  = 0;
        this.pause        = false;
    },
    startTimer() {
        // Disable buttons once timer starts
        pomodoro.pauseCount++;
        pomodoro.disableButtons();
        pomodoro.countdown(pomodoro.sessionLength);
    },
    countdown(minutes) {
        // http://navaneeth.me/simple-countdown-timer-using-javascript/#.WNfgjROLTOR
        var seconds = 60;
        var mins = minutes;
        function tick () {
            var currentMinutes = mins-1;
            seconds--;
            pomodoro.timerDisplay.innerHTML = currentMinutes.toString() + ':' + (seconds < 10 ? '0' : '') + String(seconds);
            if (seconds > 0 ) {
                timeoutHandle = setTimeout(tick, 1000);
            } else {
                if (mins > 1) {
                    setTimeout(function () { pomodoro.countdown(mins - 1); }, 1000);
                } else {
                    pomodoro.undisableButtons();
                    pomodoro.workSession++;
                    pomodoro.playSound();
                    console.log('worksession',pomodoro.workSession);
                    if (pomodoro.workSession % 2 !== 0) {
                        if (pomodoro.workSession === 7) {
                            pomodoro.countdown(pomodoro.longBreakLength);
                            pomodoro.typeDisplay.innerHTML = 'Break Session';
                        } else {
                            pomodoro.countdown(pomodoro.breakLength);
                            pomodoro.typeDisplay.innerHTML = 'Break Session';
                        }
                        
                    } else {
                        pomodoro.countdown(pomodoro.sessionLength);
                        pomodoro.typeDisplay.innerHTML = 'Work Session';
                    }
                }
            }
        };
        tick();
    },
    disableButtons() {
        for (let i=0; i<this.buttons.length; i++) {
            this.buttons[i].setAttribute('disabled', 'disabled');
        }
    },
    undisableButtons() {
        for (let i=0; i<this.buttons.length; i++) {
            this.buttons[i].disabled = false;
        }
    },
    playSound() {
        var mp3 = 'http://soundbible.com/grab.php?id=1746&type=mp3';
        var audio = new Audio(mp3);
        audio.play();    
    },
    info() {
        this.alertText = `
            <div class='rules'>
            <p>Here are the basic rules for this pomodoro app</p>
            <p>1. The initial session length is 25 minutes. You can adjust this</p>
            <p>2. The initial break length is 5 minutes. You can adjust this.</p>
            <p>3. Immediately the work session is over, the break timer starts</p>
            <p>4. After the fourth session, a 15 minute break is imposed. You can't change it. You need to rest and rejuvenate.</p>
            <p>5. You can't pause a session. Sorry</p>
            <p>6. Don't forget to have fun while working!</p>
            <p>You can click on the info button to bring this alert up again</p>
            </div>
        `;
        alertify.alert(this.alertText);
    }
};

pomodoro.init();

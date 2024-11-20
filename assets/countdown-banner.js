/**
 *  @class
 *  @function CountdownTimer
 */
if (!customElements.get('countdown-timer')) {
  class CountdownTimer extends HTMLElement {
    constructor() {
      super();

      const timezone = this.dataset.timezone,
        date = this.dataset.date.split('-'),
        day = parseInt(date[0]),
        month = parseInt(date[1]),
        year = parseInt(date[2]);

      let time = this.dataset.time,
        tarhour = 0,
        tarmin = 0;

      if (time) {
        [tarhour, tarmin] = time.split(':').map(Number);
      }

      // Set the date we're counting down to
      let date_string = month + '/' + day + '/' + year + ' ' + tarhour + ':' + tarmin + ' GMT' + timezone;
      // Time without timezone
      this.countDownDate = new Date(year, month - 1, day, tarhour, tarmin, 0, 0).getTime();

      // Time with timezone
      this.countDownDate = new Date(date_string).getTime();

    }

    convertDateForIos(date) {
      var arr = date.split(/[- :]/);
      date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
      return date;
    }
    connectedCallback() {

      const daysEl = this.querySelector('.days .countdown-timer--column--number'),
        hoursEl = this.querySelector('.hours .countdown-timer--column--number'),
        minutesEl = this.querySelector('.minutes .countdown-timer--column--number'),
        secondsEl = this.querySelector('.seconds .countdown-timer--column--number');
      const updateTime = () => {
        // Get todays date and time
        const now = Date.now();

        // Find the distance between now an the count down date
        const distance = this.countDownDate - now;

        if (distance < 0) {
          daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = '00';
          return;
        }

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds = Math.floor((distance % (1000 * 60)) / 1000);

        requestAnimationFrame(updateTime);

        daysEl.textContent = CountdownTimer.addZero(days);
        hoursEl.textContent = CountdownTimer.addZero(hours);
        minutesEl.textContent = CountdownTimer.addZero(minutes);
        secondsEl.textContent = CountdownTimer.addZero(seconds);

      };
      requestAnimationFrame(updateTime);
    }
    static addZero(x) {
      return (x < 10 && x >= 0) ? "0" + x : x;
    }
  }
  customElements.define('countdown-timer', CountdownTimer);
}
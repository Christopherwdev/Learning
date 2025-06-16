// CSV data
const csvData = `Year,Month,Day,Event,Type,Major?
2025,1,8,IAL January Exams,IAL,1
2025,1,14,Oxford Offer Released,UK Interview,0
2025,1,16,IAL October Results,IAL,0
2025,1,30,Cambridge Offer Released,UK Interview,0
2025,3,6,IAL January Results,IAL,0
2025,5,6,IAL June Exams,IAL,1
2025,5,13,UCAT Account Creation Opens,UCAT,0
2025,6,17,UCAT Booking Opens,UCAT,0
2025,7,7,UCAT Test Starts,UCAT,0
2025,8,14,IAL June Results,IAL,0
2025,9,19,UCAT Booking Deadline,UCAT,0
2025,9,26,UCAT Last Testing Day,UCAT,0
2025,9,27,HKU Start Apply,HKU,0
2025,10,2,CUHK Start Apply,CUHK,0
2025,10,8,IAL October Exams,IAL,1
2025,10,15,UCAS Deadline,UK Interview,0
2025,10,19,CUHK Information Day,CUHK,0
2025,11,1,US University EA Deadline,US Interview,0
2025,11,14,CUHK Apply Deadline,CUHK,0
2025,11,27,HKU Apply Deadline,HKU,0
2025,12,19,HKU and CUHK Interview,HKU CUHK,1
2025,12,20,HKU MBBS Interview,HKU,1
2025,12,31,HKSES Apply Deadline,UK Interview,0
2026,1,1,UK University DA Deadline,US Interview,0
2026,1,2,HKU Pharmacy Interview,HKU,1
2026,1,3,HKU Pharmacy Interview,HKU,1
2026,1,8,IAL January Exams,IAL,1
2026,1,8,CUHK Apply Deadline,CUHK,0
`;

// Constants for month names
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Function to create event element
function createEventElement(date, event, type, major) {
  const eventElement = document.createElement('div');
  eventElement.classList.add('event');

  const eventCircle = document.createElement('div');
  eventCircle.classList.add('event-circle');
  eventCircle.innerHTML = `${date.getDate()}<br>${months[date.getMonth()]}`;
  eventElement.appendChild(eventCircle);

  const eventLabel = document.createElement('div');
  eventLabel.classList.add('event-label');
  eventLabel.textContent = event;
  eventElement.appendChild(eventLabel);

  // Apply styles based on event type
  if (type === 'IAL') {
    eventCircle.style.backgroundColor = '#0FBD8C';
    eventCircle.style.color = 'white';
  } else if (type === 'UK Interview') {
    eventCircle.style.backgroundColor = 'blue';
    eventCircle.style.color = 'white';
  } else if (type === 'UCAT') {
    eventCircle.style.backgroundColor = '#ab1538';
    eventCircle.style.color = 'white';
  } else if (type === 'HKU') {
    eventCircle.style.backgroundColor = '#01d7bf';
    eventCircle.style.color = 'white';
  } else if (type === 'CUHK') {
    eventCircle.style.backgroundColor = '#740f6e';
    eventCircle.style.color = 'white';
  } else if (type === 'US Interview') {
    eventCircle.style.backgroundColor = '#1c87ca';
    eventCircle.style.color = 'white';
  }

  return eventElement;
}



function calculatePercentagePassed(previousEventDate, closestUpcomingEventDate) {
    const now = new Date();
    if (!previousEventDate || !closestUpcomingEventDate) {
        return 0; // Handle cases where previous or upcoming event is missing
    }
    const prevDateOnly = new Date(previousEventDate.getFullYear(), previousEventDate.getMonth(), previousEventDate.getDate());
    const upcDateOnly = new Date(closestUpcomingEventDate.getFullYear(), closestUpcomingEventDate.getMonth(), closestUpcomingEventDate.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const timePassed = nowDateOnly - prevDateOnly;
    const totalTime = upcDateOnly - prevDateOnly;

    //Handle potential division by zero and negative totalTime
    if (totalTime <= 0) return 0;

    return (timePassed / totalTime) * 100;
}


// Function to parse CSV data and generate events
function generateEvents() {
    const rows = csvData.trim().split('\n');
    const events = [];
    const today = new Date();
    let totalEvents = 0;
    let pastEvents = 0;
  
    for (let i = 1; i < rows.length; i++) {
      const [year, month, day, event, type, major] = rows[i].split(',');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const eventElement = createEventElement(date, event, type, major);
  
      // Make past events transparent
      if (date < today) {
        // eventElement.style.opacity = 0.5;
        // eventElement.style.zIndex = 0;
        eventElement.querySelector('.event-circle').style.backgroundColor = '#f1f1f1'; 
        eventElement.querySelector('.event-circle').style.color = 'black';
        eventElement.querySelector('.event-circle').style.borderColor = '#ddd'; 
        eventElement.querySelector('.event-circle').style.fontWeight = '100'; 
        eventElement.querySelector('.event-circle').innerHTML = `
        <i class="fas fa-check" style="font-size: 20px; color: #0FBD8C"></i>`;
        pastEvents++;
      }
      events.push({ date, element: eventElement });
      totalEvents++;
    }
  
    return { events, totalEvents, pastEvents };
  }


  function findClosestUpcomingEvent(events) {
    const today = new Date();
    let closestUpcomingEvent = null;
    let previousEvent = null;
    let minDifference = Infinity;

    events.sort((a, b) => a.date - b.date);

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const diff = event.date - today;

        if (diff >= 0 && diff < minDifference) {
            minDifference = diff;
            closestUpcomingEvent = event;
            if (i > 0) {
                previousEvent = events[i - 1];
            }
        }
    }
    return { closestUpcomingEvent, previousEvent };
}


// Get the events container and append the generated events
const eventsContainer = document.getElementById('events-container');
const { events, totalEvents, pastEvents } = generateEvents(); // Destructure the returned object
events.forEach(event => eventsContainer.appendChild(event.element));

const {closestUpcomingEvent, previousEvent} = findClosestUpcomingEvent(events);


    const percentagePassed = calculatePercentagePassed(previousEvent.date, closestUpcomingEvent.date);
    console.log("Percentage of time passed:", percentagePassed.toFixed(2) + "%");


console.log("Total number of events:", totalEvents);
console.log("Total number of past events:", pastEvents);

const progressBar = document.getElementById('progress-bar');
progressBar.style.width = `${120 * totalEvents - 60}px`;
progressBar.style.zIndex = 1;
const progress = document.getElementById('progress');
progress.style.zIndex = 2;

progress.style.width = `${120 * pastEvents - 36 + 0.72*percentagePassed.toFixed(2)}px`;
progress.style.backgroundColor = closestUpcomingEvent.element.querySelector('.event-circle').style.backgroundColor; 

closestUpcomingEvent.element.querySelector('.event-circle').style.boxShadow = `0px 0px 0px 5px rgba(0,0,0,0.1)`;

const closestEventRect = closestUpcomingEvent.element.getBoundingClientRect();
const containerRect = eventsContainer.getBoundingClientRect();
const scrollTop = closestEventRect.left - containerRect.left; // Calculate the offset
eventsContainer.scrollLeft = scrollTop; 

const now = new Date();
const eventDate = new Date(closestUpcomingEvent.date); //Ensure it's a Date object
const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); //Get today's date only


const timeDifferenceMs = eventDate - nowDate; // Difference in milliseconds, ignoring time

if (timeDifferenceMs < 0) {
    const daysElement = document.getElementById('days');
    daysElement.textContent = "Event has passed";
} else {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const days = Math.floor(timeDifferenceMs / millisecondsPerDay);

    const daysElement = document.getElementById('days');
    daysElement.textContent = `${days} Days`;
    if (days == 1) {
        daysElement.textContent = `${days} Day`;
    } else if (days == 0) {
        daysElement.textContent = `Today`;
    }
}
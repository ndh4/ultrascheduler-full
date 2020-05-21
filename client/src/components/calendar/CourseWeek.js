import React from 'react'
import * as dates from 'date-arithmetic'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import moment from 'moment';

const max = Math.max
const min = Math.min

const getDetailsFromEvent = (event) => {
    // Initialize boolean to determine if this event lies on the weekend
    let onWeekend = false;

    // Convert times to momentjs for what we're about to do
    let eventStartMoment = moment(event.start);
    let eventEndMoment = moment(event.end);

    // Check if the start time is on a saturday or sunday
    if (eventStartMoment.day() == moment("Saturday") || eventStartMoment.day() == moment("Sunday")) {
        onWeekend = true;
    }

    // Check if the end time is on a sat or sun
    if (eventEndMoment.day() == moment("Saturday") || eventEndMoment.day() == moment("Sunday")) {
        onWeekend = true;
    }

    return { 
        minHour: eventStartMoment.startOf("hour"), // get the previous hour preceding the start of event (so 5:05pm -> 5pm)
        maxHour: eventEndMoment.clone().add(1, "hour").hour(), // get the next hour following the conclusion of event (so 5:55pm -> 6pm)
        onWeekend: onWeekend // return our findings on whether the event lies on a weekend
    };
}

const navigate = (date, action) => {
    return date;
}

const title = (date) => {
    return "Meme";
}

const CourseWeekComponent = (props) => {
        let { date, events } = props;
        let range = Array.from({length: 7}, (x,i) => dates.add(date, i, 'day'));

        let showWeekend = false;

        let gridHourStart = 8;
        let gridHourEnd = 14;
        
        for (let event of events) {
            let { minHour, maxHour, onWeekend } = getDetailsFromEvent(event);

            // If a single event is on the weekend, it needs to be shown
            if (onWeekend) {
                showWeekend = true;
            }

            gridHourStart = min(gridHourStart, minHour);
            gridHourEnd = max(gridHourEnd, maxHour);
        }

        if (!showWeekend)
            // Cuts off the Sunday (position 0) and Saturday (position 7)
            range = range.slice(1, range.length - 1)
        
        // Convert gridHourStart and gridHourEnd to date objects using moment so that they can be used with TimeGrid
        let gridMin = moment(gridHourStart, 'HH').toDate();
        let gridMax = moment(gridHourEnd, 'HH').toDate()
        
        return (
            <TimeGrid
                {...props} 
                min={gridMin} 
                max={gridMax} 
                range={range}
                eventOffset={15}/>
        );
}

// Need to add the { navigate, title } to simulate static field behavior; more found here: 
// https://stackoverflow.com/questions/57712682/react-functional-component-static-property
export const CourseWeek = Object.assign(CourseWeekComponent, { navigate, title });
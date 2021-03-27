import moment from "moment";

export const classTimeString = (startTime, endTime) => {
    startTime = moment(startTime, 'HHmm').format('hh:mm a');
    endTime = moment(endTime, 'HHmm').format('hh:mm a');

    return startTime + " - " + endTime
}

export const timesToMoment = (startTime, endTime) => {
    startTime = moment(startTime, 'HHmm');
    endTime = moment(endTime, 'HHmm');

    return [startTime, endTime];
}

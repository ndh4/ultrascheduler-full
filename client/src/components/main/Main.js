import React, { useState, useEffect } from 'react'
import Header from "../header/Header";
import CourseCalendar from "../calendar/Calendar";
import ClassSelector from "../draftview/ClassSelector";
import CourseSearch from "../search/CourseSearch";
import { connect } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { seenRecentUpdateRequest } from '../../actions/AuthActions';
import { useQuery, gql } from '@apollo/client';
import LoadingScreen from '../LoadingScreen';

export const GET_USER_SCHEDULE = gql`
    # Write your query or mutation here
    query GetUserSchedule($netid: String!, $term: String!) {
        userOne( filter: { netid: $netid } ) {
            schedules( filter: { term: $term } ) {
                _id
                draftSessions {
                    _id
                    visible
                    session {
                        _id
                        crn
                        class {
                            days
                            startTime
                            endTime
                        }
                        lab {
                            days
                            startTime
                            endTime
                        }
                        enrollment
                        maxEnrollment
                        waitlisted
                        maxWaitlisted
                        instructors {
                            firstName
                            lastName
                        }
                        course {
                            creditsMin
                            creditsMax
                            longTitle
                            subject
                            courseNum
                            distribution
                        }
                    }
                }
            }
        }
    }
`

// Toast for notifications
const Main = ({ recentUpdate, seenRecentUpdateRequest }) => {
    // Add toast
    let { addToast } = useToasts();

    useEffect(
        () => {
            if (recentUpdate) {
                let message = "We've recently updated our systems to optimize your user experience. \n \
                This required the removal of all current course data. However, courses will now be updated with \
                the latest information every hour.";
                addToast(message, { appearance: 'info', onDismiss: () => seenRecentUpdateRequest() });
            }
        }, [recentUpdate]
    )

    // Query for the schedule of the user that is logged in
    const { data, loading, error } = useQuery(
        GET_USER_SCHEDULE,
        { variables: { netid: "wsm3", term: "202110" } }
    );

    if (loading) return (<LoadingScreen />);
    if (error) return (<p>Error :(</p>);
    if (!data) return (<p>No Data...</p>);

    const schedule = data.userOne.schedules[0];

    return (
        <div className="App" style={{ display: "inline", color: "#272D2D" }}>
			<Header />
            <div style={{ padding: "2%" }}>
                <ClassSelector scheduleID={schedule._id} draftSessions={schedule.draftSessions} />
            </div>
            <div className="Container" style={{ padding: "2%" }}>
                <div style={{ float: "left", width: '30%' }}>
                    <CourseSearch scheduleID={schedule._id} />
                </div>
                <div style={{ float: "left", width: '70%' }}>
                    <CourseCalendar draftSessions={schedule.draftSessions} />
                </div>
            </div>
		</div>
    )
}

export default connect(
    (state) => ({
        recentUpdate: state.auth.recentUpdate
    }),
    (dispatch) => ({
        seenRecentUpdateRequest: () => dispatch(seenRecentUpdateRequest())
    })
)(Main);
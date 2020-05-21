import React, { useState, useEffect } from 'react'
import Header from "../header/Header";
import CourseCalendar from "../calendar/Calendar";
import ClassSelector from "../draftview/ClassSelector";
import CourseSearch from "../search/CourseSearch";
import config from '../../config';
import { connect } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { seenRecentUpdateRequest } from '../../actions/AuthActions';
import { useQuery, gql } from '@apollo/client';
import LoadingScreen from '../LoadingScreen';

const GET_USER_SCHEDULE = gql`
    # Write your query or mutation here
    query GetUserSchedule {
        userOne(filter:{netid:"wsm3"}) {
            schedules(filter:{term:"202110"}) {
                _id
                term
                draftSessions {
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
    // Apollo enters here
    const { data, loading, error } = useQuery(GET_USER_SCHEDULE)

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
        }, []
    )

    const [depts, setDepts] = useState([]);
    const fetchDepts = async () => {
        let response = await fetch(config.backendURL + "/courses/getAllSubjects?term=202030");
        let result = await response.json();
        return result;
    }
    useEffect(
        () => {
            fetchDepts()
            .then(subjects => {
                console.log("Fetched subjects");
                setDepts(subjects.map(dept => ({label: dept, value: dept})));
            })
        }, []
    );

    if (loading) return (<LoadingScreen />);
    if (error) return (<p>Error :(</p>);
    if (!data) return (<p>No Data...</p>);

    const schedule = data.userOne.schedules[0];

    return (
        <div className="App" style={{ display: "inline", color: "#272D2D" }}>
			<Header />
            <div style={{ padding: "2%" }}>
                <ClassSelector draftSessions={schedule.draftSessions} />
            </div>
            <div className="Container" style={{ padding: "2%" }}>
                <div style={{ float: "left", width: '30%' }}>
                    <CourseSearch depts={depts} />
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
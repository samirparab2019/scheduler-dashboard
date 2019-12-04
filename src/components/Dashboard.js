import React, { Component, useState } from "react";
import Loading from "../components/Loading"
import Panel from "../components/Panel"
import classnames from "classnames";
import axios from 'axios';
import { getTotalInterviews, getLeastPopularTimeSlot, getMostPopularDay, getInterviewsPerDay } from "../helpers/selectors";
import { setInterview } from "helpers/reducers";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];


class Dashboard extends Component {
  
  // constructor(props) {
  //   super(props);
  //   this.selectPanel = this.selectPanel.bind(this);
  // }

  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
   };

  /*componnetDidMount lifecycle method to check to see if there is saved focus state 
  after we render the application the first time. When the local storage contains state, 
  we can set the state of the application to match. */
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
      this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
      /* this event handler updated the spots remaining in real time. when an interview 
      is booked or deleted in scheduler app, scheduler-dashboard updates automatically.*/
      this.socket.onmessage = event => {
        const data = JSON.parse(event.data);
      
        if (typeof data === "object" && data.type === "SET_INTERVIEW") {
          this.setState(previousState =>
            setInterview(previousState, data.id, data.interview)
          );
        }
      };
    });
  }

  /*componentDidUpdate lifecycle method to listen for changes to the state. 
  These functions belong to the Dashboard class. Usually we place them at the 
  top of the class after the constructor, or state class property.*/
  /*JSON.stringify function to convert our values before writing them to the localStorage. 
  When we get the values out of storage, we use the JSON.parse function to convert 
  the string back to JavaScript values. This process of serialization allows us 
  to save more complex data types in localStorage. */
  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  /* Instance Method. The following code would not work because it 
  does not use an arrow function, so the binding of this remains dynamic. */
  // selectPanel(id) {
  //   this.setState({
  //    focused: id
  //   })
  // }
  /* Class Property with Arrow Function */
  // selectPanel = id => {
  //   this.setState({
  //    focused: id
  //   });
  // };

  /*Select panel instance method above is changed to include the following behavior. 
  We want to add the behaviour to go from the single panel view to the view with four panels. 
  We get stuck in the large view because when we click on the large panel, it continues 
  to set the state to the same panel .id. */
  /*Change the selectPanel function to set the value of focused back to null if the value of 
  focused is currently set to a panel. */
  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });

    if (this.state.loading) {
      return <Loading />;
    }

    const panels = data.filter(panel => this.state.focused === null || this.state.focused === panel.id).map(panel => (
    // <Panel
    //  key={panel.id}
    //   //id={panel.id}
    //  label={panel.label}
    //  value={panel.value}
    //  onSelect={event => this.selectPanel(panel.id)}
    // />
    /* Panel section above is updated as below. last step is to change the way we pass 
    the data to the Panel. We can update our render function to look up the value with 
    the latest state each time.*/
    <Panel
      key={panel.id}
      label={panel.label}
      value={panel.getValue(this.state)}
      onSelect={() => this.selectPanel(panel.id)}
    />
    ));
    //console.log(this.state);

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;

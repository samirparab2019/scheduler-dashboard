import React, { Component, useState } from "react";
import Loading from "../components/Loading"
import Panel from "../components/Panel"
import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];


class Dashboard extends Component {
  
  // constructor(props) {
  //   super(props);
  //   this.selectPanel = this.selectPanel.bind(this);
  // }

  state = {
    loading: false,
    focused: null
  };

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
    <Panel
     key={panel.id}
    //  id={panel.id}
     label={panel.label}
     value={panel.value}
     onSelect={event => this.selectPanel(panel.id)}
    />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;

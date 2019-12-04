import React, { Component, useState } from "react";

// class Panel extends Component {
//   render() {
//     const { id, label, value, onSelect } = this.props;

//     return (
//       <section
//         className="dashboard__panel" onClick={event => onSelect(id)}
//       >
//         <h1 className="dashboard__panel-header">{label}</h1>
//         <p className="dashboard__panel-value">{value}</p>
//       </section>
//     );
//   } 
// }

/* In the Panel component, remove the id prop from the list of values we destructure 
from this.props. Remove the arrow function from the onClick event. 
Only pass the reference to the onSelect prop. */
class Panel extends Component {
  render() {
   const { label, value, onSelect } = this.props;
 
   return (
    <section className="dashboard__panel" onClick={onSelect}>
     <h1 className="dashboard__panel-header">{label}</h1>
     <p className="dashboard__panel-value">{value}</p>
    </section>
   );
  }
 }

export default Panel;
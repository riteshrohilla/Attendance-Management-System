import React, { Component } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
} from "mdbreact";
import { List, Select } from "antd";
const { Option } = Select;

import moment from "moment";

class AttendanceInfo extends Component {
  render() {
    return (
      <MDBCard style={{ marginTop: "4%" }}>
        <MDBCardBody>
          <MDBCardTitle>Attendance Info</MDBCardTitle>
          <MDBCardText>
            <Select style={{ width: 120 }} onChange={this.props.getAttendance}>
              {this.props.classes
                ? this.props.classes.map((a) => {
                    return (
                      <Option key={a._id} value={a._id}>
                        {a.name}
                      </Option>
                    );
                  })
                : null}
            </Select>

            <span className="ml-2">{this.props.percentage}%</span>
            <List>
              {this.props.attendance
                ? this.props.attendance.map((a) => (
                    <List.Item>
                      {this.props.student
                        ? this.props.student.username
                        : "Student"}{" "}
                      was {this.props.getStatus(a.status)} on{" "}
                      {moment(a.date)
                        .toDate("DD/MM/YYYY")
                        .toDateString()}
                    </List.Item>
                  ))
                : null}
            </List>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    );
  }
}

export default AttendanceInfo;

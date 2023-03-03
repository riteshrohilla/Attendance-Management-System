import React, { Component } from "react";
import { 
Student } from "../../../../imports/api/student";
import { withTracker } from "meteor/react-meteor-data";
import { Classe } from "../../../api/classes";
import { Attendance } from "../../../api/attendance";

import { List, Select, Tag } from "antd";
const { Option } = Select;
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBCol,
  MDBRow,
  MDBContainer,
  MDBBtnGroup,
  MDBIcon,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  Container
} from "mdbreact";
import moment from "moment";
import InfoPanel from "./infoPanel";
import AttendanceInfo from "./attendanceInfo";
import QrCodeReader from "../../QR_code_reader";

class Homepage extends Component {
  constructor() {
    super();
    this.state = {
      classes: [],
      attendance: [],
      student: {},
      percentage: 0
    };
  }

  componentDidMount() {
    Meteor.call("get.student.classes", Meteor.userId(), (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(Meteor.userId())
      const student = Student.findOne({ accountId: Meteor.userId() });
      this.setState({ student: student });
      Meteor.call("get.classes.name", res, (err, res) => {
        if (err) {
          console.log(err);
        }
        this.setState({ classes: res });
      });
    });
  }

  getStatus = status => {
    if (status == "Present") {
      return <Tag color="green"> Present </Tag>;
    } else {
      return <Tag color="red"> Absent </Tag>;
    }
  };
  getAttendance = classId => {
    const student = Student.findOne({ accountId: Meteor.userId() });

    Meteor.call("get.attendance.class", student._id, classId, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        let present = 0;
        let total_classes = 0;
        let percentage;
        res.forEach(item => {
          if (item.status === "Present") {
            present++;
          }
          total_classes++;
        });
        percentage = (present / total_classes) * 100;
        percentage = Math.round((percentage + Number.EPSILON) * 100) / 100;
        this.setState({ attendance: res, percentage: percentage });
      }
    });
  };

  render() {
    return (
      <Container>
        <MDBRow>
          <MDBCol md="12">
            <InfoPanel
              classes={this.state.classes}
              student={this.state.student}
            />
          </MDBCol>
          <MDBCol md="6">
            <AttendanceInfo
              classes={this.state.classes}
              attendance={this.state.attendance}
              student={this.state.student}
              percentage={this.state.percentage}
              getAttendance={this.getAttendance}
              getStatus={this.getStatus}
            />
          </MDBCol>
          <MDBCol md="6">
            <MDBCard style={{ marginTop: "4%" }}>
              <MDBCardBody>
                <MDBCardTitle>Scan QR</MDBCardTitle>
                <MDBCardText>
                  <QrCodeReader />
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </Container>
    );
  }
}

const ViewArticlesWrapper = withTracker(props => {
  const status1 = Meteor.subscribe("get.login.student");
  const status2 = Meteor.subscribe("get.student.attendance");
  // const student = Student.findOne({ accountId: Meteor.userId() });
  // let attendance = Attendance.find({ studentId: Meteor.userId() }).fetch();
  // const classIds = Attendance.find(
  //   { studentId: Meteor.userId() },
  //   { fields: { classId: 1 } }
  // ).map(function(doc) {
  //   return doc.classId;
  // });
  //   const distinctClassId = _.
// uniq(classIds, false);

  // var distinctEntries = _.uniq(attendance.find({}, {
  //     sort: {classId: 1}, fields: {classId: true}
  // }).fetch().map(function(x) {
  //     return x.myField;
  // }), true);
  const ready = status1.ready() & status2.ready();
  // console.log(attendance);
  // console.log(distinctClassId);

  return {
    ready,
    // student,
    // attendance,
    ...props
  };
})(Homepage);

export default ViewArticlesWrapper;
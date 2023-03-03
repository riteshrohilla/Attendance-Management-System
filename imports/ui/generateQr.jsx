import React, { Component } from "react";
import QRCode from "qrcode.react";
import { Rnd } from "react-rnd";
import { withTracker } from "meteor/react-meteor-data";
import { Card, Spin } from "antd";
import { Classe } from "../api/classes";
import ManualAttendance from "./manualAttendance";
import {
  CardBody,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBRow
} from "mdbreact";
import InfoPanel from "./student/homepage/infoPanel";
import AttendanceInfo from "./student/homepage/attendanceInfo";
import QrCodeReader from "./QR_code_reader";
class QrCode extends Component {
  render() {
    return (
      <>
        <MDBRow>
          <MDBCol md="12" style={{ height: "50vh" }}>
            <MDBCard
              style={{ backgroundColor: "white" }}
              loading={!this.props.ready}
              style={{ height: "100%", width: "auto" }}
            >
              {" "}
              {this.props.data ? (
                <MDBCardBody>
                  <QRCode
                    value={`/attendance/${this.props.id}/d/${this.props.today}/c/${this.props.data.classCounter}`}
                    style={{ height: "100%", width: "auto" }}
                  />
                </MDBCardBody>
              ) : (
                <Spin />
              )}
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <hr/>
        <MDBRow>
          <MDBCol lg="10" md="12">

            <ManualAttendance id={this.props.id} />
          </MDBCol>
        </MDBRow>
      </>
    );
  }
}

const ViewArticlesWrapper = withTracker(props => {
  const id = props.id;
  const status = Meteor.subscribe("get.classes");
  const data = Classe.findOne({ _id: id });
  let today = new Date().getDay();
  if (today) {
    console.log(today);
  }
  const ready = status.ready();
  return {
    id,
    data,
    ready,
    today,
    ...props
  };
})(QrCode);

export default ViewArticlesWrapper;
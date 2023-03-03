import React, { Component } from "react";
import { MDBCard, MDBCardBody, MDBCardText, MDBCardTitle } from "mdbreact";
import { Tag } from "antd";

class InfoPanel extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle>Student Information</MDBCardTitle>
          <MDBCardText>
            <div className="block-section">
              <table className="table table-borderless table-striped table-vcenter">
                <tbody>
                  <tr>
                    <td className="text-right">Name</td>
                    <td>
                      {this.props.student
                        ? this.props.student.fname +
                          " " +
                          this.props.student.lname
                        : "NA"}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-right">Email</td>
                    <td>
                      {this.props.student ? (
                        <a href={`mailto:${this.props.student.email}`}>
                          {this.props.student.email}
                        </a>
                      ) : (
                        "NA"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="text-right">Classes</td>
                    <td>
                      {this.props.classes
                        ? this.props.classes.map((a) => (
                            <Tag color="geekblue">{a.name}</Tag>
                          ))
                        : "NA"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    );
  }
}

export default InfoPanel;

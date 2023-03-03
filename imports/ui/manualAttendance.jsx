import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Button, Card, Icon, Input, message, Table } from "antd";
import { navigate } from "@reach/router";
import Highlighter from "react-highlight-words";
import {
  CardBody,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { Student } from "../api/student";
import { Classe } from "../api/classes";
import { Attendance } from "../api/attendance";

export class ManualAttendance extends Component {
  //nothin
  state = {
    searchText: "",
    modal: false,
    userId: "",
    modal2: "",
    userRemoved: "",
    username: "",
    selected: [],
    modal3: false,
    classes: [],
    selectedRowKeys: [],
  };

  componentWillReceiveProps = (nextProps, nextContext) => {
    const { LatestAttendance } = nextProps;
    if (this.props.LatestAttendance !== LatestAttendance) {
      const arr1 = this.props.LatestAttendance;
      const arr2 = nextProps.LatestAttendance;
      console.log(arr1, arr2);
      const new_latest_attendance = arr1.concat(arr2);
      const mySet = new Set(new_latest_attendance);
      this.setState({
        selectedRowKeys: Array.from(mySet),
      });
    }
  };

  markAtt = () => {
    Meteor.call(
      "mark.attendance.many",
      this.state.selectedRowKeys,
      this.props.id,
      (err, res) => {
        if (err) {
          this.setState({ modal: false });

          message.error(err.reason);
        } else {
          this.setState({ modal: false });
          message.success("Student(s) marked!");
        }
      }
    );
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });
  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "username",
        key: "username",
        ...this.getColumnSearchProps("username"),
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <MDBBtn
              outline
              color="success"
              size="sm"
              onClick={() => navigate("/student/" + record._id)}
            >
              View
            </MDBBtn>
          </span>
        ),
      },
    ];
    const { selectedRowKeys } = this.state;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    console.log(this.state.selected);
    return (
      <MDBCard
        style={{ marginLeft: "5%", marginRight: "2%" }}
        loading={!this.props.ready}
      >
        <MDBModal
          isOpen={this.state.modal}
          toggle={() => this.setState({ modal: false })}
        >
          <MDBModalHeader toggle={() => this.setState({ modal: false })}>
            Mark Attendance
          </MDBModalHeader>
          <MDBModalBody>
            Are you sure you want to mark student(s) present for class?
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn
              color="secondary"
              onClick={() => this.setState({ modal: false })}
            >
              Cancel
            </MDBBtn>
            <MDBBtn color="secondary" onClick={() => this.markAtt()}>
              Confirm
            </MDBBtn>
          </MDBModalFooter>
        </MDBModal>
        <MDBCardBody>
          <MDBBtn
            outline
            color="default"
            size="sm"
            onClick={() => this.setState({ modal: true })}
          >
            {" "}
            Mark Attendance
          </MDBBtn>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.props.data}
            rowKey={(record) => record.accountId}
          />
        </MDBCardBody>
      </MDBCard>
    );
  }
}

const ViewArticlesWrapper = withTracker((props) => {
  const classId = props.id;
  console.log(classId);
  const status = Meteor.subscribe("get.students");
  const status2 = Meteor.subscribe("get.classes");
  const status3 = Meteor.subscribe("get.attendance", classId);
  const classs = Classe.findOne({ _id: classId });
  const LatestAttendance = [];
  let data;
  if (classs) {
    let list = classs.studentList || [];
    data = Student.find({ _id: { $in: list } }).fetch();
    data.forEach((student) => {
      const stAtt = Attendance.findOne({
        classId: classId,
        studentId: student.accountId,
        counter: classs.classCounter,
      });
      if (stAtt) {
        LatestAttendance.push(stAtt.studentId);
      }
    });
  }
  if (LatestAttendance) {
    console.log(LatestAttendance);
  }
  const ready = status.ready();
  return {
    data,
    LatestAttendance,
    ready,
    classs,
    ...props,
  };
})(ManualAttendance);

export default ViewArticlesWrapper;

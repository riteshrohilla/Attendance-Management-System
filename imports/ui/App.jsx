import React, { Component } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
const { Header, Content, Footer, Sider } = Layout;
import { withTracker } from "meteor/react-meteor-data";
import ViewStudents from "./View/student";
import { Router, Link } from "@reach/router";
import Dashboard from "./Dashboard";
import Sidebar from "./sidebar";
import CreateClass from "./Create/class";
import CreateUser from "./Create/users";
import ViewClasses from "./View/classes";
import QrCode from "./generateQr";
import ViewUsers from "./View/users";
import Class from "./Class";
import StudentClass from "./Student";
import Homepage from "./student/homepage/homepage";

class App extends Component {
  componentDidMount() {}
  routertouse = () => {
    if (Roles.userIsInRole(Meteor.userId(), "teacher")) {
      return (
        <Router>
          <Dashboard path="/" default />
          <CreateClass path="/create-class" />
          <ViewClasses path="/view-classes" />
          <ViewStudents path="/view-students" />
          <QrCode path="/qr/:id" />
          <Class path="/class/:id" />
          <StudentClass path="/student/:id" />
        </Router>
      );
    } else if (Roles.userIsInRole(Meteor.userId(), "admin")) {
      return (
        <Router>
          <CreateUser path="/create - user " />
          <ViewUsers path=" / view - users " default />
        </Router>
      );
    } else if (Roles.userIsInRole(Meteor.userId(), "student")) {
      return (
        <Router>
          <Homepage path="/" default />
        </Router>
      );
    }
  };
  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Content style={{ margin: "0 " }}>{this.routertouse()}</Content>
          <Footer style={{ textAlign: "center" }}>HSN</Footer>
        </Layout>
      </Layout>
    );
  }
}

const ListPageContainer = withTracker(({ id }) => {
  const status = Meteor.subscribe("_roles");
  const ready = status.ready();
  return { ready };
})(App);
export default ListPageContainer;

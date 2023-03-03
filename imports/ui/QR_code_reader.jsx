import React, { Component } from "react";
import QrReader from "react-qr-reader";
import { Link } from "@reach/router";
import { Button } from "antd";
import QRCode from "qrcode.react";

class QrCodeReader extends Component {
  constructor() {
    super();
    this.state = {
      result: "",
    };
  }
  componentDidMount() {
    console.log(this.props);
  }

  handleScan = (data) => {
    if (data) {
      this.setState({
        result: data,
        active: false,
      });
    }
  };
  handleError = (err) => {
    console.error(err);
  };
  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.setState({ active: true });
          }}
        >
          Scan QR
        </Button>
        {this.state.active ? (
          <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: "100%" }}
          />
        ) : this.state.result ? (
          <QRCode
            value={this.state.result}
            style={{ height: "auto", width: "100%" }}
          />
        ) : null}

        <p>
          {this.state.result ? (
            <a
              onClick={() => {
                this.setState({ active: false });
              }}
              target="_blank"
              href={`${this.state.result}/s/${Meteor.userId()}`}
            >
              Mark present
            </a>
          ) : null}
        </p>
      </div>
    );
  }
}

export default QrCodeReader;

import React, {
  Component
} from "react";
import PropTypes from "prop-types";
import _ from "lodash";  /* eslint-disable no-unused-vars */
import {
  TextField,
  Translation,
  Checkbox
} from "/imports/plugins/core/ui/client/components";

class WalletSettingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        apiKey: props.settings.apiKey,
        support: props.settings.support
      },
      checkbox: {
        "Authorize": _.includes(props.settings.support, "Authorize"),
        "De-authorize": _.includes(props.settings.support, "De-authorize"),
        "Capture": _.includes(props.settings.support, "Capture"),
        "Refund": _.includes(props.settings.support, "Refund")
      }
    };
  }

    handleStateChange = (e) => {
      const {
        settings
      } = this.state;
      settings[e.target.name] = e.target.value;
      this.setState({
        settings
      });
    }

    handleCheckBox = (event, isInputChecked, name) => {
      const {
        checkbox,
        settings
      } = this.state;
      checkbox[name] = isInputChecked;
      this.setState({
        checkbox
      });
      if (!_.includes(settings.support, name) && isInputChecked) {
        settings.support.push(name);
        return this.setState({
          settings
        });
      }
      const index = settings.support.indexOf(name);
      settings.support.splice(index, 1);
      return this.setState({
        settings
      });
    }

    handleSubmit = (e) => {
      e.preventDefault();
      return this.props.onSubmit(this.state.settings);
    }

    render() {
      const {
        settings
      } = this.props;
      const setting = this.state.settings;

      return (
        <div  />
      );
    }
}

WalletSettingsForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  settings: PropTypes.object
};

export default WalletSettingsForm;

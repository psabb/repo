import React, { Component } from "react";
import {
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "./UserLogin.css";

export class UserLogin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  handleMouseOver = () => {
    this.setState({
      isOpen: true,
    });
  };

  handleMouseLeave = () => {
    this.setState({
      isOpen: false,
    });
  };

  getInitials = (name) => {
    const names = name.split(" ");
    return names
      .map((name) => name[0])
      .join("")
      .toUpperCase();
  };

  render() {
    if (this.props.auth && this.props.auth.isAuthenticated) {
      const { user } = this.props.auth;
      const avatarContent = user.avatar ? (
        <img src={user.avatar} alt="User Avatar" className="avatar-image" />
      ) : (
        <div className="avatar-initials">{this.getInitials(user.userName)}</div>
      );

      return (
        <UncontrolledDropdown
          onMouseOver={this.handleMouseOver}
          onMouseLeave={this.handleMouseLeave}
          isOpen={this.state.isOpen}
        >
          <DropdownToggle nav>{avatarContent}</DropdownToggle>
          <DropdownMenu left>
            <h5 className="dropdown-item-text mb-0">{user.name}</h5>
            <p className="dropdown-item-text text-muted mb-0">
              {user.userName}
            </p>
            <DropdownItem divider />
            <DropdownItem onClick={this.props.onSignOut}>Sign Out</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      );
    } else {
      return (
        <NavItem>
          <NavLink className="text-dark" onClick={this.props.onSignIn} href="#">
            Sign in
          </NavLink>
        </NavItem>
      );
    }
  }
}

import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "reactstrap";
import { logout } from "../../redux/actions/authActions";

const Logout = (props) => {
    const dispatch = useDispatch();
    return (
        <NavLink
            onClick={() => {
                dispatch(logout());
            }}
            href="#"
        >
            Logout
        </NavLink>
    );
};

export default Logout;

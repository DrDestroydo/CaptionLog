import React, { useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "./redux/actions/authActions";
import { Switch, Route } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import Home from "./components/Home";
import Logs from "./components/logStuff/Logs";
import Log from "./components/logStuff/Log";
import Search from "./components/logStuff/Search";
import LogForm from "./components/logStuff/LogForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <Fragment>
            <Toolbar />
            <Switch>
                <Route path={`/logs/:search?`} component={Logs} />
                <Route path={`/log/:id`} component={Log} />
                <Route path={`/newLog`} component={LogForm} />
                <Route path={`/edit/:id`} component={LogForm} />
                <Route path={`/search/:value?/:field?`} component={Search} />
                <Route path={`/`} component={Home} />
            </Switch>
        </Fragment>
    );
};

export default App;

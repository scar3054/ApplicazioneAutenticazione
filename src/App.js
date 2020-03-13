import React from "react";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

//import "./App.css";

export default function App() {
    return (
        <Router>
            <div>
                <Route exact path="/">
                    <h1>Home</h1>
                    <ul>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/login" onClick={e => {
                                console.log("Logging out");
                                localStorage.clear()
                            }}>Logout</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                        {/* <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li> */}
                    </ul>
                </Route>
                <Route exact path="/login" component={Login} />

                <Route exact path="/register" component={Register} />
                {/* <Route exact path="/dashboard" component={Dashboard} /> */}
            </div>
        </Router >
    );
}

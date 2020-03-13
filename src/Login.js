import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Login extends Component {

    state = {
        loggedIn: false,
        username: "",
        password: "",
        token: ""
    };


    componentDidMount = () => {
        const token = localStorage.getItem("jwt")
        if (!token)
            return

        fetch("https://server-autenticazione--shakirhs.repl.co/test", {
            headers: {
                "x-access-token": token
            }
        }).then(r => {
            if (!r.ok) {
                localStorage.clear();
            } else {
                this.setState({ loggedIn: true })
            }
        })

    }

    login = () => {
        if (!this.state.username || !this.state.password) {
            document.getElementById("messaggioErrore").innerText = "Metti i dati"
            return;
        }

        fetch("https://server-autenticazione--shakirhs.repl.co/users/" + this.state.username, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(r => r.json())
            .then(b => {
                console.log(b)
                if (b.msg) {
                    document.getElementById("messaggioErrore").innerText = b.msg
                }

                if (b.authenticated) {
                    this.setState({ token: b.token })
                    localStorage.setItem("jwt", b.token)
                    this.setState({ loggedIn: true })
                }
            });
    };

    render() {
        if (this.state.loggedIn) {
            return (
                <Redirect
                    to={{
                        pathname: "/dashboard",
                        state: {
                            token: this.state.token
                        }
                    }}
                />
            )
        }

        return (

            <div>
                <h1>Fitness Diary</h1>
                <h2>Login</h2>
                <p>Username</p>
                <input
                    type="text"
                    onChange={e => this.setState({ username: e.target.value })}
                />
                <p>Password</p>
                <input
                    type="password"
                    onChange={e => this.setState({ password: e.target.value })}
                />
                <br />
                <p id="messaggioErrore" style={styles}></p>
                <br />
                <button onClick={this.login}>Login</button>
            </div>
        );
    }
}
const styles = {
    color: 'red',
}

export default Login;

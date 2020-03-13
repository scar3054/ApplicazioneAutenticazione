import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Register extends Component {
    state = {
        registered: false,
        username: "",
        password: "",
        confermaPassword: "",
        user: {
            nome: "",
            cognome: "",
            sesso: "",
            eta: 0,
            peso: 0,
            altezza: 0
        }
    };

    registrati = () => {
        if (!this.state.username || !this.state.password || !this.state.confermaPassword) {
            document.getElementById("messaggioErrore").innerText = "Devi mettere username password"
            return;
        }
        if (this.state.password !== this.state.confermaPassword) {
            document.getElementById("messaggioErrore").innerText = "Le password devono combaciare"
            return;
        }

        fetch("https://fitness-diary--shakirhs.repl.co/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        })
            .then(r => {
                if (r.ok) {
                    this.setState({ registered: true })
                }
                return r.json()
            }).then(b => {
                console.log(b)
                if (b.error) {
                    document.getElementById("messaggioErrore").innerText = b.error
                }
            })
    }


    render() {
        if (this.state.registered) {
            localStorage.clear()
            return (
                <Redirect to={{ pathname: "/login" }} />
            )
        }
        return (
            <div>
                <h1>Fitness Diary</h1>
                <h2>Register</h2>
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
                <p>Confirm password</p>
                <input
                    type="password"
                    onChange={e => this.setState({ confermaPassword: e.target.value })}
                />
                <p>Nome</p>
                <input
                    type="text"
                    onChange={e => {
                        const user = this.state.user
                        user.nome = e.target.value
                        this.setState({ user })
                    }
                    }
                />
                <p>Cognome</p>
                <input
                    type="text"
                    onChange={e => {
                        const user = this.state.user
                        user.cognome = e.target.value
                        this.setState({ user })
                    }
                    } />
                <p>Sesso</p>
                <select name="sesso" id="sesso">
                    <option value="m">M</option>
                    <option value="f">F</option>
                </select>
                <p>Età</p>
                <input
                    type="text"
                    onChange={e => {
                        const user = this.state.user
                        user.eta = e.target.value
                        this.setState({ user })
                    }
                    } /><p>Peso</p>
                <input
                    type="text"
                    onChange={e => {
                        const user = this.state.user
                        user.peso = e.target.value
                        this.setState({ user })
                    }
                    } /><p>Altezza</p>
                <input
                    type="text"
                    onChange={e => {
                        const user = this.state.user
                        user.altezza = e.target.value
                        this.setState({ user })
                    }
                    } />
                <br />
                <p id="messaggioErrore" style={styles}></p>
                <br />
                <button onClick={this.registrati}>Registrati</button>
            </div>
        );
    }
}
const styles = {
    color: 'red',
}

export default Register;

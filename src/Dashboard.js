import React, { Component } from "react";
import CiboItem from "./CiboItem"
import { Redirect } from "react-router-dom";

export default class Dashboard extends Component {

	state = {
		nome: "",
		cognome: "",
		sesso: "",
		eta: 0,
		peso: 0,
		altezza: 0,
		fabbisogno: 0,
		consumato: 0,
		cibo: "",
		calorie: 0,
		cibi: [],
		exit: false
	}

	componentDidMount() {
		const token = localStorage.getItem('jwt')
		if (!token) {
			localStorage.clear();
			this.setState({ exit: true })
			return
		}
		const cibi = JSON.parse(localStorage.getItem("cibi"))

		console.log("Chiedo i dati")
		fetch("https://fitness-diary--shakirhs.repl.co/api",
			{
				headers:
					{ "x-access-token": token }
			})
			.then(r => r.json())
			.then(b => {
				this.setState(
					{
						nome: b.nome,
						cognome: b.cognome,
						sesso: b.sesso,
						eta: b.eta,
						peso: b.peso,
						altezza: b.altezza
					})
				if (cibi) {
					this.setState({ cibi: cibi })
					this.calcolaConsumo()
				}
				this.calcolaFabbisogno()
			})

	}



	calcolaFabbisogno = () => {
		let kCal = 1
		const ADS = 0.30
		if (this.state.sesso === "F") {
			kCal = 0.9
		}
		const fabbisogno = kCal * this.state.peso * 24
		this.setState(
			{ fabbisogno: (fabbisogno + (fabbisogno * ADS)) })
	}

	calcolaConsumo = () => {
		let calorie = 0
		this.state.cibi.forEach(cibo => {
			calorie += parseInt(cibo.calorie)
		})
		const consumato = parseInt(calorie)
		this.setState({ consumato: consumato })
	}

	addCibo = () => {

		const { cibo, calorie, cibi } = this.state
		if (!cibo || !calorie || calorie < 0) {
			return
		}
		const id = Date.now()
		let flag = true
		cibi.forEach(c => {
			if (c.cibo.toLowerCase() === cibo.toLowerCase()) {
				c.calorie = parseInt(c.calorie) + parseInt(calorie)
				flag = false
			}
		})
		if (flag)
			cibi.push({ id, cibo, calorie })
		this.setState({ cibi: cibi })
		this.calcolaConsumo()
		//QUI AGGIORNO LISTA
		localStorage.setItem("cibi", JSON.stringify(this.state.cibi))
	}

	deleteCibo = async (id) => {
		const filteredCibi = this.state.cibi.filter(c => c.id !== id)
		await this.setState({ cibi: filteredCibi })
		this.calcolaConsumo()
		//QUI AGGIORNO LISTA
		localStorage.setItem("cibi", JSON.stringify(this.state.cibi))
	}



	render() {
		if (this.state.exit) {
			return (
				<Redirect to="/login" />
			)
		}
		return (
			<div style={{
				margin: 'auto',
				width: '100%',

			}}>
				<header style={headerStyle}><h1>Fitness Calculator</h1></header>
				<h1 style={headingStyle}>Ciao {this.state.nome} {this.state.cognome}</h1>
				<br />
				<h2 style={headingStyle}>Il tuo fabbisogno giornaliero è {this.state.fabbisogno} Kcal</h2>
				<br />
				<h4 style={headingStyle}>Oggi hai consumato {this.state.consumato} Kcal, ti mancano {this.state.fabbisogno - this.state.consumato} Kcal</h4>
				<br />
				<h5 style={headingStyle}>Inserisci cibo:</h5>
				<div style={{ textAlign: 'center' }}>
					<span style={{ marginLeft: "0%", marginRight: "8%" }} >Nome</span>  <span style={{ marginLeft: "4%" }}>Calorie</span>
					<br />
					<input style={{ flex: '10', padding: '5px' }}
						placeholder="Aggiungi cibo..."
						type="text" onChange={e => this.setState({ cibo: e.target.value })} />

					<input
						placeholder="Inserisci calorie"
						style={{ flex: '5', padding: '5px' }} type="number" name="calorie" id="calorie" onChange={e => this.setState({ calorie: e.target.value })} />
					<button style={btnStyle} onClick={this.addCibo}>+</button>
				</div>
				<div>
					{this.state.cibi.map(cibo => {
						return (
							<CiboItem key={cibo.id} cibo={cibo} deleteCibo={this.deleteCibo} />
						)
					})}
				</div>
			</div>
		)
	}
}

const headerStyle = {
	background: '#00ccff',
	color: '#fff',
	textAlign: 'center',
	padding: '10px'
}

const headingStyle = {
	margin: 'auto',
	textAlign: 'center'
}

const btnStyle = {
	color: '#66ccff',
	//border: 'none',
	padding: '5px',
	flex: 'right'
}

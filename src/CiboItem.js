import React, { Component } from 'react'

export class CiboItem extends Component {
	// Questa funzione controlla se il todo è markato come completato, e di conseguenza gli applica il corretto stile


	render() {
		// Questa operazione estrae i seguenti parametri dall'object todo
		// Viene definito "destructuring"
		const { id, cibo, calorie } = this.props.cibo
		return (
			<div style={divStyle}>
				<p>
					<span style={{ marginLeft: '10px' }}>Nome: {cibo}</span>
					<span style={{ marginLeft: '40%' }}>Calorie: {calorie} cal</span>
					<button onClick={this.props.deleteCibo.bind(this, id)} style={btnStyle}>X</button>
				</p>
			</div>
		)
	}
}

const btnStyle = {
	background: '#ff0000',
	color: '#fff',
	border: 'none',
	padding: '5px 10px',
	borderRadius: '50%',
	cursor: 'pointer',
	float: 'right'
}

const divStyle = {
	background: '#f4f4f4',
	padding: '8px',
	borderBottom: '1px #ccc dotted',
}

export default CiboItem
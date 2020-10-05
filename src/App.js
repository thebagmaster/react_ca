import React from 'react';
import './App.css';
import * as d3 from 'd3'

class Scatter extends React.Component{
	constructor(props){
		super(props);
		this.drawChart = this.drawChart.bind(this);
	}
	drawChart(){
		const svg = d3.select(this.svg);
		const margin = {top: 10, right: 30, bottom: 30, left: 60},
			width = 460 - margin.left - margin.right,
			height = 200 - margin.top - margin.bottom;

		svg	
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);
		
		const barsG = svg
			.select("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");

		let thresh = Array(30);
		for(let i = 0; i < thresh.length; i++)
			thresh[i]=i*(1/thresh.length);

		const bins = d3.bin()
	 .value(d => d)
	 .thresholds(thresh)
 (this.props.data);
		//bins.shift();

	const y = d3.scaleLinear()
        .domain([0 , d3.max(bins, (d)=>d.length)])
        .range([0, height]);

   const bars = barsG.selectAll("rect")
        .data(bins);
		bars
        .enter()
        .append("rect")
				.attr('width',13)
				.exit().remove();
		bars
				.attr('x',function(d,i) { return  i * 15})
				.attr('y',function(d,i) { return height - y(d.length)})
				.attr('fill','#000')
				.attr('height',function(d,i) { return y(d.length)});
	}
	componentDidMount(){
		this.drawChart();
	}
	componentDidUpdate(){
		this.drawChart();
	}
	render(){
		return(<svg className={'scatter'} ref={svg => (this.svg = svg)}><g></g></svg>);
	}
}

class Row extends React.Component{
constructor(props){
	super(props);
	this.n = 39;
	this.intmax = 4294967295;
	this.state = {
		rule:{
			'111':'0',
			'110':'0',
			'101':'0',
			'100':'1',
			'011':'1',
			'010':'1',
			'001':'1',
			'000':'0'
		},
		row:'0'.repeat(this.n).split(''),
		row2:'0'.repeat(this.n).split(''),
		nums:[]
	}
	this.left = (i)=>{
		i = i + this.state.row.length;
		i = i - 1;
		i = i % this.state.row.length;
		return this.state.row[i];
	}
	this.right = (i)=>{
		i = i + this.state.row.length;
		i = i + 1;
		i = i % this.state.row.length;
		return this.state.row[i];
	}
	this.next = ()=>{
		let row = this.state.row.slice();
		let num = row.join('').slice(0,32);
		num = parseInt(num,2);
		num = num/this.intmax;
		let nums = this.state.nums.slice();
		nums.push(num);
		this.state.row.map((e,i)=>{
			row[i] = this.state.rule[
				this.left(i)+
				this.state.row[i]+
				this.right(i)];
		});
		const pre = document.querySelector('.container .row:last-child');
		let clone = pre.cloneNode(true);
		clone.querySelector('.scatter').remove();
		this.cont.insertBefore(clone,pre);
		if(document.querySelectorAll('.container .row').length >15)
			document.querySelector('.container .row:nth-child(1)').remove();
		window.scrollTo(0,document.body.scrollHeight);
		this.setState({row:row,nums:nums});
	}
}
componentDidMount(){
	this.cont = document.querySelector('.container');
	let row = this.state.row.slice();
	row[parseInt(this.n/2)] = '1';
	this.setState({row:row});
	setInterval(this.next,50);
}

render(){
	return(
		<>
			<div className="two-half column">
			{this.state.row.map((e,i)=>
				<div className={`cell cell${this.state.row[i]}`} key={'cell'+i}>&nbsp;</div>
			)}
			<Scatter data={this.state.nums}/>
			</div>
		</>
	);
}
}

function App() {
  return (
    <div className="App container">
			<div className="row">
				<Row />
			</div>
    </div>
  );
}

export default App;

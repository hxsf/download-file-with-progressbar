const dl = require('./index');

option = {
	onDone: (info)=>{
		console.log('done', info);
	},
	onError: (err) => {
		console.log('error', err);
	},
	onProgress: (curr, total) => {
		console.log('progress', (curr / total * 100).toFixed(2) + '%');
	},
}

dl('http://localhost:8000/3.zip', option);
// console.log(dl);

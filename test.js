var dl = require('./index');

option = {
	onDone: (info)=>{
		console.log('done', info);
	},
	onError: (err={}) => {
		console.log('error2', err);
	},
	onProgress: (curr, total) => {
		console.log('progress', (curr / total * 100).toFixed(2) + '%');
	},
}

dl('http://localhost:8000/MS-DOS.7.10.ISO', option);
// console.log(dl);

const dl = require('./index');

option = {
	filename: 'test.exe',
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

dl('http://test.com/file.ext', option);
// console.log(dl);

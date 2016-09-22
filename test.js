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

var a = dl('http://test.com/file.ext', option);
setTimeout(function () {
	a.abort()
}, 2000);
// console.log(dl);

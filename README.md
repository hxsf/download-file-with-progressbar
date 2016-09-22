# Download file with progress bar

## Require

- node: ^6.0.0

use some ES6 feature, you can use babel to make it support node below 6.0.0

## Install

```
npm install --save download-file-with-progressbar
```
## Usage

```
const dl = require('download-file-with-progressbar');

option = {
	filename: 'the filename to store, default = path.basename(YOUR_URL) || "unknowfilename"',
	dir: 'the folder to store, default = os.tmpdir()',
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

var dd = dl('YOUR_URL', option);

dd.abort() // to abort the download

```

## Demo

```
progress 0.00%
progress 0.69%
progress 1.38%
progress 2.08%
progress 2.77%
progress 3.46%
...
...
...
progress 98.68%
progress 99.11%
progress 99.46%
progress 100.00%
done {
	path: '/var/folders/cd/gy7q816s141339zt56j83fg00000gn/T/MS-DOS.7.10.ISO',
	url: 'http://localhost:8000/MS-DOS.7.10.ISO',
	size: 9455616
}
```

## License

this project uses `SATA` license (The Star And Thank Author License)，anyway，you should star this repo before use.

More details: [LICENSE](./LICENSE)文件。

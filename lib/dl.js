const request = require('request');
const fs = require('fs');
const path = require('path');
var os = require('os');

defaultOption = {
	dir: os.tmpdir(),
	filename: null,
	onDone: new Function,
	onError: new Function,
	onProgress: null,
};

function download(url, filepath, onError, onDone, onProgress) {
	request.get(url)
	.on('response',function(res){
        res.pipe(fs.createWriteStream(filepath));
        let totalSize = parseInt(res.headers['content-length'], 10);//文件大小的长度
        let curSize = 0; //文件接收大小

        res.on('data',function(chunk){
            //判读是否显示进度条
            if(onProgress){
                onProgress(curSize, totalSize)
            }
            curSize+=chunk.length;
        });

        res.on('end',()=>{
            //校验是否现在完整
            let fileSize = fs.statSync(filepath)['size'];
            let isFullDown = totalSize===fileSize;

            //如果没有下载完整则为下载失败
            if(!isFullDown){
				onError({msg: '文件校验失败'})
            } else {
				onProgress(totalSize, totalSize);
				onDone({
					path: filepath,
					url: url,
					size: totalSize
				});
			}
        });
    })
    .on('error',(err)=>{
		onError(err);
    });
}

module.exports = function (url, option = {}) {
	let {dir, filename} = option;
	console.log('filename', filename);
	if (!filename) {
		filename = path.basename(url) || 'unknowfilename';
		console.log('filename2', filename);
	}
	console.log('filename3', filename);
	console.log('path', dir, dir||defaultOption.dir, filename);
	let filepath = path.join(dir || defaultOption.dir, filename);
	let onError = option.onError || defaultOption.onError;
	let onDone = option.onDone || defaultOption.onDone;
	let onProgress = option.onProgress || defaultOption.onProgress;
	download(url, filepath, onError, onDone, onProgress);
};

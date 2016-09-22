const request = require('request');
const fs = require('fs');
const path = require('path');
const os = require('os');

defaultOption = {
    dir: os.tmpdir(),
    filename: null,
    onDone: new Function,
    onError: new Function,
    onProgress: null,
};

function download(url, filepath, onError, onDone, onProgress) {
    let out = fs.createWriteStream(filepath);
    return request.get(url)
        .on('response', function(res) {
            out.on('finish', () => {
                //校验是否现在完整
                let fileSize = fs.statSync(filepath)['size'];
                let isFullDown = totalSize === curSize;
                //如果没有下载完整则为下载失败
                if (!isFullDown) {
                    onError({
                        msg: '文件校验失败'
                    })
                } else {
                    onProgress(totalSize, totalSize);
                    onDone({
                        path: filepath,
                        url: url,
                        size: totalSize
                    });
                }
            });
            let totalSize = parseInt(res.headers['content-length'], 10); //文件大小的长度
            let curSize = 0; //文件接收大小

            res.on('data', function(chunk) {
                curSize += chunk.length;
                //判读是否显示进度条
                if (onProgress) {
                    onProgress(curSize, totalSize)
                }
            });
        })
        .on('error', (err) => {
            onError(err);
        })
        .pipe(out);
}

module.exports = function(url, option = {}) {
    let {
        dir,
        filename
    } = option;
    if (!filename) {
        filename = path.basename(url) || 'unknowfilename';
    }
    let filepath = path.join(dir || defaultOption.dir, filename);
    let onError = option.onError || defaultOption.onError;
    let onDone = option.onDone || defaultOption.onDone;
    let onProgress = option.onProgress || defaultOption.onProgress;
    return download(url, filepath, onError, onDone, onProgress);
};

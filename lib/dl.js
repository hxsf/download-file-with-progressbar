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
    var req = request.get(url);
    var isAbort = false;
    req.on('response', function(res) {
            out.on('finish', () => {
                // Check if the download was aborted on purpose
                if (isAbort) {
                    return;
                };
                let fileSize = fs.statSync(filepath)['size'];
                
                let isFullDown = totalSize === curSize || totalSize === -1;
                // Check if the file was fully downloaded
                if (!isFullDown) {
                    onError({
                        msg: 'The download was incomplete.',
                        errcode: 'err_dlincomplete'
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
            // Set the totalSize to -1 if the server doesn't report it
            if(isNaN(totalSize)) {
                totalSize = -1;
            }
        
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
    return {
        request: req,
        abort: function () {
            isAbort = true;
            this.request.abort()
        }
    }
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

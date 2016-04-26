import crypto from 'crypto'
import cfg from '../config'

export default function (savePath, options = {}) {
  options.bucket = cfg.upload.bucket;
  options.expiration = options.expiration || (+new Date + cfg.upload.expired ); // 默认10s后过期
  options['save-key'] = savePath;
  const policy = new Buffer(JSON.stringify(options)).toString('base64');
  const signature = crypto.createHash('md5').update(`${policy}&${cfg.upload.secret}`).digest('hex');
  return { policy: policy, signature: signature };
}

/**
 * 错误分类
 */

// 保存或跟新成功
const Ok = (data) => {
  return { code: true, data: data }
};

// 保存或更新出错
const SaveError = (err) => {
  let errors = [];
  //TODO: 提取mongodb返回的错误信息并格式化
  if (err.errors) {
    for(let [key, value] of Object.entries(err.errors)) {
      errors.push({ error: key, msg: value.message });
    }
  } else {
    errors = err;
  }

  return { code: false, errors: errors};
};

export { Ok, SaveError };

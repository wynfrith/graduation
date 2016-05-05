/**
 * 错误分类
 */

// 保存或跟新成功
const Ok = (data) => {
  return { code: 0, data: data }
};

// 保存或更新出错
const SaveError = (err) => {
  console.log(err);
  let errors = [];
  if (err.errors) {
    for(let [key, value] of Object.entries(err.errors)) {
      errors.push({ error: key, msg: value.message });
    }
  } else {
    errors = err;
  }
  console.log('debug: SaveError ==> : ', errors);
  return { code: 1,  errors: errors};
};

const NotFoundError = () => {
  return { code: 2 };
};

const ConstraintsError = () => {
  return { code: 3 };
};
 
export { Ok, SaveError, NotFoundError, ConstraintsError };

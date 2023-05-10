export const fileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('only image file are allowed'));
  }
  callback(null, true);
};
export const editFile = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const typeFile = file.originalname.split('.')[1];
  const newName = `${name.split(' ').join('-')}-${Math.floor(
    Math.random() * 9999999,
  )}.${typeFile}`;
  callback(null, newName);
};

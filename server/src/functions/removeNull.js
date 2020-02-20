const removenull = obj => {
  return JSON.parse(JSON.stringify(obj).replace(/:null/g, ':""'));
};

module.exports = removenull;

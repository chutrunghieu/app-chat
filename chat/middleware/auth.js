const axios = require('axios').default;

exports.authen = async (req, res) => {
  try {
    const response = await axios({method: 'GET', url: 'http://172.28.208.1:3000/authen'});
    const dataAuthen = response.data;
    return res.status(200).json({ msg: "Success", dataAuthen });
  } catch (error) {
    res.status(400).json({ message: "Error!" });
    console.log(error);
  }
}

exports.author = (roleRight) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ message: "You must login!" });
    } else {
      const token = authHeader.split(' ')[1];
    const response = await axios({method: 'GET', url: 'http://172.28.208.1:3000/author', headers: {"Authorization" : `Bearer ${token}`}});
    if (!response.data) {
      return reject("Not authenticate");
    }
    req.user = response.data;
    if (!roleRight || roleRight !== response.data.user_role.toLowerCase()) {
      return reject("You do not have access");
    } else {
      return next()
    }
    }
  } catch (error) {
    res.status(400).json({ message: "Error!" });
    console.error(error);
  }
}


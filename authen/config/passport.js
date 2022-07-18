const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
var dotenv = require("dotenv");
const userModel = require("../models/userModel");
dotenv.config();


const jwtOptions = {
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const jwtVerify = async (payload, done) => {
    try {
      const user = await userModel.findOne({ where: {user_id: payload.user_id} });
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  };

exports.jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
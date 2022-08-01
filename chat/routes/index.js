
const route = (app, io) => {
    const userRouter = require('./user')(io);
    app.use('/users', userRouter);
};

module.exports = route;

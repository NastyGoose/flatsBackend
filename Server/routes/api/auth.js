const User = require('../../models/user');
const UserSession = require('../../models/userSession');
const jwt = require('jsonwebtoken');

const { Router } = require('express');

const router = new Router();

router.post('/signup', (req, res, next) => {
    const { body } = req;
    const {
        login,
        password
    } = body;
    let {
        email
    } = body;

    if (!login) {
        return res.send({
            success: false,
            message: 'Error: Login cannot be blank'
        });
    }
    if (!email) {
        return res.send({
            success: false,
            message: 'Error: Email cannot be blank'
        });
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Error: Password cannot be blank'
        });
    }

    email = email.toLowerCase();

    console.log(email);

    User.find({
        email: email
    }, (err, previousUsers) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server Error'
            });
        } else if (previousUsers.length > 0) {
            return res.send({
                success: false,
                message: 'Error: Account already exists'
            });
        }

        const newUser = new User();

        newUser.email = email;
        newUser.login = login;
        newUser.password = newUser.generateHash(password);
        newUser.token = jwt.sign({
            email,
            login,
        }, 'keyword');
        newUser.save((err, user) => {
            if (err) {
                return res.send({
                    success: false,
                    message: 'Error: Account already exists'
                });
            }
            return res.send({
                success: true,
                message: 'Signed up'
            });
        });
    });
});

router.post('/signin', (req, res, next) => {
    const { body } = req;
    const {
        password
    } = body;
    let {
        email
    } = body;
    console.log(req.body);
    if (!email) {
        return res.send({
            success: false,
            message: 'Error: Email cannot be blank'
        });
    }
    if (!password) {
        return res.send({
            success: false,
            message: 'Error: Password cannot be blank'
        });
    }

    email = email.toLowerCase();

    User.findOne({
        email: email
    }, (err, user) => {
        if (err) {
            console.log("error: ",err);
            return res.send({
                success: false,
                message: 'Error: server error'
            });
        }

        if (user) {
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid password'
                });
            }

            // Otherwise
            const userSession = new UserSession();
            userSession.userToken = user.token;
            userSession.save((err, doc) => {
                if (err) {
                    console.log("error2: ", err);
                    return res.send({
                        success: false,
                        message: 'Error: server error'
                    });
                }
                console.log('flats: ', user.favoriteFlats);
                return res.send({
                    success: true,
                    message: 'Valid sign in',
                    token: doc.userToken,
                });
            });
        } else {
            console.log('User not found');
        }
    });
});

router.post('/changeData', (req, res, next) => {
   console.log(req.body);
   const { payload } = req.body.newData;
   const { oldEmail } = req.body.newData;

   if (payload.password) payload.password = generateHash(payload.password);

   User.findOne({ email: oldEmail }, (err, user) => {
       Object.keys(payload).forEach(curr => {
           user[curr] = payload[curr];
       });
       user.token = jwt.sign({
                    email: user.email,
                    login: user.login,
                }, 'keyword');

       user.update({
           $set: {
                 email: user.email,
                 login: user.login,
                 password: user.password,
                 token: user.token,
           }}).exec();

       return res.send({
                  success: true,
                  message: 'Successfully changed data',
                  payload: user.token,
                  });
   });
});

router.get('/verify', (req, res, next) => {
    // Get the token
    console.log('request: ', req);
    const { query } = req;
    console.log('query: ', query);
    const { token } = query;
    console.log('token: ', token);
    // ?token=test

    // Verify the token is one of the kind and its not deleted

    UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if (err) {
                //  Cast to ObjectId failed, must be fixed in future
                console.log(err);
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                });
            }

            if (sessions.length != 1) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            } else {
                return res.send({
                    success: true,
                    message: 'Good'
                });
            }
        }
    );
});

router.get('/checkPassword/:email/:password', (req, res, next) => {
    console.log(req.params);
    const {
        password,
        email
    } = req.params;

    User.findOne({
            email,
            isDeleted: false
        }, (err, user) => {
        if (err) {
            console.log(err);
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }

        if (user) {
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: 'Error: Invalid password'
                });
            }
            return res.send({
                success: true,
                message: 'Success'
            });
        }
    });
});

router.get('/logout', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test

    // Verify the token iso ne of the kind and its not deleted

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    }, {
        $set: {
            isDeleted: true
        }
    }, null, (err, sessions) => {
        if (err) {
            //  Cast to ObjectId failed, must be fixed in future
            console.log(err);
            return res.send({
                success: false,
                message: 'Error: Server error'
            });
        }
        return res.send({
            success: true,
            message: 'Successfully deleted'
        });
    });
});

module.exports = (app) => {
    app.use('/api/account', router);
};

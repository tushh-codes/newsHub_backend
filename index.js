const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/newshubDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = new mongoose.model('User', userSchema);

//Routes
app.post('/login', (req, res) => {
  const { email, password } = req.body; //extracting inputs from front end
  User.findOne({ email: email }).then((user) => {
    //if user is registered it will be returned as user object
    //checking if user already exists
    if (user) {
      if (password === user.password) {
        res.send({
          message: `login successful, Welcome ${user.name}`,
          user: user,
        }); // we're sending the user object from the database to app.js.
      } else {
        res.send({ message: 'Invalid Credentials' });
      }
    } else {
      res.send({ message: 'User not registered' });
    }
  });
});

app.post('/register', (req, res) => {
  //   console.log(req.body);
  const { name, email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.send({ message: 'User already registered' });
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password,
        });
        return newUser.save();
      }
    })
    .then(() => {
      res.send({ message: 'User Registered successfully, Please login now' });
    })
    .catch((err) => {
      res.send(err);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('listening on port 5000!');
});

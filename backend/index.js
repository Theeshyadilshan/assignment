const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authMiddleware = require("./authMiddleware");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

let users = [
  { email: "nimal@gmail.com", name: "nimal", password: "password123" },
];
let posts = [
  { title: "post1" },
  { title: "post2" },
  { title: "post3" },
  { title: "post4" },
];
const ACCESS_TOKEN_SECRET=process.env.ACCESS_TOKEN_SECRET||'access_token_secret'
const REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET||'refresh_token_secret'

const generateAccessToken = (user) =>
  jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
const generateRefreshToken = (user) =>
  jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  console.log(email, password);

  if (!user) {
    return res.sendStatus(401);
  }

  const accessToken = generateAccessToken({
    email: user.email,
    name: user.name,
  });
  const refreshToken = generateRefreshToken({
    email: user.email,
    name: user.name,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken, user: { email: user.email, name: user.name } });
});
app.post("/register", (req, res) => {
  const { email, password,name } = req.body;
  users=[...users,req.body]
  console.log(email);
  res.json('login success');
  

})
app.get("/refresh-token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      email: user.email,
      name: user.name,
    });
    res.json({ accessToken, user: { email: user.email, name: user.name } });
  });
});
app.get("/protected", authMiddleware, (req, res) => {
  res.json(posts);
});

app.post("/logout", (req, res) => {
  res.cookie("refreshToken",'', {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 0,
  });
  res.end()
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

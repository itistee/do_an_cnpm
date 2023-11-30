const pool = require("../model/connectdbUser");
const jwt = require("jsonwebtoken");
// get home admin
let gethomeController = async(req, res) => {
  const [rows, fields] = await pool.execute( 'SELECT * FROM `datausers`')
// await pool.execute( 'SELECT * FROM `users`') sẽ trả về 1 mảng các phần tử trong db , 2 là trả về fields 
  res.render("HomeAdmin.ejs", { dataUser: rows });
}

// post home
let postHome = async (req, res) => {
  console.log("post home da login");
  res.clearCookie("tokenUser");
  res.render("NoLoginHome.ejs");
};
// get home
const getHome = async (req, res) => {
  const token = req.cookies.tokenUser;
  if (token) {
    const result = jwt.verify(token, "matkhau123");
    const id = result.split("/");
    console.log("mang thong tin ", id);
    const [rows, fields] = await pool.execute(
      " select * from datausers where id = ?",
      [id[0]]
    );
    console.log("data lay ddc ", rows[0]);
   return res.render("Home.ejs", { data: rows[0].username });
  }
  return res.render("NoLoginHome.ejs")
};
const getLogin = (req, res) => {
  res.render("Login.ejs");
};
const getRegister = (req, res) => {
  res.render("Register.ejs");
};

// post dang ky
const postRegister = async (req, res) => {
  const username = req.body.UserName;
  const password = req.body.PassWord;
  const confirmpassword = req.body.ConfirmPassWord;
  const email = req.body.Email;
  // check comfirm password
  if (password !== confirmpassword) {
    res.json("nhap dung mat khau");
  } else {
    const [rows, fields] = await pool.execute(
      "INSERT INTO datausers(username,password,email,admin) VALUES(?,?,?,?)",
      [username, password, email, 0]
    );
      console.log("dang ky thanh cong post ")
    res.render("NoLoginHome.ejs");
  }
  res.json("loi post register")
};

const getForgotFassword = (req, res) => {
  res.render("ForgotFassword.ejs");
};
const getProducts = (req, res) => {
  res.render("Products.ejs");
};

// post login
const postLogin = async (req, res) => {
  const username = req.body.UserName;
  const password = req.body.Password;
  const [rows, fields] = await pool.execute(
    "SELECT * FROM `datausers` where username = ? and password = ? ",
    [username, password]
  );
  if (rows[0].admin === 0) {
    console.log("admin == 0");
    const tokenUser = jwt.sign(rows[0].id + "/" + rows[0].admin, "matkhau123");
    res.cookie(`tokenUser`, tokenUser);
    res.redirect("/");
  } else if (rows[0].admin === 1) {
    console.log("admin == 1");
    const tokenAdmin = jwt.sign(rows[0].id, "matkhau1234");
    res.cookie("tokenAdmin", tokenAdmin);
    res.render("demo.ejs");
  } else {
    res.json("ko tim thay tài khoản này ");
  }
};
module.exports = {
  getHome,
  getLogin,
  getRegister,
  getForgotFassword,
  getProducts,
  postLogin,
  postRegister,
  postHome,
  gethomeController,
};

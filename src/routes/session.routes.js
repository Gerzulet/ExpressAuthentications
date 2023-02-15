import { Router } from 'express'
import { userModel } from "../models/users.models.js";
import { createHash } from '../utils.js'
import passport from 'passport'

const router = Router()

router.post('/login', passport.authenticate('login', {failureRedirect: '/session/failedlogin'}), async (req,res) => {
  if (!req.user) return res.status(400).send({status:'error', error:'Credenciales invalidas'})
  req.session.user = {
  first_name : req.user.first_name, 
  last_name : req.user.last_name, 
  age: req.user.age, 
  email : req.user.email
  }
  res.render('profile', {user:req.session.user})
})
router.get('/github', passport.authenticate('github', {scope: ['user:email'] }))

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), async (req,res) => {
  req.session.user = req.user; 
  res.redirect('/profile')
})


router.get('/failedlogin', (req,res) => {
  res.send({message:'Failed Login'})
})
router.post('/register', passport.authenticate('register', { failureRedirect: '/session/failregister' }), async (req, res) => {
  res.send({ status: 'success', message: 'Usuario Registrado' })
})

router.get('/failregister', (req,res) => {
  console.log('Ha ocurrido un problema en la registracion')
  res.send({status:'failure', message:"Ha ocurrido un problema en la registracion"})
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

export default router;

// OLD WAY TO AUTHENTICATE
// router.post('/register', async (req, res) => {
//   const { first_name, last_name, email, age, password, role } = req.body;
//   if (!first_name || !last_name || !email || !age || !password) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }
//   try {
//     const usuarioRegistrado = await userModel.findOne({ email, password });
//     if (usuarioRegistrado) return res.status(400).json({ message: 'Usuario ya existente' })
//     let isAdmin;
//     role === 'admin' ? isAdmin = true : null
//     const user = await userModel.create({
//       first_name,
//       last_name,
//       email,
//       age,
//       password: createHash(password),
//       role,
//       isAdmin
//     })
//     res.status(200).redirect('/login')
//   } catch (error) {
//     res.status(400).json({ error })
//   }
// })

// OLD WAY TO AUTHENTICATE
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body

//   try {
//     const user = await userModel.findOne({ email, password });
//     if (!user) return res.status(400).json({ message: 'Usuario no encontrado' })
//     if (!isValidPassword(user, password)) return res.status(403).send('Contraseña no valida')
//     delete user.password;

//     req.session.user = user;

//     res.status(200).redirect("/profile");
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// })
// RESTAURACION DE CONTRASEÑA 
// router.post('/restore', async (req, res) => {


//   const { mail, password } = req.body
//   const usuarioRegistrado = await userModel.findOne({ mail });

//   if (!usuarioRegistrado) return res.status(203).send('Usuario no encontrado')

//   try {
//     await userModel.findOneAndUpdate({ mail },
//       { $set: { password: createHash(password) } })


//   } catch (error) {
//     res.send(error)
//   }



// })


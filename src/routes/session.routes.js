import { Router } from 'express'
import { userModel } from "../models/users.models.js";
import { createHash } from '../utils.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await userModel.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' })
    if (!isValidPassword(user, password)) return res.status(403).send('Contraseña no valida')
    delete user.password;
    req.session.user = user;

    res.status(200).redirect("/profile");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})
router.post('/restore', async (req, res) => {


  const { mail, password } = req.body
  const usuarioRegistrado = await userModel.findOne({ mail });

  if (!usuarioRegistrado) return res.status(203).send('Usuario no encontrado')

  try {
   await userModel.findOneAndUpdate({mail},
      {$set: {password: createHash(password)}}) 


  } catch (error) {
     res.send(error) 
  }



})



router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;



  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }


  try {
    const usuarioRegistrado = await userModel.findOne({ email, password });
    if (usuarioRegistrado) return res.status(400).json({ message: 'Usuario ya existente' })
    let isAdmin;
    role === 'admin' ? isAdmin = true : null
    const user = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role,
      isAdmin



    })
    res.status(200).redirect('/login')
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

export default router;

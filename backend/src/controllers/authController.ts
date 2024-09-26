import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User"
import { sendWelcomeEmail } from "../services/emailService"

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, dob, phoneNumber, gender } =
    req.body

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      res.status(400).json({ error: "Email is already registered" })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      dob,
      phoneNumber,
      gender,
    })

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    )

    // Send email
    sendWelcomeEmail(user.email, user.firstName)

    res.status(201).json({ message: "User created successfully", token })
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    )
    res.status(200).json({ message: "Login successful", token })
  } catch (error) {
    res.status(500).json({ error: "Internal server error" })
  }
}

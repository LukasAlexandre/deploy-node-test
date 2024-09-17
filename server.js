// importar bibliotecas
import express from 'express'
import { PrismaClient } from '@prisma/client'
import connectDB from './connectMongo.js';
import dotenv from 'dotenv'

// Functions
connectDB();
dotenv.config();

// declarar variáveis
const prisma = new PrismaClient()
const app = express()



// declarar usuabilidades
app.use(express.json())


// rota get - listar
app.get('/usuarios', async (req, res) => {
    const users = await prisma.user.findMany()

    res.status(200).json(users)
})

// rota post - criar
app.post('/usuarios', async (req, res) => {

    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
    res.status(201).json(req.body)
})

// rota put - editar
app.put('/usuarios/:id', async (req, res) => {

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })
    res.status(201).json(req.body)
})
// rota put - editar
app.delete('/usuarios/:id', async (req, res) => {

    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({message: 'usuário deletado com sucesso'})
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
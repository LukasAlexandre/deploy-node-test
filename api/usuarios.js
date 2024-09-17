import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Inicializar Prisma e Mongoose
const prisma = new PrismaClient();
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Connect to MongoDB successfully");
    } catch (error) {
        console.log("Connect failed " + error.message);
    }
};

// Handler para as rotas
export default async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        // Rota GET - Listar
        try {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching users' });
        }
    } else if (req.method === 'POST') {
        // Rota POST - Criar
        try {
            const user = await prisma.user.create({
                data: {
                    email: req.body.email,
                    name: req.body.name,
                    age: req.body.age
                }
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error creating user' });
        }
    } else if (req.method === 'PUT') {
        // Rota PUT - Editar
        try {
            const user = await prisma.user.update({
                where: {
                    id: req.query.id
                },
                data: {
                    email: req.body.email,
                    name: req.body.name,
                    age: req.body.age
                }
            });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error updating user' });
        }
    } else if (req.method === 'DELETE') {
        // Rota DELETE - Deletar
        try {
            await prisma.user.delete({
                where: {
                    id: req.query.id
                }
            });
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting user' });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

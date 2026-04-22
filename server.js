import cors from 'cors'
import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/generate', async (req, res) => {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(req.body)
        })

        const data = await response.json()
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(3001, () => {
    console.log('🔥 Server rodando em http://localhost:3001')
})

console.log('API KEY:', process.env.ANTHROPIC_API_KEY)
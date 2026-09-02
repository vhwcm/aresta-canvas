import express from 'express'
import cors from 'cors'
import { canvasRouter } from './routes/canvas.routes'
import { noteRouter } from './routes/note.routes'

const app = express()
const PORT = process.env.PORT ?? 3004

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'aresta-canvas', port: PORT }))

app.use('/api/canvas', canvasRouter)
app.use('/api/canvases', canvasRouter)
app.use('/api/notes', noteRouter)

app.listen(PORT, () => {
  console.log(`[aresta-canvas] Running on http://localhost:${PORT}`)
})

export default app

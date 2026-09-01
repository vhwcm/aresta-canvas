import type { Request, Response } from 'express'
import { canvasService } from '../services/canvas.service'

export class CanvasController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const canvases = await canvasService.findAll(req.user!.userId)
      res.json({ canvases })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const canvas = await canvasService.findById(req.params.id, req.user!.userId)
      res.json({ canvas })
    } catch (err: any) {
      res.status(404).json({ error: err.message })
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const canvas = await canvasService.create(req.user!.userId, req.body)
      res.status(201).json({ canvas })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const canvas = await canvasService.update(req.params.id, req.user!.userId, req.body)
      res.json({ canvas })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      await canvasService.delete(req.params.id, req.user!.userId)
      res.status(204).send()
    } catch (err: any) {
      res.status(404).json({ error: err.message })
    }
  }
}

export const canvasController = new CanvasController()

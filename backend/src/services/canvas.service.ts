import { prisma } from '../config/database'

export class CanvasService {
  async findAll(userId: number) {
    return prisma.canvas.findMany({
      where: { user_id: userId },
      orderBy: { updated_at: 'desc' },
      select: { id: true, title: true, description: true, created_at: true, updated_at: true },
    })
  }

  async findById(id: string, userId: number) {
    const canvas = await prisma.canvas.findFirst({ where: { id, user_id: userId } })
    if (!canvas) throw new Error('Canvas not found')
    return canvas
  }

  async create(userId: number, data: { title?: string; description?: string; data?: string }) {
    return prisma.canvas.create({
      data: {
        user_id: userId,
        title: data.title ?? 'Quadro sem título',
        description: data.description,
        data: data.data ?? JSON.stringify({ nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } }),
      },
    })
  }

  async update(id: string, userId: number, data: { title?: string; description?: string; data?: string }) {
    const canvas = await prisma.canvas.findFirst({ where: { id, user_id: userId } })
    if (!canvas) throw new Error('Canvas not found')
    return prisma.canvas.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.data !== undefined && { data: data.data }),
      },
    })
  }

  async delete(id: string, userId: number) {
    const canvas = await prisma.canvas.findFirst({ where: { id, user_id: userId } })
    if (!canvas) throw new Error('Canvas not found')
    return prisma.canvas.delete({ where: { id } })
  }
}

export const canvasService = new CanvasService()

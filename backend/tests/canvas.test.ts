import { describe, it, expect } from 'vitest'
import { canvasService } from '../src/services/canvas.service'

describe('CanvasService (Folders, Tags & CRUD)', () => {
  it('cria quadro com pasta e tags e recupera', async () => {
    const created = await canvasService.create(1, {
      title: 'Quadro Álgebra',
      description: 'Notas de estudo',
      folder: 'Matemática',
      tags: ['estudo', 'álgebra'],
    })

    expect(created).toHaveProperty('id')
    expect(created.title).toBe('Quadro Álgebra')
    expect(created.folder).toBe('Matemática')
    expect(created.tags).toEqual(['estudo', 'álgebra'])

    const fetched = await canvasService.getById(created.id, 1)
    expect(fetched.folder).toBe('Matemática')
    expect(fetched.tags).toEqual(['estudo', 'álgebra'])

    // Atualiza pasta e tags
    const updated = await canvasService.update(created.id, 1, {
      folder: 'Exatas',
      tags: ['estudo', 'álgebra', 'revisado'],
    })
    expect(updated.folder).toBe('Exatas')
    expect(updated.tags).toContain('revisado')

    // Listar por pasta
    const listFolder = await canvasService.getAllByUser(1, { folder: 'Exatas' })
    expect(listFolder.some((c) => c.id === created.id)).toBe(true)

    // Listar por tag
    const listTag = await canvasService.getAllByUser(1, { tag: 'revisado' })
    expect(listTag.some((c) => c.id === created.id)).toBe(true)

    // Obter pastas distintas
    const folders = await canvasService.getFolders(1)
    expect(folders).toContain('Exatas')

    // Duplicar preservando pasta e tags
    const dup = await canvasService.duplicate(created.id, 1)
    expect(dup.title).toContain('Cópia')
    expect(dup.folder).toBe('Exatas')
    expect(dup.tags).toContain('revisado')

    // Cleanup
    await canvasService.delete(created.id, 1)
    await canvasService.delete(dup.id, 1)
  })
})

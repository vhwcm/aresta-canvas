import { describe, it, expect } from 'vitest'
import { noteService } from '../src/services/note.service'

describe('NoteService in aresta-canvas', () => {
  it('cria e recupera nota com extração de links compostos', async () => {
    const created = await noteService.create(1, {
      title: 'Nota Desacoplada',
      content: '# Resumo\nVeja ![[canvas:canvas-uuid-1]] e o livro ![[book:10]].',
      folder: 'Filosofia',
      tags: ['mente', 'pensamento'],
    })

    expect(created).toHaveProperty('id')
    expect(created.title).toBe('Nota Desacoplada')
    expect(created.links).toHaveLength(2)
    expect(created.tags).toEqual(['mente', 'pensamento'])

    const fetched = await noteService.getById(created.id, 1)
    expect(fetched.title).toBe('Nota Desacoplada')
    expect(fetched.links).toHaveLength(2)

    await noteService.delete(created.id, 1)
  })

  it('lista notas e pastas por usuário', async () => {
    const created = await noteService.create(1, {
      title: 'Nota de Teste',
      content: 'Conteúdo...',
      folder: 'Pastas/Testes',
    })

    const list = await noteService.getAllByUser(1, { folder: 'Pastas/Testes' })
    expect(list.notes.length).toBeGreaterThanOrEqual(1)

    const folders = await noteService.getFolders(1)
    expect(folders).toContain('Pastas/Testes')

    await noteService.delete(created.id, 1)
  })
})

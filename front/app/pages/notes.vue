<template>
  <div class="h-screen flex flex-col bg-bgRoot text-textPrimary overflow-hidden font-interface select-none pb-20 md:pb-0">
    <!-- Top Header -->
    <header class="h-14 border-b border-divider bg-bgPanel flex items-center justify-between px-4 z-20 flex-shrink-0">
      <div class="flex items-center gap-3">
        <NuxtLink to="/canvas" class="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <ArestaLogoGraph :size="28" :to="null" />
          <span class="font-bold text-sm md:text-base tracking-tight text-textPrimary">Aresta Notes</span>
        </NuxtLink>
        <span class="text-divider">/</span>
        <span class="text-xs text-textSecondary truncate max-w-[200px]">
          {{ activeNote ? activeNote.title : 'Todas as Notas' }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/canvas"
          class="px-3 py-1.5 rounded-xl border border-divider hover:bg-black/5 dark:hover:bg-white/5 text-xs text-textSecondary hover:text-textPrimary transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LayoutGridIcon class="w-3.5 h-3.5 text-accent" />
          <span class="hidden sm:inline">Quadros & Canvas</span>
        </NuxtLink>

        <button
          class="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1 cursor-pointer hover:scale-102"
          @click="createNewNote"
        >
          <PlusIcon class="w-3.5 h-3.5" />
          <span>Nova Nota</span>
        </button>
      </div>
    </header>

    <!-- Main Workspace com 3 Colunas Estilo Samsung Notes -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Coluna 1: Sidebar de Pastas e Tags -->
      <FolderTagSidebar
        :items="notesList"
        :folders="folders"
        :selected-folder="activeFolder"
        :selected-tag="activeTag"
        title="Notas & Pastas"
        item-label="notas"
        @select-folder="handleSelectFolder"
        @select-tag="handleSelectTag"
        @create-folder="handleCreateFolder"
        @rename-folder="handleRenameFolder"
        @delete-folder="handleDeleteFolder"
      />

      <!-- Coluna 2: Lista de Notas Filtradas -->
      <aside class="w-72 md:w-80 border-r border-divider bg-bgPanel/50 flex flex-col flex-shrink-0">
        <!-- Campo de Busca -->
        <div class="p-3 border-b border-divider space-y-2">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar nas notas..."
              class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-bgSurface border border-divider text-xs text-textPrimary focus:outline-none focus:border-accent placeholder:text-textSecondary/50 font-interface shadow-sm"
              @input="onSearchChange"
            />
            <SearchIcon class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
          </div>

          <!-- Indicador de filtro ativo -->
          <div v-if="activeFolder || activeTag" class="flex items-center gap-1.5 text-[11px] text-textSecondary flex-wrap">
            <span v-if="activeFolder" class="px-2 py-0.5 rounded bg-accent/15 text-accent font-medium flex items-center gap-1">
              📁 {{ activeFolder === '__uncategorized__' ? 'Sem pasta' : activeFolder }}
              <button @click="activeFolder = null" class="cursor-pointer">✕</button>
            </span>
            <span v-if="activeTag" class="px-2 py-0.5 rounded bg-accent text-white font-medium flex items-center gap-1">
              #{{ activeTag }}
              <button @click="activeTag = null" class="cursor-pointer">✕</button>
            </span>
          </div>
        </div>

        <!-- Lista de Cards das Notas -->
        <div class="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
          <div
            v-for="note in filteredNotes"
            :key="note.id"
            class="p-3 rounded-xl border transition-all cursor-pointer select-none group"
            :class="activeNote?.id === note.id ? 'border-accent bg-accent/10 shadow-sm' : 'border-divider hover:border-dividerHover bg-bgSurface hover:bg-bgElevated'"
            @click="selectNote(note)"
          >
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-xs font-semibold text-textPrimary line-clamp-1 group-hover:text-accent transition-colors">
                {{ note.title || 'Nota sem título' }}
              </h4>
              <span v-if="note.linksCount && note.linksCount > 0" class="text-[10px] text-accent bg-accent/10 px-1.5 py-0.2 rounded border border-accent/20">
                🔗 {{ note.linksCount }}
              </span>
            </div>

            <p class="text-[11px] text-textSecondary line-clamp-2 leading-relaxed">
              {{ note.content || 'Sem conteúdo adicional.' }}
            </p>

            <!-- Tags da nota no card -->
            <div v-if="note.tags && note.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="tag in note.tags"
                :key="tag"
                class="text-[9px] px-1.5 py-0.2 rounded bg-bgRoot text-textSecondary border border-divider"
              >
                #{{ tag }}
              </span>
            </div>

            <div class="mt-2 flex items-center justify-between text-[10px] text-textSecondary/70 font-mono">
              <span>{{ note.folder || 'Sem pasta' }}</span>
              <span>{{ formatTime(note.updatedAt) }}</span>
            </div>
          </div>

          <div v-if="filteredNotes.length === 0 && !isLoading" class="text-center py-12 text-xs text-textSecondary">
            Nenhuma nota encontrada.
          </div>
        </div>
      </aside>

      <!-- Coluna 3: Editor e Visualizador da Nota Ativa -->
      <main v-if="activeNote" class="flex-1 flex flex-col bg-bgDarker overflow-hidden">
        <!-- Barra de Ferramentas da Nota -->
        <div class="h-14 border-b border-divider bg-bgPanel flex items-center justify-between px-6 flex-shrink-0 gap-4">
          <input
            v-model="activeNote.title"
            type="text"
            placeholder="Título da nota..."
            class="bg-transparent border-none text-base font-semibold text-textPrimary focus:outline-none flex-1 font-serif mr-4"
            @input="scheduleSave"
          />

          <div class="flex items-center gap-2 flex-shrink-0">
            <!-- Seletor de Pasta da Nota -->
            <div class="flex items-center gap-1.5 text-xs text-textSecondary">
              <FolderIcon class="w-3.5 h-3.5 text-accent" />
              <select
                v-model="activeNote.folder"
                class="bg-bgSurface border border-divider rounded-lg px-2 py-1 text-xs text-textPrimary focus:outline-none focus:border-accent cursor-pointer"
                @change="scheduleSave"
              >
                <option :value="null">Sem pasta</option>
                <option v-for="f in folders" :key="f" :value="f">📁 {{ f }}</option>
              </select>
            </div>

            <!-- Alternador de Modos (Dividido / Editor / Preview) -->
            <div class="flex rounded-xl bg-bgElevated p-0.5 border border-divider text-xs">
              <button
                class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                :class="viewMode === 'split' ? 'bg-accent text-white font-medium shadow-sm' : 'text-textSecondary hover:text-textPrimary'"
                @click="viewMode = 'split'"
              >
                Dividido
              </button>
              <button
                class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                :class="viewMode === 'edit' ? 'bg-accent text-white font-medium shadow-sm' : 'text-textSecondary hover:text-textPrimary'"
                @click="viewMode = 'edit'"
              >
                Editor
              </button>
              <button
                class="px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                :class="viewMode === 'preview' ? 'bg-accent text-white font-medium shadow-sm' : 'text-textSecondary hover:text-textPrimary'"
                @click="viewMode = 'preview'"
              >
                Preview
              </button>
            </div>

            <!-- Botão Inserir Canvas Embed -->
            <button
              class="px-2.5 py-1 rounded-xl bg-bgElevated hover:bg-bgSurface text-xs text-textSecondary hover:text-textPrimary border border-divider transition-colors flex items-center gap-1 cursor-pointer"
              title="Inserir Embed de Canvas"
              @click="openCanvasPicker"
            >
              <LayoutGridIcon class="w-3.5 h-3.5 text-accent" />
              <span class="hidden md:inline">Canvas</span>
            </button>

            <!-- Botão Excluir Nota -->
            <button
              class="p-1.5 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              title="Excluir Nota"
              @click="handleDeleteNote"
            >
              <Trash2Icon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Barra de Tags da Nota Atual -->
        <div class="px-6 py-2 border-b border-divider bg-bgSurface/40 flex items-center gap-2 flex-wrap text-xs">
          <TagIcon class="w-3.5 h-3.5 text-accent" />
          <span class="text-textSecondary text-[11px] font-medium">Tags:</span>

          <span
            v-for="(tag, idx) in activeNote.tags"
            :key="tag"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/15 text-accent text-xs font-medium"
          >
            #{{ tag }}
            <button @click="removeTagFromNote(idx)" class="hover:text-white cursor-pointer ml-0.5">✕</button>
          </span>

          <div class="flex items-center gap-1">
            <input
              v-model="newNoteTagInput"
              type="text"
              placeholder="+ Adicionar tag (Enter)"
              class="bg-transparent border-none text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none min-w-[120px]"
              @keydown.enter.prevent="addTagToNote"
              @keydown="handleNoteTagKeyDown"
            />
          </div>
        </div>

        <!-- Corpo do Editor & Preview -->
        <div class="flex-1 flex overflow-hidden">
          <!-- Textarea (Markdown) -->
          <div
            v-if="viewMode === 'edit' || viewMode === 'split'"
            class="flex-1 border-r border-divider/60 p-6 overflow-y-auto bg-bgSurface/30 custom-scrollbar"
          >
            <textarea
              v-model="activeNote.content"
              placeholder="Escreva sua anotação em Markdown... Use ![[canvas:id]] para embutir um canvas ou ![[book:id]] para embutir um livro."
              class="w-full h-full bg-transparent border-none resize-none focus:outline-none text-sm leading-relaxed text-textPrimary font-mono placeholder:text-textSecondary/40"
              @input="scheduleSave"
            ></textarea>
          </div>

          <!-- Preview em Tempo Real (Composite Renderer) -->
          <div
            v-if="viewMode === 'preview' || viewMode === 'split'"
            class="flex-1 p-6 overflow-y-auto bg-bgDarker custom-scrollbar"
          >
            <NoteCompositeRenderer
              :content="activeNote.content"
              :note-id="activeNote.id"
              :note-title="activeNote.title"
            />
          </div>
        </div>
      </main>

      <!-- Estado Vazio quando nenhuma nota estiver selecionada -->
      <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-center bg-bgDarker select-none">
        <div class="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-3xl mb-4">
          📝
        </div>
        <h3 class="text-base font-semibold text-textPrimary">Nenhuma nota selecionada</h3>
        <p class="text-xs text-textSecondary mt-1 max-w-sm">
          Selecione uma nota da lista ao lado ou crie uma nova anotação para começar.
        </p>
        <button
          class="mt-4 px-4 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          @click="createNewNote"
        >
          + Criar Nota
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutGridIcon,
  PlusIcon,
  SearchIcon,
  FolderIcon,
  TagIcon,
  Trash2Icon
} from 'lucide-vue-next'
import FolderTagSidebar from '~/components/FolderTagSidebar.vue'
import ArestaLogoGraph from '~/components/ArestaLogoGraph.vue'
import { useNotes } from '~/composables/useNotes'
import { useCanvas } from '~/composables/useCanvas'
import type { NoteItem } from '~/interfaces/note'
import NoteCompositeRenderer from '~/components/notes/NoteCompositeRenderer.vue'

const route = useRoute()
const { notesList, folders, isLoading, fetchNotes, fetchFolders, createNote, updateNote, deleteNote, loadNote } = useNotes()
const { fetchCanvases, canvasesList } = useCanvas()

const activeNote = ref<NoteItem | null>(null)
const searchQuery = ref('')
const activeFolder = ref<string | null>(null)
const activeTag = ref<string | null>(null)

const viewMode = ref<'split' | 'edit' | 'preview'>('split')
const newNoteTagInput = ref('')
let saveTimeout: any = null

onMounted(async () => {
  await Promise.all([fetchNotes(), fetchFolders(), fetchCanvases()])

  if (route.query.id && typeof route.query.id === 'string') {
    const note = await loadNote(route.query.id)
    if (note) activeNote.value = note
  } else if (notesList.value.length > 0) {
    activeNote.value = notesList.value[0] || null
  }
})

// Filtros combinados de Busca + Pasta + Tag nas Notas
const filteredNotes = computed(() => {
  return notesList.value.filter((n) => {
    // Filtro por pasta
    if (activeFolder.value !== null) {
      if (activeFolder.value === '__uncategorized__') {
        if (n.folder) return false
      } else if (n.folder !== activeFolder.value) {
        return false
      }
    }

    // Filtro por tag
    if (activeTag.value !== null) {
      if (!n.tags || !n.tags.includes(activeTag.value)) return false
    }

    // Filtro por busca
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchTitle = n.title?.toLowerCase().includes(q)
      const matchContent = n.content?.toLowerCase().includes(q)
      const matchTag = n.tags?.some((t) => t.toLowerCase().includes(q))
      if (!matchTitle && !matchContent && !matchTag) return false
    }

    return true
  })
})

const handleSelectFolder = (folder: string | null) => {
  activeFolder.value = folder
}

const handleSelectTag = (tag: string | null) => {
  activeTag.value = tag
}

const handleCreateFolder = (name: string) => {
  if (!folders.value.includes(name)) {
    folders.value.push(name)
  }
}

const handleRenameFolder = async ({ oldName, newName }: { oldName: string; newName: string }) => {
  const idx = folders.value.indexOf(oldName)
  if (idx !== -1) folders.value[idx] = newName

  for (const n of notesList.value) {
    if (n.folder === oldName) {
      await updateNote(n.id, { folder: newName })
    }
  }

  if (activeFolder.value === oldName) activeFolder.value = newName
  if (activeNote.value && activeNote.value.folder === oldName) {
    activeNote.value.folder = newName
  }
}

const handleDeleteFolder = async (folderName: string) => {
  folders.value = folders.value.filter((f) => f !== folderName)
  for (const n of notesList.value) {
    if (n.folder === folderName) {
      await updateNote(n.id, { folder: null })
    }
  }
  if (activeFolder.value === folderName) activeFolder.value = null
  if (activeNote.value && activeNote.value.folder === folderName) {
    activeNote.value.folder = null
  }
}

const selectNote = (note: NoteItem) => {
  activeNote.value = { ...note, tags: Array.isArray(note.tags) ? [...note.tags] : [] }
}

const createNewNote = async () => {
  const folder = activeFolder.value && activeFolder.value !== '__uncategorized__' ? activeFolder.value : null
  const tags = activeTag.value ? [activeTag.value] : []

  const created = await createNote({
    title: 'Nova Nota',
    content: '# Nova Anotação\n\nComece a digitar seu pensamento aqui...',
    folder,
    tags
  })
  if (created) {
    activeNote.value = { ...created, tags: Array.isArray(created.tags) ? [...created.tags] : [] }
  }
}

const addTagToNote = () => {
  if (!activeNote.value) return
  const clean = newNoteTagInput.value.trim().replace(/^#/, '')
  if (!activeNote.value.tags) activeNote.value.tags = []
  if (clean && !activeNote.value.tags.includes(clean)) {
    activeNote.value.tags.push(clean)
    scheduleSave()
  }
  newNoteTagInput.value = ''
}

const handleNoteTagKeyDown = (e: KeyboardEvent) => {
  if (e.key === ',') {
    e.preventDefault()
    addTagToNote()
  }
}

const removeTagFromNote = (idx: number) => {
  if (!activeNote.value || !activeNote.value.tags) return
  activeNote.value.tags.splice(idx, 1)
  scheduleSave()
}

const scheduleSave = () => {
  if (!activeNote.value) return
  if (saveTimeout) clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    if (activeNote.value) {
      await updateNote(activeNote.value.id, {
        title: activeNote.value.title,
        content: activeNote.value.content,
        folder: activeNote.value.folder,
        tags: activeNote.value.tags || []
      })
    }
  }, 600)
}

const handleDeleteNote = async () => {
  if (!activeNote.value) return
  if (confirm('Tem certeza de que deseja excluir esta nota?')) {
    await deleteNote(activeNote.value.id)
    activeNote.value = filteredNotes.value[0] || null
  }
}

const openCanvasPicker = () => {
  if (!activeNote.value) return
  if (canvasesList.value.length === 0) {
    alert('Nenhum canvas encontrado. Crie um quadro primeiro!')
    return
  }
  const canvas = canvasesList.value[0]
  if (canvas) {
    activeNote.value.content += `\n\n![[canvas:${canvas.id}]]\n`
    scheduleSave()
  }
}

const onSearchChange = () => {
  // O computed filteredNotes já faz a filtragem em tempo real na memória
}

const formatTime = (dateStr?: string) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--divider, rgba(255, 255, 255, 0.1));
  border-radius: 4px;
}
</style>

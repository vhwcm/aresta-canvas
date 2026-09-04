<template>
  <div class="h-screen w-full flex bg-bgRoot text-textPrimary overflow-hidden font-interface select-none">
    <!-- Sidebar de Pastas & Tags (Samsung Notes Style) -->
    <FolderTagSidebar
      :items="canvasesList"
      :folders="canvasFolders"
      :selected-folder="activeFolder"
      :selected-tag="activeTag"
      title="Quadros & Canvas"
      item-label="quadros"
      @select-folder="handleSelectFolder"
      @select-tag="handleSelectTag"
      @create-folder="handleCreateFolder"
      @rename-folder="handleRenameFolder"
      @delete-folder="handleDeleteFolder"
    />

    <!-- Área Principal de Quadros -->
    <main class="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar p-6 md:p-10 pb-28">
      <div class="max-w-6xl w-full mx-auto space-y-7">
        <!-- Top Header & Ações -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-divider pb-6">
          <div>
            <div class="flex items-center gap-3">
              <ArestaLogoGraph :size="32" :to="null" />
              <h1 class="text-2xl md:text-3xl font-bold font-serif tracking-tight">Quadros & Anotações Livres</h1>
            </div>
            <p class="text-sm text-textSecondary mt-1">
              Quadros infinitos estilo Obsidian Canvas organizados por pastas e tags como no Samsung Notes.
            </p>
          </div>

          <!-- Botões de Ação -->
          <div class="flex items-center gap-3 flex-wrap">
            <input
              ref="fileInputRef"
              type="file"
              accept=".canvas,.json"
              class="hidden"
              @change="handleFileImport"
            />

            <button
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bgPanel hover:bg-black/5 dark:hover:bg-white/5 text-textPrimary border border-divider text-xs md:text-sm font-medium transition-all shadow-sm cursor-pointer"
              @click="triggerImport"
            >
              <UploadCloudIcon class="w-4 h-4 text-textSecondary" />
              <span>Importar .canvas</span>
            </button>

            <button
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white text-xs md:text-sm font-semibold transition-all shadow-lg shadow-accent/20 hover:scale-102 cursor-pointer disabled:opacity-50"
              :disabled="isCreating"
              @click="newCanvasModalOpen = true"
            >
              <PlusIcon class="w-4 h-4" />
              <span>Novo Quadro</span>
            </button>
          </div>
        </div>

        <!-- Barra de Busca e Filtros Ativos -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="relative w-full max-w-md">
            <SearchIcon class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Pesquisar por título, descrição ou tags..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bgPanel border border-divider text-sm text-textPrimary focus:outline-none focus:border-accent placeholder:text-textSecondary/50 shadow-sm"
            />
          </div>

          <div class="flex items-center gap-2 text-xs text-textSecondary font-mono">
            <span>{{ filteredCanvases.length }} quadro{{ filteredCanvases.length === 1 ? '' : 's' }}</span>
          </div>
        </div>

        <!-- Chips de Filtros Ativos (Pasta e Tag) -->
        <div v-if="activeFolder || activeTag" class="flex items-center gap-2 flex-wrap text-xs">
          <span class="text-textSecondary">Filtros ativos:</span>

          <span
            v-if="activeFolder"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/15 border border-accent/30 text-accent font-medium"
          >
            <FolderIcon class="w-3.5 h-3.5" />
            <span>{{ activeFolder === '__uncategorized__' ? 'Sem pasta' : activeFolder }}</span>
            <button @click="activeFolder = null" class="hover:text-white cursor-pointer ml-1">✕</button>
          </span>

          <span
            v-if="activeTag"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent text-white font-medium shadow-sm"
          >
            <span>#{{ activeTag }}</span>
            <button @click="activeTag = null" class="hover:opacity-80 cursor-pointer ml-1">✕</button>
          </span>

          <button
            @click="activeFolder = null; activeTag = null"
            class="text-xs text-textSecondary hover:text-accent underline ml-2 cursor-pointer"
          >
            Limpar todos
          </button>
        </div>

        <!-- Alerta de Erro -->
        <div
          v-if="errorMessage"
          class="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between"
        >
          <span>{{ errorMessage }}</span>
          <button class="text-xs font-semibold underline hover:text-red-300 ml-4 cursor-pointer" @click="errorMessage = null">
            Fechar
          </button>
        </div>

        <!-- Grid de Quadros -->
        <div v-if="filteredCanvases.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="item in filteredCanvases"
            :key="item.id"
            class="group relative flex flex-col justify-between p-5 rounded-2xl bg-bgPanel border border-divider hover:border-accent/50 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            @click="openCanvas(item.id)"
          >
            <div>
              <!-- Cabeçalho do Card com Pasta e Ações -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-accent"></span>
                  <span
                    v-if="item.folder"
                    class="inline-flex items-center gap-1 text-[11px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-md"
                  >
                    <FolderIcon class="w-3 h-3" />
                    <span class="truncate max-w-[120px]">{{ item.folder }}</span>
                  </span>
                  <span v-else class="text-[11px] text-textSecondary/70 italic">Sem pasta</span>
                </div>

                <!-- Menu de Ações Rápidas -->
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
                  <button
                    class="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-textSecondary hover:text-accent transition-colors cursor-pointer"
                    title="Mover para pasta"
                    @click="openMoveModal(item)"
                  >
                    <FolderInputIcon class="w-3.5 h-3.5" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-textSecondary hover:text-accent transition-colors cursor-pointer"
                    title="Editar tags"
                    @click="openTagsModal(item)"
                  >
                    <TagIcon class="w-3.5 h-3.5" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-textSecondary hover:text-textPrimary transition-colors cursor-pointer"
                    title="Duplicar quadro"
                    @click="handleDuplicate(item.id)"
                  >
                    <CopyIcon class="w-3.5 h-3.5" />
                  </button>
                  <button
                    class="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Excluir quadro"
                    @click="handleDelete(item.id)"
                  >
                    <Trash2Icon class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <!-- Título & Descrição -->
              <h3 class="text-base font-semibold text-textPrimary group-hover:text-accent transition-colors line-clamp-1">
                {{ item.title }}
              </h3>
              <p v-if="item.description" class="text-xs text-textSecondary mt-1 line-clamp-2">
                {{ item.description }}
              </p>

              <!-- Tags do Card (Chips Clicáveis) -->
              <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1.5 mt-3" @click.stop>
                <button
                  v-for="tag in item.tags"
                  :key="tag"
                  @click="activeTag = tag"
                  class="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer"
                  :class="activeTag === tag ? 'bg-accent text-white' : 'bg-bgSurface text-textSecondary hover:text-accent border border-divider'"
                >
                  #{{ tag }}
                </button>
              </div>
            </div>

            <!-- Rodapé com Nós, Conexões e Data -->
            <div class="flex items-center justify-between pt-4 mt-4 border-t border-divider/60 text-xs text-textSecondary">
              <div class="flex items-center gap-3 font-mono">
                <span class="inline-flex items-center gap-1" title="Nós no quadro">
                  <span>📝</span> {{ item.nodeCount || 0 }}
                </span>
                <span class="inline-flex items-center gap-1" title="Conexões / Arestas">
                  <span>🔗</span> {{ item.edgeCount || 0 }}
                </span>
              </div>

              <span class="text-[11px] text-textSecondary/70 font-mono">
                {{ formatDate(item.updatedAt) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Estado Vazio -->
        <div
          v-else-if="!isLoading"
          class="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl border border-dashed border-divider bg-bgPanel/40"
        >
          <div class="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl mb-4">
            ✨
          </div>
          <h3 class="text-lg font-semibold text-textPrimary">Nenhum quadro encontrado</h3>
          <p class="text-sm text-textSecondary max-w-md mt-1 mb-6">
            {{ activeFolder || activeTag || searchQuery ? 'Nenhum quadro corresponde aos filtros selecionados.' : 'Crie seu primeiro quadro infinito para organizar ideias e anotações com IA.' }}
          </p>
          <button
            class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-accent/20"
            @click="newCanvasModalOpen = true"
          >
            <PlusIcon class="w-4 h-4" />
            <span>Criar Novo Quadro</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Modais Reutilizáveis de Ação -->
    <CanvasActionModals
      v-model:new-canvas-modal-open="newCanvasModalOpen"
      v-model:move-modal-open="moveModalOpen"
      v-model:tags-modal-open="tagsModalOpen"
      :target-canvas="targetCanvas"
      :folders="canvasFolders"
      :is-creating="isCreating"
      :initial-folder="activeFolder"
      :initial-tag="activeTag"
      @confirm-create="handleConfirmCreate"
      @confirm-move="handleConfirmMove"
      @confirm-tags="handleConfirmTags"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  SearchIcon,
  PlusIcon,
  UploadCloudIcon,
  FolderIcon,
  FolderInputIcon,
  TagIcon,
  CopyIcon,
  Trash2Icon
} from 'lucide-vue-next'
import FolderTagSidebar from '~/components/FolderTagSidebar.vue'
import ArestaLogoGraph from '~/components/ArestaLogoGraph.vue'
import CanvasActionModals from '~/components/canvas/CanvasActionModals.vue'
import { useCanvas } from '~/composables/useCanvas'
import type { CanvasSummary } from '~/interfaces/canvas'

const searchQuery = ref('')
const activeFolder = ref<string | null>(null)
const activeTag = ref<string | null>(null)

const fileInputRef = ref<HTMLInputElement | null>(null)
const isCreating = ref(false)
const errorMessage = ref<string | null>(null)

// Modais
const newCanvasModalOpen = ref(false)
const moveModalOpen = ref(false)
const tagsModalOpen = ref(false)
const targetCanvas = ref<CanvasSummary | null>(null)

const {
  canvasesList,
  canvasFolders,
  isLoading,
  fetchCanvases,
  fetchCanvasFolders,
  createCanvas,
  updateCanvasMetadata,
  deleteCanvas,
  duplicateCanvas,
  importJsonCanvas,
} = useCanvas()

onMounted(async () => {
  try {
    await Promise.all([fetchCanvases(), fetchCanvasFolders()])
  } catch (err: any) {
    console.error('Erro ao carregar quadros:', err)
  }
})

// Filtros combinados de Busca + Pasta + Tag
const filteredCanvases = computed(() => {
  return canvasesList.value.filter((c) => {
    if (activeFolder.value !== null) {
      if (activeFolder.value === '__uncategorized__') {
        if (c.folder) return false
      } else if (c.folder !== activeFolder.value) {
        return false
      }
    }

    if (activeTag.value !== null) {
      if (!c.tags || !c.tags.includes(activeTag.value)) return false
    }

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchTitle = c.title?.toLowerCase().includes(q)
      const matchDesc = c.description?.toLowerCase().includes(q)
      const matchTag = c.tags?.some((t) => t.toLowerCase().includes(q))
      if (!matchTitle && !matchDesc && !matchTag) return false
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
  if (!canvasFolders.value.includes(name)) {
    canvasFolders.value.push(name)
  }
}

const handleRenameFolder = async ({ oldName, newName }: { oldName: string; newName: string }) => {
  const idx = canvasFolders.value.indexOf(oldName)
  if (idx !== -1) canvasFolders.value[idx] = newName

  for (const item of canvasesList.value) {
    if (item.folder === oldName) {
      await updateCanvasMetadata(item.id, { folder: newName })
    }
  }

  if (activeFolder.value === oldName) {
    activeFolder.value = newName
  }
}

const handleDeleteFolder = async (folderName: string) => {
  canvasFolders.value = canvasFolders.value.filter((f) => f !== folderName)
  for (const item of canvasesList.value) {
    if (item.folder === folderName) {
      await updateCanvasMetadata(item.id, { folder: null })
    }
  }
  if (activeFolder.value === folderName) {
    activeFolder.value = null
  }
}

const openCanvas = async (id: string) => {
  await navigateTo(`/canvas/${id}`)
}

const handleConfirmCreate = async (payload: { title: string; description: string; folder: string | null; tags: string[] }) => {
  isCreating.value = true
  errorMessage.value = null

  try {
    const created = await createCanvas({
      title: payload.title,
      description: payload.description || null,
      folder: payload.folder,
      tags: payload.tags
    })

    newCanvasModalOpen.value = false
    if (created?.id) {
      await navigateTo(`/canvas/${created.id}`)
    }
  } catch (err: any) {
    console.error('Erro ao criar quadro:', err)
    errorMessage.value = 'Falha ao criar o quadro. Tente novamente.'
  } finally {
    isCreating.value = false
  }
}

const openMoveModal = (item: CanvasSummary) => {
  targetCanvas.value = item
  moveModalOpen.value = true
}

const handleConfirmMove = async (folder: string | null) => {
  if (!targetCanvas.value) return
  await updateCanvasMetadata(targetCanvas.value.id, { folder })
  moveModalOpen.value = false
}

const openTagsModal = (item: CanvasSummary) => {
  targetCanvas.value = item
  tagsModalOpen.value = true
}

const handleConfirmTags = async (tags: string[]) => {
  if (!targetCanvas.value) return
  await updateCanvasMetadata(targetCanvas.value.id, { tags })
  tagsModalOpen.value = false
}

const handleDuplicate = async (id: string) => {
  try {
    await duplicateCanvas(id)
  } catch (err) {
    console.error('Erro ao duplicar quadro:', err)
  }
}

const handleDelete = async (id: string) => {
  if (confirm('Tem certeza de que deseja excluir este quadro?')) {
    try {
      await deleteCanvas(id)
    } catch (err) {
      console.error('Erro ao excluir quadro:', err)
    }
  }
}

const triggerImport = () => {
  fileInputRef.value?.click()
}

const handleFileImport = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    try {
      const created = await importJsonCanvas(file)
      if (created?.id) {
        await navigateTo(`/canvas/${created.id}`)
      }
    } catch (err) {
      console.error('Erro ao importar quadro:', err)
      errorMessage.value = 'Falha ao importar o arquivo .canvas.'
    }
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
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

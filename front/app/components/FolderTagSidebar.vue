<template>
  <aside
    class="flex flex-col bg-bgPanel border-r border-divider h-full transition-all duration-300 flex-shrink-0 select-none"
    :class="isCollapsed ? 'w-16' : 'w-64 md:w-72'"
  >
    <!-- Top Header do Sidebar -->
    <div class="h-14 border-b border-divider flex items-center justify-between px-3 md:px-4 flex-shrink-0">
      <div v-if="!isCollapsed" class="flex items-center gap-2 overflow-hidden">
        <span class="text-base font-semibold text-textPrimary truncate font-interface">{{ title }}</span>
        <span class="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent font-medium font-mono">
          {{ totalItemsCount }}
        </span>
      </div>

      <!-- Botão Minimizar/Expandir Sidebar -->
      <button
        @click="isCollapsed = !isCollapsed"
        class="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        :title="isCollapsed ? 'Expandir painel' : 'Recolher painel'"
      >
        <SidebarIcon class="w-4 h-4" />
      </button>
    </div>

    <!-- Conteúdo Scrollável -->
    <div class="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
      <!-- MODO COLAPSADO: Ícones Rápidos -->
      <div v-if="isCollapsed" class="flex flex-col items-center gap-2 pt-2">
        <button
          @click="$emit('select-folder', null); $emit('select-tag', null)"
          class="p-2.5 rounded-xl transition-all cursor-pointer"
          :class="selectedFolder === null && selectedTag === null ? 'bg-accent text-white shadow-md' : 'text-textSecondary hover:bg-black/5 dark:hover:bg-white/5'"
          title="Todos os itens"
        >
          <LayersIcon class="w-4 h-4" />
        </button>

        <button
          @click="$emit('select-folder', '__uncategorized__')"
          class="p-2.5 rounded-xl transition-all cursor-pointer"
          :class="selectedFolder === '__uncategorized__' ? 'bg-accent text-white shadow-md' : 'text-textSecondary hover:bg-black/5 dark:hover:bg-white/5'"
          title="Sem pasta"
        >
          <InboxIcon class="w-4 h-4" />
        </button>

        <div class="w-8 h-px bg-divider my-1"></div>

        <div
          v-for="folder in allFolders"
          :key="folder"
          @click="$emit('select-folder', folder)"
          class="p-2.5 rounded-xl transition-all cursor-pointer relative group"
          :class="selectedFolder === folder ? 'bg-accent/20 text-accent border border-accent/40' : 'text-textSecondary hover:bg-black/5 dark:hover:bg-white/5'"
          :title="'Pasta: ' + folder"
        >
          <FolderIcon class="w-4 h-4" />
        </div>
      </div>

      <!-- MODO EXPANDIDO: Menu Completo Samsung Notes Style -->
      <div v-else class="space-y-4">
        <!-- 1. Categorias Principais -->
        <div class="space-y-1">
          <!-- Todas as notas/quadros -->
          <button
            @click="$emit('select-folder', null); $emit('select-tag', null)"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer"
            :class="selectedFolder === null && selectedTag === null ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-textSecondary hover:text-textPrimary hover:bg-black/5 dark:hover:bg-white/5'"
          >
            <div class="flex items-center gap-2.5 truncate">
              <LayersIcon class="w-4 h-4 flex-shrink-0" />
              <span class="truncate">Todos os {{ itemLabel }}</span>
            </div>
            <span
              class="text-xs px-2 py-0.5 rounded-full font-mono font-medium"
              :class="selectedFolder === null && selectedTag === null ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 text-textSecondary'"
            >
              {{ totalItemsCount }}
            </span>
          </button>

          <!-- Sem Pasta (Uncategorized) -->
          <button
            @click="$emit('select-folder', '__uncategorized__')"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer"
            :class="selectedFolder === '__uncategorized__' ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-textSecondary hover:text-textPrimary hover:bg-black/5 dark:hover:bg-white/5'"
          >
            <div class="flex items-center gap-2.5 truncate">
              <InboxIcon class="w-4 h-4 flex-shrink-0" />
              <span class="truncate">Sem pasta</span>
            </div>
            <span
              class="text-xs px-2 py-0.5 rounded-full font-mono font-medium"
              :class="selectedFolder === '__uncategorized__' ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 text-textSecondary'"
            >
              {{ uncategorizedCount }}
            </span>
          </button>
        </div>

        <!-- 2. Seção de Pastas -->
        <div class="pt-2 border-t border-divider">
          <div class="flex items-center justify-between px-2 mb-1.5">
            <span class="text-[11px] font-semibold tracking-wider uppercase text-textSecondary/80 font-interface">
              Pastas
            </span>
            <button
              @click="isCreatingFolder = true"
              class="p-1 rounded-md text-textSecondary hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
              title="Nova pasta"
            >
              <PlusIcon class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Input inline para criar nova pasta -->
          <div v-if="isCreatingFolder" class="px-2 py-1 mb-2">
            <div class="flex items-center gap-1.5 p-1 rounded-lg bg-bgRoot border border-accent">
              <FolderIcon class="w-3.5 h-3.5 text-accent flex-shrink-0 ml-1" />
              <input
                ref="newFolderInputRef"
                v-model="newFolderName"
                type="text"
                placeholder="Nome da pasta..."
                class="w-full bg-transparent text-xs text-textPrimary focus:outline-none font-interface"
                @keyup.enter="handleCreateFolder"
                @keyup.esc="isCreatingFolder = false; newFolderName = ''"
              />
              <button
                @click="handleCreateFolder"
                class="px-1.5 py-0.5 rounded text-[10px] bg-accent text-white font-medium cursor-pointer"
              >
                OK
              </button>
              <button
                @click="isCreatingFolder = false; newFolderName = ''"
                class="px-1 text-[11px] text-textSecondary hover:text-textPrimary cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Lista de Pastas -->
          <div class="space-y-0.5">
            <div
              v-for="folder in allFolders"
              :key="folder"
              class="group relative flex items-center justify-between px-3 py-1.5 rounded-xl text-xs md:text-sm transition-all cursor-pointer"
              :class="selectedFolder === folder ? 'bg-accent/15 text-accent border border-accent/30 font-semibold' : 'text-textSecondary hover:text-textPrimary hover:bg-black/5 dark:hover:bg-white/5 font-medium'"
              @click="$emit('select-folder', folder)"
            >
              <div class="flex items-center gap-2.5 truncate min-w-0 pr-2">
                <FolderIcon class="w-3.5 h-3.5 flex-shrink-0 text-accent" />
                <span class="truncate">{{ folder }}</span>
              </div>

              <div class="flex items-center gap-1">
                <span
                  class="text-[11px] px-1.5 py-0.2 rounded-full font-mono"
                  :class="selectedFolder === folder ? 'bg-accent/20 text-accent' : 'text-textSecondary/60 group-hover:text-textSecondary'"
                >
                  {{ getFolderCount(folder) }}
                </span>

                <!-- Ações da Pasta (Renomear / Excluir) -->
                <div class="opacity-0 group-hover:opacity-100 flex items-center transition-opacity ml-1">
                  <button
                    @click.stop="openRenameModal(folder)"
                    class="p-1 hover:text-accent rounded text-textSecondary"
                    title="Renomear pasta"
                  >
                    <Edit3Icon class="w-3 h-3" />
                  </button>
                  <button
                    @click.stop="handleDeleteFolder(folder)"
                    class="p-1 hover:text-red-400 rounded text-textSecondary"
                    title="Excluir pasta"
                  >
                    <Trash2Icon class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div v-if="allFolders.length === 0 && !isCreatingFolder" class="px-3 py-2 text-[11px] text-textSecondary/60 italic">
              Nenhuma pasta criada.
            </div>
          </div>
        </div>

        <!-- 3. Seção de Tags (Samsung Notes Tag Filtering) -->
        <div class="pt-2 border-t border-divider">
          <div class="flex items-center justify-between px-2 mb-2">
            <span class="text-[11px] font-semibold tracking-wider uppercase text-textSecondary/80 font-interface">
              Tags
            </span>
            <button
              v-if="selectedTag"
              @click="$emit('select-tag', null)"
              class="text-[10px] text-accent hover:underline cursor-pointer"
            >
              Limpar filtro
            </button>
          </div>

          <!-- Nuvem de Chips de Tags -->
          <div class="flex flex-wrap gap-1.5 px-1">
            <button
              v-for="tagItem in availableTags"
              :key="tagItem.name"
              @click="toggleTag(tagItem.name)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border"
              :class="selectedTag === tagItem.name
                ? 'bg-accent text-white border-accent shadow-sm shadow-accent/25 scale-102'
                : 'bg-bgSurface border-divider text-textSecondary hover:border-accent/40 hover:text-textPrimary hover:bg-black/5 dark:hover:bg-white/5'"
            >
              <span>#{{ tagItem.name }}</span>
              <span
                class="text-[10px] px-1 rounded-full font-mono"
                :class="selectedTag === tagItem.name ? 'bg-white/25 text-white' : 'bg-black/10 dark:bg-white/10 text-textSecondary'"
              >
                {{ tagItem.count }}
              </span>
            </button>

            <div v-if="availableTags.length === 0" class="px-2 py-1 text-[11px] text-textSecondary/60 italic">
              Nenhuma tag aplicada ainda.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para Renomear Pasta -->
    <div
      v-if="renameModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div class="bg-bgPanel border border-divider rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
        <h3 class="text-sm font-semibold text-textPrimary font-interface">Renomear Pasta</h3>
        <input
          v-model="renameFolderNewName"
          type="text"
          class="w-full px-3 py-2 rounded-xl bg-bgRoot border border-divider text-sm text-textPrimary focus:outline-none focus:border-accent font-interface"
          placeholder="Novo nome..."
          @keyup.enter="confirmRenameFolder"
        />
        <div class="flex items-center justify-end gap-2">
          <button
            @click="renameModalOpen = false"
            class="px-3 py-1.5 rounded-xl border border-divider text-xs text-textSecondary hover:text-textPrimary font-medium cursor-pointer"
          >
            Cancelar
          </button>
          <button
            @click="confirmRenameFolder"
            class="px-4 py-1.5 rounded-xl bg-accent hover:bg-accent/90 text-xs font-semibold text-white cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  FolderIcon,
  LayersIcon,
  InboxIcon,
  PlusIcon,
  Edit3Icon,
  Trash2Icon,
  SidebarIcon
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    items: Array<{ id: string; folder?: string | null; tags?: string[] }>
    folders: string[]
    selectedFolder?: string | null
    selectedTag?: string | null
    title?: string
    itemLabel?: string
  }>(),
  {
    selectedFolder: null,
    selectedTag: null,
    title: 'Biblioteca',
    itemLabel: 'itens'
  }
)

const emit = defineEmits<{
  (e: 'select-folder', folder: string | null): void
  (e: 'select-tag', tag: string | null): void
  (e: 'create-folder', name: string): void
  (e: 'rename-folder', payload: { oldName: string; newName: string }): void
  (e: 'delete-folder', name: string): void
}>()

const isCollapsed = ref(false)
const isCreatingFolder = ref(false)
const newFolderName = ref('')
const newFolderInputRef = ref<HTMLInputElement | null>(null)

const renameModalOpen = ref(false)
const renamingFolderOldName = ref('')
const renameFolderNewName = ref('')

// Todas as pastas (união de pastas passadas com pastas presentes nos itens)
const allFolders = computed(() => {
  const set = new Set<string>(props.folders)
  for (const item of props.items) {
    if (item.folder) set.add(item.folder)
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const totalItemsCount = computed(() => props.items.length)

const uncategorizedCount = computed(() => {
  return props.items.filter((i) => !i.folder).length
})

const getFolderCount = (folderName: string) => {
  return props.items.filter((i) => i.folder === folderName).length
}

// Lista de tags existentes e sua respectiva frequência
const availableTags = computed(() => {
  const counts: Record<string, number> = {}
  for (const item of props.items) {
    const tags = Array.isArray(item.tags) ? item.tags : []
    for (const t of tags) {
      const clean = typeof t === 'string' ? t.trim() : ''
      if (clean) {
        counts[clean] = (counts[clean] || 0) + 1
      }
    }
  }

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const toggleTag = (tagName: string) => {
  if (props.selectedTag === tagName) {
    emit('select-tag', null)
  } else {
    emit('select-tag', tagName)
  }
}

const handleCreateFolder = () => {
  const clean = newFolderName.value.trim()
  if (!clean) {
    isCreatingFolder.value = false
    return
  }
  emit('create-folder', clean)
  emit('select-folder', clean)
  newFolderName.value = ''
  isCreatingFolder.value = false
}

const openRenameModal = (folder: string) => {
  renamingFolderOldName.value = folder
  renameFolderNewName.value = folder
  renameModalOpen.value = true
}

const confirmRenameFolder = () => {
  const clean = renameFolderNewName.value.trim()
  if (clean && clean !== renamingFolderOldName.value) {
    emit('rename-folder', {
      oldName: renamingFolderOldName.value,
      newName: clean
    })
  }
  renameModalOpen.value = false
}

const handleDeleteFolder = (folder: string) => {
  if (confirm(`Tem certeza de que deseja excluir a pasta "${folder}"? Os itens serão movidos para "Sem pasta".`)) {
    emit('delete-folder', folder)
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--divider, rgba(255, 255, 255, 0.1));
  border-radius: 4px;
}
</style>

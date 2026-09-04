<template>
  <div
    class="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto transition-all duration-300 select-none"
    role="navigation"
    aria-label="Navegação Principal do Aresta"
  >
    <!-- Container Principal da Navbar com transição suave de expansão lateral -->
    <nav
      class="relative flex items-center h-14 md:h-16 rounded-2xl bg-bgPanel/95 backdrop-blur-md border border-divider shadow-2xl transition-all duration-300 ease-in-out"
      :class="[
        isCollapsed
          ? 'w-14 md:w-16 px-0 justify-center'
          : 'w-[94vw] max-w-[640px] md:max-w-[780px] 2xl:max-w-[840px] px-3 md:px-5 justify-between'
      ]"
    >
      <!-- ESTADO COLAPSADO (Modo Mínimo / Retraído - Ícone Unificado do Aresta) -->
      <template v-if="isCollapsed">
        <button
          @click="toggleCollapse"
          class="flex items-center justify-center w-full h-full p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-accent/40 group"
          title="Aresta - Expandir Menu de Navegação"
          aria-label="Aresta - Expandir Menu de Navegação"
        >
          <ArestaLogoGraph :size="34" :to="null" />
        </button>
      </template>

      <!-- ESTADO EXPANDIDO (Modo Completo) -->
      <template v-else>
        <!-- Item 1: Quadros & Canvas (Local) -->
        <NuxtLink
          to="/canvas"
          class="nav-item group"
          :class="{ 'nav-item-active': route.path.startsWith('/canvas') }"
          title="Quadros Infinitos & Canvas"
        >
          <LayoutGridIcon class="w-4 h-4 md:w-4.5 md:h-4.5 text-accent group-hover:scale-110 transition-transform" />
          <span class="hidden md:inline font-interface text-xs md:text-sm font-medium tracking-tight">Quadros</span>
        </NuxtLink>

        <!-- Item 2: Anotações Livres / Notas (Local) -->
        <NuxtLink
          to="/notes"
          class="nav-item group"
          :class="{ 'nav-item-active': route.path.startsWith('/notes') }"
          title="Anotações Livres & Markdown"
        >
          <FileTextIcon class="w-4 h-4 md:w-4.5 md:h-4.5 text-accent group-hover:scale-110 transition-transform" />
          <span class="hidden md:inline font-interface text-xs md:text-sm font-medium tracking-tight">Notas</span>
        </NuxtLink>

        <!-- Item 3: Ecossistema / Estante (Dropdown de Livros & Grafo) -->
        <div class="relative" ref="ecosystemMenuRef">
          <button
            @click="isEcosystemOpen = !isEcosystemOpen"
            class="nav-item group focus:outline-none"
            :class="{ 'nav-item-active': isEcosystemOpen }"
            title="Menu do Ecossistema Aresta"
            aria-haspopup="true"
            :aria-expanded="isEcosystemOpen"
          >
            <BookOpenIcon class="w-4 h-4 md:w-4.5 md:h-4.5 text-accent group-hover:scale-110 transition-transform" />
            <span class="hidden md:inline font-interface text-xs md:text-sm font-medium tracking-tight">Estante</span>
            <ChevronUpIcon
              class="w-3.5 h-3.5 text-textSecondary transition-transform duration-200"
              :class="{ 'rotate-180': isEcosystemOpen }"
            />
          </button>

          <!-- Dropdown Flutuante do Ecossistema -->
          <div
            v-if="isEcosystemOpen"
            class="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 md:w-72 p-2 rounded-2xl bg-bgPanel/95 backdrop-blur-md border border-divider shadow-2xl flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 duration-200"
          >
            <!-- 1. Meus Livros (Reader) -->
            <a
              :href="readerUrl + '/library'"
              class="flex items-center gap-3 p-2.5 rounded-xl transition-colors text-textPrimary hover:bg-black/5 dark:hover:bg-white/5 group"
            >
              <div class="p-2 rounded-lg bg-accent/15 text-accent group-hover:scale-105 transition-transform">
                <BookIcon class="w-4 h-4" />
              </div>
              <div class="flex flex-col text-left">
                <span class="font-interface text-xs md:text-sm font-medium text-textPrimary group-hover:text-accent">Meus Livros</span>
                <span class="font-interface text-[10px] md:text-xs text-textSecondary">Leitor EPUB & PDF 3D (:3010)</span>
              </div>
            </a>

            <!-- 2. Grafo de Conhecimento -->
            <a
              :href="readerUrl + '/grafo'"
              class="flex items-center gap-3 p-2.5 rounded-xl transition-colors text-textPrimary hover:bg-black/5 dark:hover:bg-white/5 group"
            >
              <div class="p-2 rounded-lg bg-accent/15 text-accent group-hover:scale-105 transition-transform">
                <NetworkIcon class="w-4 h-4" />
              </div>
              <div class="flex flex-col text-left">
                <span class="font-interface text-xs md:text-sm font-medium text-textPrimary group-hover:text-accent">Grafo de Conhecimento</span>
                <span class="font-interface text-[10px] md:text-xs text-textSecondary">Conexões semânticas de leitura</span>
              </div>
            </a>

            <!-- 3. Conversor de PDF para EPUB -->
            <a
              :href="readerUrl + '/conversor'"
              class="flex items-center gap-3 p-2.5 rounded-xl transition-colors text-textPrimary hover:bg-black/5 dark:hover:bg-white/5 group"
            >
              <div class="p-2 rounded-lg bg-accent/15 text-accent group-hover:scale-105 transition-transform">
                <FileCode2Icon class="w-4 h-4" />
              </div>
              <div class="flex flex-col text-left">
                <span class="font-interface text-xs md:text-sm font-medium text-textPrimary group-hover:text-accent">Conversor</span>
                <span class="font-interface text-[10px] md:text-xs text-textSecondary">Conversão de PDF para EPUB</span>
              </div>
            </a>

            <!-- 4. Loja / Catálogo -->
            <a
              :href="readerUrl + '/loja'"
              class="flex items-center gap-3 p-2.5 rounded-xl transition-colors text-textPrimary hover:bg-black/5 dark:hover:bg-white/5 group"
            >
              <div class="p-2 rounded-lg bg-accent/15 text-accent group-hover:scale-105 transition-transform">
                <ShoppingBagIcon class="w-4 h-4" />
              </div>
              <div class="flex flex-col text-left">
                <span class="font-interface text-xs md:text-sm font-medium text-textPrimary group-hover:text-accent">Loja & Catálogo</span>
                <span class="font-interface text-[10px] md:text-xs text-textSecondary">Descubra novas obras</span>
              </div>
            </a>
          </div>
        </div>

        <!-- Item 4: Logo Central (Grafo Vivo -> Início dos Quadros) -->
        <div class="flex items-center justify-center px-1.5">
          <ArestaLogoGraph :size="36" to="/canvas" />
        </div>

        <!-- Item 5: Revisão (Flashcards & Retenção) -->
        <a
          :href="readerUrl + '/revisao'"
          class="nav-item group"
          title="Revisão (Flashcards & Resumos)"
        >
          <LayersIcon class="w-4 h-4 md:w-4.5 md:h-4.5 text-accent group-hover:scale-110 transition-transform" />
          <span class="hidden md:inline font-interface text-xs md:text-sm font-medium tracking-tight">Revisão</span>
        </a>

        <!-- Item 6: Conta -->
        <a
          :href="readerUrl + '/conta'"
          class="nav-item group"
          title="Sua Conta & Status Pro"
        >
          <UserIcon class="w-4 h-4 md:w-4.5 md:h-4.5 text-accent group-hover:scale-110 transition-transform" />
          <span class="hidden md:inline font-interface text-xs md:text-sm font-medium tracking-tight">Conta</span>
        </a>

        <!-- Item 7: Alternar Tema (Escuro / Claro / Sepia) -->
        <button
          @click="toggleThemeMode"
          class="p-2 rounded-xl text-textSecondary hover:text-textPrimary hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
          :title="themeMode === 'dark' ? 'Tema: Escuro (clique para Claro)' : (themeMode === 'light' ? 'Tema: Claro (clique para Livro)' : 'Tema: Livro (clique para Escuro)')"
          aria-label="Alternar tema da interface"
        >
          <SunIcon v-if="themeMode === 'light'" class="w-4 h-4 text-amber-500 hover:rotate-45 transition-transform" />
          <PaletteIcon v-else-if="themeMode === 'sepia'" class="w-4 h-4 text-amber-600 dark:text-amber-300 hover:scale-110 transition-transform" />
          <MoonIcon v-else class="w-4 h-4 text-accent hover:-rotate-12 transition-transform" />
        </button>

        <!-- Botão de Colapso / Minimizar -->
        <button
          @click="toggleCollapse"
          class="p-2 rounded-xl text-textSecondary hover:text-textPrimary hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
          title="Minimizar barra de navegação"
          aria-label="Minimizar barra de navegação"
        >
          <Minimize2Icon class="w-4 h-4" />
        </button>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {
  LayoutGridIcon,
  FileTextIcon,
  BookOpenIcon,
  BookIcon,
  NetworkIcon,
  FileCode2Icon,
  ShoppingBagIcon,
  LayersIcon,
  UserIcon,
  ChevronUpIcon,
  Minimize2Icon,
  SunIcon,
  MoonIcon,
  PaletteIcon
} from 'lucide-vue-next'
import ArestaLogoGraph from '~/components/ArestaLogoGraph.vue'
import { useSettings } from '~/composables/useSettings'

const { themeMode, toggleThemeMode } = useSettings()
const route = useRoute()

const readerUrl = ref('http://localhost:3010')

const isCollapsed = ref(false)
const isEcosystemOpen = ref(false)
const ecosystemMenuRef = ref<HTMLElement | null>(null)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  if (isCollapsed.value) {
    isEcosystemOpen.value = false
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (ecosystemMenuRef.value && !ecosystemMenuRef.value.contains(e.target as Node)) {
    isEcosystemOpen.value = false
  }
}

// Auto-recolher no editor de canvas (/canvas/:id) ou no mobile
watch(
  () => route.path,
  (newPath) => {
    isEcosystemOpen.value = false
    if (newPath.startsWith('/canvas/') && newPath !== '/canvas') {
      // Dentro da tela de edição/desenho, inicia retraída para não atrapalhar o canvas
      isCollapsed.value = true
    } else if (typeof window !== 'undefined' && window.innerWidth < 768) {
      isCollapsed.value = true
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 768 || (route.path.startsWith('/canvas/') && route.path !== '/canvas')) {
      isCollapsed.value = true
    } else {
      isCollapsed.value = false
    }
    window.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  color: var(--text-secondary, #6B7280);
  transition: all 0.25s ease;
  font-family: 'Inter', sans-serif;
  user-select: none;
  cursor: pointer;
}

@media (max-width: 767px) {
  .nav-item {
    padding: 0.5rem;
  }
}

.nav-item:hover {
  color: var(--text-primary, #F2F2F2);
  background-color: rgba(255, 255, 255, 0.06);
}

:global([data-theme="light"]) .nav-item:hover {
  color: #18191B;
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-item-active {
  color: var(--accent, #E57B55);
  background-color: rgba(229, 123, 85, 0.14);
  border: 1px solid rgba(229, 123, 85, 0.35);
  box-shadow: 0 0 12px rgba(229, 123, 85, 0.18);
}

:global([data-theme="light"]) .nav-item-active {
  color: var(--accent, #E57B55);
  background-color: rgba(229, 123, 85, 0.12);
  border: 1px solid rgba(229, 123, 85, 0.3);
  box-shadow: 0 0 12px rgba(229, 123, 85, 0.15);
}
</style>

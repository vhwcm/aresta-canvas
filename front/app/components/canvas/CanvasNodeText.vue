<template>
  <!-- 1. NOTA / CARD (type === 'text') - Bloco retangular estilo card Markdown -->
  <div
    v-if="!isLooseText"
    class="w-full h-full flex flex-col rounded-xl overflow-hidden bg-bgPanel/95 border backdrop-blur-md transition-all shadow-md"
    :class="[
      isSelected ? 'border-primary shadow-primary/20 ring-2 ring-primary/40' : 'border-divider hover:border-dividerHover'
    ]"
    :style="{ borderColor: node.color ? node.color : undefined }"
  >
    <!-- Header/Color Bar -->
    <div
      v-if="node.color"
      class="h-1.5 w-full flex-shrink-0"
      :style="{ backgroundColor: node.color }"
    ></div>

    <!-- Body -->
    <div
      class="flex-1 p-3.5 overflow-auto text-textPrimary text-sm select-text custom-scrollbar"
      @dblclick.stop="startEditing"
    >
      <div v-if="isEditing" class="h-full flex flex-col">
        <textarea
          ref="textareaRef"
          v-model="localText"
          class="w-full flex-1 bg-transparent text-textPrimary text-sm resize-none focus:outline-none font-interface placeholder:text-textSecondary/50"
          placeholder="Escreva em Markdown..."
          @blur="finishEditing"
          @keydown.esc="finishEditing"
        ></textarea>
        <div class="flex items-center justify-between pt-2 border-t border-divider text-xs text-textSecondary">
          <span>Markdown suportado</span>
          <button
            class="px-2 py-0.5 rounded bg-primary text-white hover:bg-primaryHover text-xs font-medium"
            @click.stop="finishEditing"
          >
            Pronto
          </button>
        </div>
      </div>

      <div
        v-else
        class="h-full prose prose-invert prose-sm max-w-none text-textPrimary leading-relaxed break-words"
        v-html="renderedMarkdown"
      ></div>
    </div>
  </div>

  <!-- 2. TEXTO LIVRE (type === 'loose_text') - Escrita livre sem quadrado, sem borda e sem fundo -->
  <div
    v-else
    class="w-full h-full flex flex-col bg-transparent transition-all relative group cursor-text"
    :class="[
      isSelected
        ? 'ring-1 ring-primary/50 border border-dashed border-primary/50 rounded-lg'
        : 'border border-transparent'
    ]"
    @dblclick.stop="startEditing"
    @click="onLooseClick"
  >
    <!-- Modo de Edição Livre: textarea transparente sem poluição visual -->
    <div v-if="isEditing" class="w-full h-full flex flex-col p-1.5">
      <textarea
        ref="textareaRef"
        v-model="localText"
        class="w-full h-full bg-transparent resize-none focus:outline-none font-interface text-base leading-relaxed placeholder:text-textSecondary/40 placeholder:italic select-text custom-scrollbar"
        :style="{ color: node.color || 'inherit' }"
        placeholder="Comece a escrever livremente..."
        @blur="finishEditing"
        @keydown.esc="finishEditing"
        @keydown.ctrl.enter="finishEditing"
      ></textarea>
    </div>

    <!-- Modo de Leitura Livre: renderização direta e limpa no canvas -->
    <div
      v-else
      class="w-full h-full p-1.5 overflow-visible select-text leading-relaxed break-words font-interface"
      :style="{ color: node.color || 'inherit' }"
    >
      <div
        v-if="localText.trim()"
        class="prose prose-invert prose-base max-w-none font-interface leading-relaxed"
        :style="{ color: node.color || 'inherit' }"
        v-html="renderedMarkdown"
      ></div>
      <div
        v-else
        class="text-textSecondary/40 italic text-sm select-none py-1"
      >
        Clique para escrever...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import { marked } from 'marked';
import type { CanvasNode } from '~/interfaces/canvas';

const props = defineProps<{
  node: CanvasNode;
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:text', text: string): void;
  (e: 'delete'): void;
}>();

const isLooseText = computed(() => props.node.type === 'loose_text');

const isEditing = ref(false);
const localText = ref(props.node.text || '');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

marked.setOptions({
  gfm: true,
  breaks: true,
});

const renderedMarkdown = computed(() => {
  if (!props.node.text || props.node.text.trim() === '') {
    return isLooseText.value
      ? '<span class="text-textSecondary/40 italic text-sm">Clique para escrever...</span>'
      : '<span class="text-textSecondary/40 italic">Clique duas vezes para editar...</span>';
  }
  return marked.parse(props.node.text);
});

const startEditing = () => {
  localText.value = props.node.text || '';
  isEditing.value = true;
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus();
      const len = textareaRef.value.value.length;
      textareaRef.value.setSelectionRange(len, len);
    }
  });
};

const finishEditing = () => {
  if (!isEditing.value) return;
  isEditing.value = false;
  const trimmed = localText.value.trim();
  // Se for texto solto recém-criado e o usuário não digitou nada, limpa o nó vazio
  if (isLooseText.value && trimmed === '' && !props.node.text) {
    emit('delete');
    return;
  }
  emit('update:text', localText.value);
};

const onLooseClick = (e: MouseEvent) => {
  if (props.isSelected && !isEditing.value) {
    e.stopPropagation();
    startEditing();
  }
};

// Iniciar edição automaticamente quando um nó de texto livre for criado vazio
onMounted(() => {
  if (isLooseText.value && (!props.node.text || props.node.text === '')) {
    startEditing();
  }
});
</script>

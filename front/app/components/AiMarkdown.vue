<template>
  <div
    ref="containerRef"
    class="ai-markdown-content font-interface text-sm md:text-base leading-relaxed text-textPrimary/90 space-y-3"
    v-html="parsedHtml"
  ></div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { ref, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{
  content: string
}>()

const containerRef = ref<HTMLElement | null>(null)

marked.setOptions({
  gfm: true,
  breaks: true,
})

const parsedHtml = computed(() => {
  if (!props.content) return ''
  return marked.parse(props.content)
})
</script>

<style scoped>
.ai-markdown-content :deep(h1) {
  font-family: serif;
  font-size: 1.65rem;
  font-weight: 400;
  color: #F2F2F2;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.5rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.ai-markdown-content :deep(h2) {
  font-family: serif;
  font-size: 1.35rem;
  font-weight: 400;
  color: #F2F2F2;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 0.35rem;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  line-height: 1.35;
}

.ai-markdown-content :deep(h3) {
  font-size: 1.1rem;
  font-weight: 600;
  color: #F2F2F2;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.ai-markdown-content :deep(p) {
  margin-bottom: 0.85rem;
  color: rgba(242, 242, 242, 0.9);
  line-height: 1.65;
}

.ai-markdown-content :deep(strong) {
  color: #FFFFFF;
  font-weight: 600;
}

.ai-markdown-content :deep(em) {
  font-style: italic;
  color: #A0A3A8;
}

.ai-markdown-content :deep(code) {
  font-family: monospace;
  font-size: 0.85em;
  color: #E57B55;
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.ai-markdown-content :deep(ul) {
  list-style-type: disc;
  padding-left: 1.4rem;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
}

.ai-markdown-content :deep(blockquote) {
  border-left: 3px solid #E57B55;
  padding-left: 1rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  background-color: rgba(255, 255, 255, 0.02);
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  font-style: italic;
  color: #7A7D84;
}
</style>

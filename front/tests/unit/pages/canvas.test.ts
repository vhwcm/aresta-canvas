import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import CanvasIndexPage from '~/pages/canvas/index.vue';

// Mock useCanvas
const mockCreateCanvas = vi.fn();
const mockFetchCanvases = vi.fn();
const mockFetchCanvasFolders = vi.fn().mockResolvedValue([]);
const mockCanvasesList = ref<any[]>([]);
const mockCanvasFolders = ref<string[]>([]);
const mockIsLoading = ref(false);

vi.mock('~/composables/useCanvas', () => ({
  useCanvas: () => ({
    canvasesList: mockCanvasesList,
    canvasFolders: mockCanvasFolders,
    isLoading: mockIsLoading,
    fetchCanvases: mockFetchCanvases,
    fetchCanvasFolders: mockFetchCanvasFolders,
    createCanvas: mockCreateCanvas,
    updateCanvasMetadata: vi.fn(),
    deleteCanvas: vi.fn(),
    duplicateCanvas: vi.fn(),
    importJsonCanvas: vi.fn(),
  }),
}));

describe('Canvas Index Page (/canvas)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty state when there are no canvases', () => {
    mockCanvasesList.value = [];
    const wrapper = mount(CanvasIndexPage, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          FolderTagSidebar: { template: '<aside>Sidebar</aside>' },
          ArestaLogoGraph: { template: '<div>Logo</div>' },
        },
      },
    });

    expect(wrapper.text()).toContain('Nenhum quadro encontrado');
    expect(wrapper.text()).toContain('Criar Novo Quadro');
  });

  it('opens new canvas modal and calls createCanvas', async () => {
    mockCreateCanvas.mockResolvedValueOnce({ id: 'test-canvas-123', title: 'Quadro sem título' });

    const wrapper = mount(CanvasIndexPage, {
      global: {
        stubs: {
          NuxtLink: { template: '<a><slot /></a>' },
          FolderTagSidebar: { template: '<aside>Sidebar</aside>' },
          ArestaLogoGraph: { template: '<div>Logo</div>' },
        },
      },
    });

    // Clica no botão de novo quadro
    const openModalBtn = wrapper.find('button.bg-accent');
    expect(openModalBtn.exists()).toBe(true);
    await openModalBtn.trigger('click');

    // Modal deve estar aberto
    expect(wrapper.text()).toContain('Criar Novo Quadro');

    // Clica no botão de confirmar criação
    const confirmBtn = wrapper.findAll('button').find((b) => b.text().includes('Criar Quadro'));
    expect(confirmBtn).toBeDefined();
    await confirmBtn?.trigger('click');

    expect(mockCreateCanvas).toHaveBeenCalled();
  });
});

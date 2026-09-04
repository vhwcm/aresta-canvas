import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BottomNavbar from '../../../app/components/BottomNavbar.vue';

// Mock useRoute
vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/canvas' }),
}));

// Mock useSettings
vi.mock('../../../app/composables/useSettings', () => ({
  useSettings: () => ({
    themeMode: { value: 'dark' },
    toggleThemeMode: vi.fn(),
  }),
}));

describe('BottomNavbar component', () => {
  it('renderiza os links principais de navegação', () => {
    const wrapper = mount(BottomNavbar, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    });

    expect(wrapper.text()).toContain('Quadros');
    expect(wrapper.text()).toContain('Notas');
    expect(wrapper.text()).toContain('Estante');
    expect(wrapper.text()).toContain('Revisão');
    expect(wrapper.text()).toContain('Conta');
  });

  it('permite colapsar e expandir a barra', async () => {
    const wrapper = mount(BottomNavbar, {
      global: {
        stubs: {
          NuxtLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    });

    const minimizeBtn = wrapper.find('button[title="Minimizar barra de navegação"]');
    expect(minimizeBtn.exists()).toBe(true);
    await minimizeBtn.trigger('click');

    // Quando colapsada, exibe o botão com o logo para expandir
    const expandBtn = wrapper.find('button[title="Aresta - Expandir Menu de Navegação"]');
    expect(expandBtn.exists()).toBe(true);
  });
});

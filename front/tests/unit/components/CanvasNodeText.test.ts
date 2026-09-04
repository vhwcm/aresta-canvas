import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import CanvasNodeText from '../../../app/components/canvas/CanvasNodeText.vue';
import type { CanvasNode } from '../../../app/interfaces/canvas';

describe('CanvasNodeText Component', () => {
  it('renderiza nota em modo card (type === text) com borda e painel', () => {
    const node: CanvasNode = {
      id: 'node-1',
      type: 'text',
      x: 10,
      y: 10,
      width: 240,
      height: 150,
      text: 'Texto do card',
      color: '#E57B55',
    };

    const wrapper = mount(CanvasNodeText, {
      props: {
        node,
        isSelected: false,
      },
    });

    const rootDiv = wrapper.find('div');
    // Deve conter classes de painel / card
    expect(rootDiv.classes()).toContain('bg-bgPanel/95');
    expect(rootDiv.classes()).toContain('rounded-xl');
    expect(wrapper.html()).toContain('Texto do card');
    // Deve conter barra de cor de cabeçalho
    expect(wrapper.find('.h-1\\.5').exists()).toBe(true);
  });

  it('renderiza texto livre (type === loose_text) sem quadrado, sem painel e sem bordas', () => {
    const node: CanvasNode = {
      id: 'node-loose-1',
      type: 'loose_text',
      x: 50,
      y: 50,
      width: 280,
      height: 60,
      text: 'Texto Livre no Canvas',
      color: '#3B82F6',
    };

    const wrapper = mount(CanvasNodeText, {
      props: {
        node,
        isSelected: false,
      },
    });

    const rootDiv = wrapper.find('div');
    // NÃO deve conter classes de card/quadrado
    expect(rootDiv.classes()).not.toContain('bg-bgPanel/95');
    expect(rootDiv.classes()).toContain('bg-transparent');
    expect(rootDiv.classes()).toContain('border-transparent');
    // NÃO deve conter a barra de cor de cabeçalho
    expect(wrapper.find('.h-1\\.5').exists()).toBe(false);
    // Deve conter o texto renderizado
    expect(wrapper.text()).toContain('Texto Livre no Canvas');
  });

  it('inicia automaticamente em modo de edição ao criar texto livre vazio', async () => {
    const node: CanvasNode = {
      id: 'node-loose-empty',
      type: 'loose_text',
      x: 100,
      y: 100,
      width: 280,
      height: 56,
      text: '',
    };

    const wrapper = mount(CanvasNodeText, {
      props: {
        node,
        isSelected: true,
      },
    });

    // Aguarda atualização reativa do nextTick do onMounted
    await wrapper.vm.$nextTick();
    await nextTick();

    // Textarea deve estar ativo e pronto para digitação imediata
    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);
    expect(textarea.attributes('placeholder')).toContain('Comece a escrever livremente...');

    // Digita texto livre
    await textarea.setValue('Minha anotação solta');
    await textarea.trigger('blur');

    // Deve emitir update:text com o conteúdo digitado
    expect(wrapper.emitted('update:text')).toBeTruthy();
    expect(wrapper.emitted('update:text')?.[0]).toEqual(['Minha anotação solta']);
  });

  it('emite evento delete ao sair da edição de texto livre sem ter digitado nada', async () => {
    const node: CanvasNode = {
      id: 'node-loose-discard',
      type: 'loose_text',
      x: 100,
      y: 100,
      width: 280,
      height: 56,
      text: '',
    };

    const wrapper = mount(CanvasNodeText, {
      props: {
        node,
        isSelected: true,
      },
    });

    await wrapper.vm.$nextTick();
    await nextTick();

    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);

    // Usuário sai sem digitar nada (blur com string vazia)
    await textarea.setValue('   ');
    await textarea.trigger('blur');

    // Deve emitir delete para limpar o nó vazio automaticamente
    expect(wrapper.emitted('delete')).toBeTruthy();
  });
});

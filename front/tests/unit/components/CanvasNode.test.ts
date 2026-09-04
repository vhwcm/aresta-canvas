import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CanvasNode from '../../../app/components/canvas/CanvasNode.vue';
import type { CanvasNode as ICanvasNode } from '../../../app/interfaces/canvas';

describe('CanvasNode Component', () => {
  it('exibe o botão Criar Nota na mini toolbar quando nó de texto está selecionado', async () => {
    const node: ICanvasNode = {
      id: 'node-text-1',
      type: 'text',
      x: 100,
      y: 100,
      width: 260,
      height: 160,
      text: 'Ideia de arquitetura',
      color: '#E57B55',
    };

    const wrapper = mount(CanvasNode, {
      props: {
        node,
        isSelected: true,
        zoom: 1,
      },
      global: {
        stubs: {
          CanvasNodeText: {
            template: '<div class="stub-text">Texto</div>',
          },
          CanvasNodeShape: true,
          CanvasNodeBook: true,
          CanvasNodeNote: true,
        },
      },
    });

    const createNoteButton = wrapper.findAll('button').find((b) => b.attributes('title')?.includes('Salvar como Nota'));
    expect(createNoteButton).toBeDefined();
    expect(createNoteButton?.text()).toContain('Criar Nota');

    await createNoteButton?.trigger('click');
    expect(wrapper.emitted('convert-to-note')).toBeTruthy();
    expect(wrapper.emitted('convert-to-note')?.[0]).toEqual(['node-text-1']);
  });

  it('não inicia drag-start quando pointerdown ocorre dentro de um textarea', async () => {
    const node: ICanvasNode = {
      id: 'node-text-2',
      type: 'loose_text',
      x: 50,
      y: 50,
      width: 280,
      height: 60,
      text: 'Texto Livre',
    };

    const wrapper = mount(CanvasNode, {
      props: {
        node,
        isSelected: false,
        zoom: 1,
      },
      global: {
        stubs: {
          CanvasNodeText: {
            template: '<div><textarea class="inner-textarea">Texto Livre</textarea></div>',
          },
          CanvasNodeShape: true,
          CanvasNodeBook: true,
          CanvasNodeNote: true,
        },
      },
    });

    const textarea = wrapper.find('.inner-textarea');
    expect(textarea.exists()).toBe(true);

    await textarea.trigger('pointerdown');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('drag-start')).toBeFalsy();
  });
});

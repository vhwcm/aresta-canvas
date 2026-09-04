import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FolderTagSidebar from '../../../app/components/FolderTagSidebar.vue';

describe('FolderTagSidebar component', () => {
  const items = [
    { id: '1', folder: 'Estudos', tags: ['filosofia', 'livros'] },
    { id: '2', folder: 'Estudos', tags: ['filosofia'] },
    { id: '3', folder: null, tags: ['ideias'] },
  ];
  const folders = ['Estudos', 'Projetos'];

  it('renderiza contagem total e itens sem pasta', () => {
    const wrapper = mount(FolderTagSidebar, {
      props: {
        items,
        folders,
        title: 'Quadros',
        itemLabel: 'quadros',
      },
    });

    expect(wrapper.text()).toContain('Quadros');
    expect(wrapper.text()).toContain('Todos os quadros');
    expect(wrapper.text()).toContain('Sem pasta');
    expect(wrapper.text()).toContain('Estudos');
    expect(wrapper.text()).toContain('Projetos');
  });

  it('emite select-folder ao clicar em uma pasta', async () => {
    const wrapper = mount(FolderTagSidebar, {
      props: {
        items,
        folders,
      },
    });

    const folderButton = wrapper.findAll('.cursor-pointer').find((el) => el.text().includes('Estudos'));
    expect(folderButton).toBeDefined();
    await folderButton?.trigger('click');

    expect(wrapper.emitted('select-folder')).toBeTruthy();
    expect(wrapper.emitted('select-folder')?.[0]).toEqual(['Estudos']);
  });

  it('calcula tags e emite select-tag ao clicar na tag', async () => {
    const wrapper = mount(FolderTagSidebar, {
      props: {
        items,
        folders,
      },
    });

    expect(wrapper.text()).toContain('#filosofia');
    const tagButton = wrapper.findAll('button').find((el) => el.text().includes('#filosofia'));
    expect(tagButton).toBeDefined();

    await tagButton?.trigger('click');
    expect(wrapper.emitted('select-tag')).toBeTruthy();
    expect(wrapper.emitted('select-tag')?.[0]).toEqual(['filosofia']);
  });
});

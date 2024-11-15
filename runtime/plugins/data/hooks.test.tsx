import '@testing-library/jest-dom';

import { getConfig } from '../../config';

import { PluginOperationTypes, PluginTypes } from '../../../types';
import { usePluginSlot } from './hooks';

const mockSlotChanges = [
  {
    op: PluginOperationTypes.INSERT,
    widget: {
      id: 'login',
      priority: 50,
      type: PluginTypes.IFRAME,
      url: '/login',
      title: 'Login',
    },
  },
];

jest.mock('../../config');

describe('usePluginSlots', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('when the plugin slot is defined', () => {
    it('returns keepDefault and plugin changes', () => {
      (getConfig as jest.Mock).mockImplementation(() => (
        {
          pluginSlots: {
            example_plugin_slot: {
              plugins: mockSlotChanges,
              keepDefault: true,
            },
          },
        }
      ));

      const slotConfig = usePluginSlot('example_plugin_slot');
      expect(slotConfig.keepDefault).toBe(true);
      expect(slotConfig.plugins).toBe(mockSlotChanges);
    });
  });

  describe('when the plugin slot is not defined', () => {
    it('returns true for keepDefault and no plugin changes', () => {
      (getConfig as jest.Mock).mockImplementation(() => {});

      const slotConfig = usePluginSlot('example_plugin_slot');

      expect(slotConfig.keepDefault).toBe(true);
      expect(slotConfig.plugins).toStrictEqual([]);
    });
  });
});

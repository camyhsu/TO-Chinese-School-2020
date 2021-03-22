/* global describe, it */
import { expect } from 'chai';
import { randSalt, sha256Hex } from '../../src/utils/utilities.js';

describe('Utilities', () => {
  describe('sha256Hex', () => {
    it('sha256Hex', async () => {
      expect(sha256Hex('admin', '5678')).eq('ab460250edf5cf49c700eea578db1fcec74dd34d953485660d4ce0931408cad8');
    });
  });

  describe('randSalt', () => {
    it('randSalt', async () => {
      expect(randSalt().length).eq(8);
      expect(randSalt(6, true).length).eq(12);

      expect(randSalt(12).length).eq(16);
      expect(randSalt(12, true).length).eq(24);
    });
  });
});

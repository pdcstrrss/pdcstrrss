import { AstroGlobal } from 'astro';
import { defineMvc } from './astro-mvc';
import { NotImplementedError } from './errors.js';
import { camelCase } from 'lodash';

const httpMethods = ['get', 'post', 'put', 'delete', 'patch'] as const;

describe('astroMvc', () => {
  describe.each(httpMethods)('%s', (method) => {
    const methodOptions = {
      [camelCase(`define_${method}`)]() {
        return {
          data: method,
        };
      },
    };

    it('returns data', () => {
      const Astro = { request: { method: method.toUpperCase() } } as AstroGlobal;
      const { data } = defineMvc({ Astro, ...methodOptions });
      expect(data).toEqual(method);
    });

    it('returns not implemented', () => {
      const Astro = { request: { method: method.toUpperCase() } } as AstroGlobal;
      expect(() => defineMvc({ Astro })).toThrowError(NotImplementedError);
    });
  });
});

import type { AstroGlobal } from 'astro';
import { NotImplementedError } from './errors.js';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

type AstroMvcError = string;

type AstroMvcMethod = <T>(context: AstroGlobal) => { data: T; errors: AstroMvcError; astro: AstroGlobal };

type AstroMvcConfig = {
  notImplemented?: boolean;
};

type AstroMvcMethodFunctions = {
  // Delete is a reserved word in JS, so for consistency we added a define before each method.
  defineGet?: AstroMvcMethod;
  definePost?: AstroMvcMethod;
  definePut?: AstroMvcMethod;
  defineDelete?: AstroMvcMethod;
  definePatch?: AstroMvcMethod;
};

type AstroMvcOptions = {
  Astro: AstroGlobal;
  config?: Partial<AstroMvcConfig>;
} & AstroMvcMethodFunctions;

const defaultAstroMvcConfig: AstroMvcConfig = {
  notImplemented: true,
};

const getMethodFromAstroRequest = ({ method, methods }: { method: HttpMethod; methods: AstroMvcMethodFunctions }) => {
  switch (method) {
    case 'get':
      return methods.defineGet;
    case 'post':
      return methods.definePost;
    case 'put':
      return methods.definePut;
    case 'delete':
      return methods.defineDelete;
    case 'patch':
      return methods.definePatch;
    default:
      return undefined;
  }
};

export function defineMvc<T>({
  Astro,
  defineGet,
  definePost,
  definePut,
  defineDelete,
  definePatch,
  config,
}: AstroMvcOptions) {
  const _config = { ...defaultAstroMvcConfig, ...config };
  const method = Astro.request.method.toLowerCase() as HttpMethod;
  const methods = { defineGet, definePost, definePut, defineDelete, definePatch };
  const methodFn = getMethodFromAstroRequest({ method, methods });

  if (!methodFn) {
    if (_config.notImplemented) {
      // throw new Response('Not implemented', { status: 501 });
      throw new NotImplementedError();
    }
    return { data: undefined, errors: undefined, astro: Astro };
  }

  return methodFn<T>(Astro);
}

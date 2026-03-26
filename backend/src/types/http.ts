export interface RequestLike {
  body: Record<string, unknown>;
  params: Record<string, string>;
  query: Record<string, string | undefined>;
  headers: { authorization?: string };
  user?: { id: number; email: string; name: string };
}

export interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => ResponseLike;
}

export type NextFunctionLike = () => void;

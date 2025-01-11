interface ExpressLikeRequest {
  originalUrl: string;
  url: string;
}

interface FastifyLikeRequest {
  raw?: { url: string };
  url: string;
}

export const getRequestOriginalUrl = (request: ExpressLikeRequest | FastifyLikeRequest): string => {
  if ('originalUrl' in request) {
    return request.originalUrl || request.url;
  }

  return request.raw?.url || request.url;
};

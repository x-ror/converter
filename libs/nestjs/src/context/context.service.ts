import type { Request } from 'express';
import { RequestContext } from 'nestjs-request-context';

import { Injectable } from '@nestjs/common';

import { HEADER_REQUEST_ID, HEADER_SESSION_ID, HEADER_TRACE_ID } from '@sdk/common';
import { getRequestOriginalUrl } from '@sdk/common';

interface RequestHeadersInterface {
  traceId: string;
  reqId: string;
  sessionId: string;
  url: string;
}

@Injectable()
export class RequestContextService {
  public static getRequestHeaders(): RequestHeadersInterface | Record<string, never> {
    const request: Request = RequestContext.currentContext?.req;
    if (!request) {
      return {};
    }

    const traceId = request.headers[HEADER_TRACE_ID] as string;
    const reqId = request.headers[HEADER_REQUEST_ID] as string;
    const sessionId = request.headers[HEADER_SESSION_ID] as string;

    return {
      traceId,
      reqId,
      sessionId,
      url: getRequestOriginalUrl(request),
    };
  }

  public getRequestHeaders(): RequestHeadersInterface | Record<string, never> {
    return RequestContextService.getRequestHeaders();
  }

  public static hasContext(): boolean {
    return !!RequestContext.currentContext;
  }

  public static getRequestId(): string | undefined {
    return RequestContext.currentContext?.req.headers[HEADER_REQUEST_ID] as string;
  }
}

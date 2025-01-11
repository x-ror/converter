export interface MinimalContextInterface {
  module: string;
  action?: string;
}

export interface UnknownContextInterface extends MinimalContextInterface {
  [key: string]: any;
}

// Add Service ContextInterfaces Here
export type LoggingContextInterface = UnknownContextInterface | MinimalContextInterface;

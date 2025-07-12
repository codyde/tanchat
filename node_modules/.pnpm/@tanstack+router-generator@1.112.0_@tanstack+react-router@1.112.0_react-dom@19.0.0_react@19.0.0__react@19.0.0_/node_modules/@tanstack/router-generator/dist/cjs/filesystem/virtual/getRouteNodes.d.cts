import { VirtualRouteNode } from '@tanstack/virtual-file-routes';
import { GetRouteNodesResult, RouteNode } from '../../types.cjs';
import { Config } from '../../config.cjs';
export declare function getRouteNodes(tsrConfig: Config, root: string): Promise<GetRouteNodesResult>;
export declare function getRouteNodesRecursive(tsrConfig: Config, root: string, fullDir: string, nodes?: Array<VirtualRouteNode>, parent?: RouteNode): Promise<Array<RouteNode>>;

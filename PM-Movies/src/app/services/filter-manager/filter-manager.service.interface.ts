import { Content } from '../../models';

/**
 * Service handling filters on content and related update triggers
 */
export interface IFilterManagerService {

  filterContents(contents: Content[]): Content[];
}

import { ICommand } from '@nestjs/cqrs';

export class UnlinkKeywordEntryCommand implements ICommand {
    constructor(
        public readonly keyword: string,
        public readonly entryId: number
    ) {}
}

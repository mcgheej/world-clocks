import { Service } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import type { Command, NoPayloadCommand } from './command';

@Service()
export class CommandBusService {
  private readonly commandSubject = new Subject<
    Command<string, unknown> | NoPayloadCommand<string>
  >();

  readonly commands$: Observable<Command<string, unknown> | NoPayloadCommand<string>> =
    this.commandSubject.asObservable();

  emit<TType extends string>(command: NoPayloadCommand<TType>): void;
  emit<TType extends string, TPayload>(command: Command<TType, TPayload>): void;
  emit<TType extends string, TPayload>(
    command: Command<TType, TPayload> | NoPayloadCommand<TType>,
  ): void {
    this.commandSubject.next(command as Command<string, unknown> | NoPayloadCommand<string>);
  }
}

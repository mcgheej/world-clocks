import { inject, Service } from '@angular/core';
import { CommandBusService } from '@core/command-bus/index';
import { AppBarMenuCommands } from '@core/app-commands/index';
import { AboutDialog } from './about-dialog';
import { Dialog } from '@angular/cdk/dialog';

@Service()
export class AboutService {
  private commandBus = inject(CommandBusService);
  private dialog = inject(Dialog);

  constructor() {
    this.commandBus.commands$.subscribe((command) => {
      if (command.type === AppBarMenuCommands.SHOW_ABOUT) {
        this.dialog.open(AboutDialog, {
          width: '275px',
          height: '120px',
        });
      }
    });
  }
}

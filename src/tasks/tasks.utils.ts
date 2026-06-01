import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskUtils {
  splitString(text: string) {
    return text.split(' ');
  }
}

@Injectable()
export class DimasConsole {
  dimasContole() {
    return 'Praticando Injeção de dependencia......';
  }
}

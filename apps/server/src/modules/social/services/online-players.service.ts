import { Injectable } from '@nestjs/common';

@Injectable()
export class OnlinePlayersService {
  private readonly onlineUserIds = new Set<string>();

  markOnline(userId: string): void {
    this.onlineUserIds.add(userId);
  }

  markOffline(userId: string): void {
    this.onlineUserIds.delete(userId);
  }

  isOnline(userId: string): boolean {
    return this.onlineUserIds.has(userId);
  }
}

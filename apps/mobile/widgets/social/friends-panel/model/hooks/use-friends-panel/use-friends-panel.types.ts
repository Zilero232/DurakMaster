import type { FriendRowAction } from '@/entities/social';

export type FriendsTab = 'friends' | 'requests' | 'search';

export type ManageAction = Exclude<FriendRowAction, 'invite' | 'invited'>;

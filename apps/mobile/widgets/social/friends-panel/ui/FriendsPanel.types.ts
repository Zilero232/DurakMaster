import type { FriendRowAction } from '@/entities/social';

export type FriendsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

export type FriendsTab = 'friends' | 'requests' | 'search';

export type ManageAction = Exclude<FriendRowAction, 'invite' | 'invited'>;

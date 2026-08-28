import type { PublicProfile } from '@durak-master/schemas';

export type PlayerCardProps = {
  profile: PublicProfile | null;
  isOpen: boolean;
  onClose: () => void;
};
